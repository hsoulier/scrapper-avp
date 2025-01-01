import { readFileSync, writeFileSync } from "fs"
import { getTmDbInfo } from "../db/tmdb.js"
import { uniqueArray } from "../utils.js"

const cinemas = JSON.parse(
  readFileSync("./database/cinemas.json", "utf-8") || "[]"
)
const movies = JSON.parse(
  readFileSync("./database/movies.json", "utf-8") || "[]"
)
const shows = JSON.parse(readFileSync("./database/shows.json", "utf-8") || "[]")

const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
]

const previewsList = new Map()
const moviesUnique = new Set()
const showsList = []

const CINEMAS = [
  "cinema-pathe-alesia",
  "cinema-gaumont-aquaboulevard",
  "cinema-les-7-batignolles",
  "cinema-pathe-beaugrenelle",
  "cinema-pathe-convention",
  "cinema-pathe-la-villette",
  "cinema-pathe-les-fauvettes",
  "cinema-pathe-montparnos",
  "cinema-pathe-opera-premier",
  "cinema-pathe-parnasse",
  "cinema-pathe-wepler",
]

const fetchData = async (url, { fr } = { fr: true }) => {
  const res = await fetch(`${url}?${fr ? "language=fr" : ""}`)
  return await res.json()
}

const getCinemaShows2 = async (cinema) => {
  const dataCinema = await fetchData(
    `https://www.pathe.fr/api/cinema/${cinema}/shows`
  )

  const $movies = Object.entries(dataCinema.shows).reduce((acc, [slug, v]) => {
    if (!v.isEarlyAVP) return acc
    return [...acc, { ...v, slug }]
  }, [])

  $movies.map((m) => {
    const days = Object.values(m.days)

    if (days.filter((d) => d.tags.some((i) => TAGS_AVP.includes(i)))) {
      previewsList.set(m.slug, { ...m, cinema })
      moviesUnique.add(m.slug)
    }
  })
}

const getTitle = async (slug) => {
  const data = await fetchData(`https://www.pathe.fr/api/show/${slug}`)

  if (data.genres.includes("Courts-Métrages")) {
    console.log("🚫 Skip short movie")
    return null
  }

  const movie = await getTmDbInfo(data.title)

  if (!movie) {
    const { title, synopsis, directors, duration, releaseAt, posterPath } = data
    return {
      id: slug.split("-").at(-1),
      title,
      synopsis,
      director: directors,
      duration,
      release: releaseAt.FR_FR,
      imdbId: "",
      poster: posterPath.lg,
    }
  }

  return movie
}

export const scrapPathe = async () => {
  console.log("🚀 Pathé scrapping started")
  console.log("------------------------------------")

  for (const cinema of CINEMAS) {
    await getCinemaShows2(cinema)
  }

  for (const slug of [...moviesUnique].filter(Boolean)) {
    console.group(`🥷 Get movie ${slug}`)

    const movie = await getTitle(slug)

    if (!movie) {
      console.groupEnd()
      continue
    }

    !movies.find((m) => m.id === movie.id) && movies.push(movie)

    if (!previewsList.has(slug)) {
      console.groupEnd()
      continue
    }
    const showsEl = previewsList.get(slug)

    for (const date in showsEl.days) {
      const data = await fetchData(
        `https://www.pathe.fr/api/show/${slug}/showtimes/${showsEl.cinema}/${date}`,
        { fr: false }
      )

      shows.push(
        ...data.map((d) => ({
          id: d.refCmd.split("/").at(-2),
          cinemaId: cinemas.find((c) => c.slug === showsEl.cinema)?.id,
          language: d.version === "vf" ? "vf" : "vost",
          date: new Date(d.time),
          avpType: showsEl.days[date].tags.includes("avp-equipe")
            ? "AVPE"
            : "AVP",
          movieId: movie.id.toString(),
          linkShow: d.refCmd,
          linkMovie: `https://www.pathe.fr/films/${slug}`,
        }))
      )
    }

    console.groupEnd()
  }

  writeFileSync(
    "./database/movies.json",
    JSON.stringify(uniqueArray(movies), null, 2)
  )
  writeFileSync(
    "./database/shows.json",
    JSON.stringify(uniqueArray(shows), null, 2)
  )

  console.log("------------------------------------")
  console.log(
    `✅ Pathé scraped -> ${
      [...moviesUnique].filter(Boolean).length
    } movies and ${showsList.length} shows retrieved`
  )
}

export const getPatheTheaters = async () => {
  const data = await fetchData("https://www.pathe.fr/api/cinemas")

  const newCinemas = data.reduce((acc, cinema, index) => {
    const isInParis = cinema.citySlug === "paris"
    if (!isInParis) return acc

    const details = cinema.theaters[0]

    acc.push({
      id: `pathe-${index + 1}`,
      slug: cinema.slug,
      name: cinema.name,
      arrondissement: parseInt(details.addressCity.replace("750", "")),
      address: `${details.addressLine1}, ${details.addressZip} ${details.addressCity}`,
      source: "pathe",
    })

    return acc
  }, [])

  writeFileSync(
    "./database/cinemas.json",
    JSON.stringify(uniqueArray([...cinemas, ...newCinemas]), null, 2)
  )
}
