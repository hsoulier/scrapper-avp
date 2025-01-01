import { readFileSync, writeFileSync } from "fs"
import { parseHTML } from "linkedom"
import { getTmDbInfo } from "../db/tmdb.js"
import { uniqueArray } from "../utils.js"

const cinemas = JSON.parse(
  readFileSync("./database/cinemas.json", "utf-8") || "[]"
)
const shows = JSON.parse(readFileSync("./database/shows.json", "utf-8") || "[]")

const listAVPs = [
  "avant-premieres-et-seances-exclusives",
  "avant-premieres-avec-equipe",
]

export const scrapMk2 = async () => {
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

  const movies = await Promise.all(
    $movies.map(({ title, link }) =>
      getTmDbInfo(title).then((m) => ({ ...m, link }))
    )
  )

  for (const movie of movies) {
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

      const showDetails = {
        id: session.sessionId,
        cinemaId: cinemas.find(
          (c) => c.name === event.sessionsByFilmAndCinema[0].cinema.name
        )?.id,
        language,
        date: session.showTime,
        avpType: event.genres[0].id === "equipe-du-film" ? "AVPE" : "AVP",
        movieId: movie.id.toString(),
        linkShow: `https://www.mk2.com/panier/seance/tickets?cinemaId=${session.cinemaId}&sessionId=${session.sessionId}`,
        linkMovie: movie.link,
      }

      shows.push(showDetails)
    }
  }

  writeFileSync(
    "./database/shows.json",
    JSON.stringify(uniqueArray(shows), null, 2),
    "utf-8"
  )
}

export const getMk2Theaters = async () => {
  const res = await fetch("https://www.mk2.com/salles")

  const data = await res.text()

  const { document } = parseHTML(data)

  const cinemas = JSON.parse(
    document.querySelector("#__NEXT_DATA__").textContent
  ).props.pageProps.cinemaComplexes

  console.log("🏗️ Cinemas to fetch -> ", cinemas)

  return cinemas.map((c, index) => {
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
}
