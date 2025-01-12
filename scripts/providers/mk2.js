import { parseHTML } from "linkedom"
import { getTmDbInfo } from "../db/tmdb.js"
import {
  getMovie,
  getShow,
  getCinemaBySlug,
  insertCinema,
  insertMovie,
  insertShow,
} from "../db/requests.js"

const listAVPs = [
  "avant-premieres-et-seances-exclusives",
  "avant-premieres-avec-equipe",
]

const debug = {
  movies: 0,
  shows: 0,
}

const getDataFromPage = async (page) => {
  const res = await fetch(page)

  const data = await res.text()

  const { document } = parseHTML(data)

  return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
}

export const scrapMk2 = async () => {
  const props = await getDataFromPage(
    "https://www.mk2.com/ile-de-france/evenements"
  )

  const info = props?.pageProps?.events?.content.filter((c) =>
    listAVPs.includes(c.slug)
  )

  const events = info
    ?.map((e) => e.events.filter((a) => a.type.id === "avant-premiere"))
    .flat()

  const $movies = events?.map((m) => {
    return {
      title: m.name,
      link: `https://www.mk2.com/ile-de-france/evenement/${m.slug}`,
    }
  })

  const moviesData = await Promise.all(
    $movies.map(({ title, link }) =>
      getTmDbInfo(title).then((m) => ({ ...m, link }))
    )
  )

  for (const movie of moviesData) {
    const { link, ...m } = movie

    if (Object.keys(m).length === 0) {
      const props = await getDataFromPage(link)

      const newMovie = {
        id: parseInt(props.pageProps.event.id, 10),
        title: props.pageProps.event.name,
        synopsis: props.pageProps.event.description,
        director: "",
        duration: null,
        release: new Date(props.pageProps.event.startDate).toLocaleDateString(
          "en-GB"
        ),
        imdbId: "",
        poster: props.pageProps.event.graphicUrl || "",
      }

      const currentMovie = moviesData.findIndex((m) => m.link === link)

      moviesData[currentMovie] = { ...newMovie, link }

      const existingMovie = await getMovie(newMovie.id)

      if (existingMovie) continue

      await insertMovie(newMovie)

      debug.movies++

      continue
    }

    const existingMovie = await getMovie(m.id)

    if (existingMovie) continue

    await insertMovie(m)

    debug.movies++
  }

  for (const movie of moviesData) {
    const props = await getDataFromPage(movie.link)

    const event = props.pageProps.event

    for (const session of event.sessionsByFilmAndCinema[0].sessions) {
      const language =
        session.attributes.find((a) => a.id === "VS00000005").shortName ===
        "VOSTF"
          ? "vost"
          : "vf"

      const cinemaSlug = event.sessionsByFilmAndCinema[0].cinema.slug

      const cinema = await getCinemaBySlug(cinemaSlug)

      const cinemaId = cinema?.id

      const show = {
        id: session.sessionId,
        cinemaId,
        language,
        date: session.showTime,
        avpType: event.genres[0].id === "equipe-du-film" ? "AVPE" : "AVP",
        movieId: movie.id,
        linkShow: `https://www.mk2.com/panier/seance/tickets?cinemaId=${session.cinemaId}&sessionId=${session.sessionId}`,
        linkMovie: movie.link,
      }

      const existingShow = await getShow(show.id)

      if (existingShow) continue

      await insertShow(show)

      debug.shows++
    }
  }

  console.log("✅ Mk2 scrapping done", debug)
}

export const getMk2Theaters = async () => {
  const res = await fetch("https://www.mk2.com/salles")

  const data = await res.text()

  const { document } = parseHTML(data)

  const cinemasData = JSON.parse(
    document.querySelector("#__NEXT_DATA__").textContent
  ).props.pageProps.cinemaComplexes

  for (const [index, c] of cinemasData.entries()) {
    const cinema = c.cinemas[0]

    const existingCinema = await getCinemaBySlug(cinema.slug)

    if (existingCinema) continue

    await insertCinema({
      id: `mk2-${index + 1}`,
      slug: cinema.slug,
      name: cinema.name,
      arrondissement: parseInt(c.zipcode.split("750")[1]),
      address: `${c.address}, ${c.zipcode} ${cinema.city}`,
      link: `https://www.mk2.com/salle/${c.slug}`,
      source: "mk2",
    })
  }
}
