import { writeFileSync } from "fs"
import { parseHTML } from "linkedom"
import { getTmDbInfo } from "../db/tmdb.js"
import { loadJson, uniqueArray } from "../utils.js"

const listAVPs = [
  "avant-premieres-et-seances-exclusives",
  "avant-premieres-avec-equipe",
]

export const scrapMk2 = async () => {
  console.log("🕵️‍♂️ Scraping mk2...")

  const cinemas = loadJson("./database/cinemas.json")
  const movies = loadJson("./database/movies.json")
  const shows = loadJson("./database/shows.json")

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

  const moviesToInsert = uniqueArray([
    ...movies,
    ...moviesData.map(({ link, ...rest }) => rest),
  ])

  writeFileSync(
    "./database/movies.json",
    JSON.stringify(moviesToInsert, null, 2),
    "utf-8"
  )

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

      const showDetails = {
        id: session.sessionId,
        cinemaId: cinemas.find((c) => c.slug === cinemaSlug)?.id,
        language,
        date: session.showTime,
        avpType: event.genres[0].id === "equipe-du-film" ? "AVPE" : "AVP",
        movieId: movie.id,
        linkShow: `https://www.mk2.com/panier/seance/tickets?cinemaId=${session.cinemaId}&sessionId=${session.sessionId}`,
        linkMovie: movie.link,
      }

      console.log(
        event.sessionsByFilmAndCinema[0].cinema.slug,
        cinemas.find((c) => c.slug === cinemaSlug)?.id
      )

      shows.push(showDetails)
    }
  }

  writeFileSync(
    "./database/shows.json",
    JSON.stringify(uniqueArray(shows), null, 2),
    "utf-8"
  )

  console.log("✅ Mk2 scraping done!")
}

export const getMk2Theaters = async () => {
  const res = await fetch("https://www.mk2.com/salles")

  const data = await res.text()

  const { document } = parseHTML(data)

  const cinemasData = JSON.parse(
    document.querySelector("#__NEXT_DATA__").textContent
  ).props.pageProps.cinemaComplexes

  const dataToInsert = cinemasData.map((c, index) => {
    const cinema = c.cinemas[0]
    return {
      id: `mk2-${index + 1}`,
      slug: cinema.slug,
      name: cinema.name,
      arrondissement: parseInt(c.zipcode.split("750")[1]),
      address: `${c.address}, ${c.zipcode} ${cinema.city}`,
      link: `https://www.mk2.com/salle/${c.slug}`,
      source: "mk2",
    }
  })

  const toInsert = [...loadJson("./database/cinemas.json"), ...dataToInsert]

  writeFileSync(
    "./database/cinemas.json",
    JSON.stringify(uniqueArray(toInsert), null, 2),
    "utf-8"
  )
}
