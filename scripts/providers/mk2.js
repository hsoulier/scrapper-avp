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

export const scrapMk2 = async () => {
  console.log("🕵️‍♂️ Scraping mk2...")

  const res = await fetch("https://www.mk2.com/ile-de-france/evenements")

  const data = await res.text()

  const { document } = parseHTML(data)

  const info = JSON.parse(
    document.querySelector("#__NEXT_DATA__").textContent
  ).props?.pageProps?.events?.content.filter((c) => listAVPs.includes(c.slug))

  const events = info
    ?.map((e) => e.events.filter((a) => a.type.id === "avant-premiere"))
    .flat()

  const $movies = events?.map((m) => {
    return {
      title: m.name,
      link: `https://www.mk2.com/ile-de-france/evenement/${m.slug}`,
    }
  })

  console.log("🏗️ Movies to fetch -> ", $movies.length)

  const moviesData = await Promise.all(
    $movies.map(({ title, link }) =>
      getTmDbInfo(title).then((m) => ({ ...m, link }))
    )
  )

  for (const movie of moviesData) {
    const { link, ...m } = movie
    const existingMovie = await getMovie(m.id)

    if (existingMovie) continue

    await insertMovie(m)
  }

  for (const movie of moviesData) {
    console.log("🎬 Movie fetched -> ", movie.title)

    const res = await fetch(movie.link)
    const data = await res.text()
    const { document } = parseHTML(data)

    const event = JSON.parse(
      document.querySelector("#__NEXT_DATA__").textContent
    ).props.pageProps.event

    for (const session of event.sessionsByFilmAndCinema[0].sessions) {
      const language =
        session.attributes.find((a) => a.id === "VS00000005").shortName ===
        "VOSTF"
          ? "vost"
          : "vf"

      const cinemaSlug =
        event.sessionsByFilmAndCinema[0].cinema.slug === "mk2-quai-seine"
          ? "mk2-quai-loire"
          : event.sessionsByFilmAndCinema[0].cinema.slug

      const cinemaId = await getCinemaBySlug(cinemaSlug)?.id

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
    }
  }

  console.log("✅ Mk2 scraping done!")
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
