import { writeFileSync } from "fs"
import { getIMDBInfo } from "./imdb.js"
import { getAlloCineInfo } from "./allocine.js"

const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
]

const specialTitles = ["séance all inclusive : ", "la séance live : "]

const previewsList = new Map()

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

const getCinemaShows = async (cinema) => {
  const resCinema = await fetch(
    `https://www.pathe.fr/api/cinema/${cinema}/shows?language=fr`
  )
  const dataCinema = await resCinema.json()

  // console.log("dataCinema -------------------------")
  // console.dir(dataCinema, { depth: null })
  // console.log("------------------------------------")

  const preFilterAVP = Object.entries(dataCinema.shows)
    .filter(([, value]) => value.isEarlyAVP)
    .map(([slug, value]) => ({
      title: slug.split("-").slice(0, -1).join(" "),
      cinema,
      slug,
      ...value,
    }))

  const filteredAVP = preFilterAVP.map((show) => {
    const { days, ...rest } = show
    const obj = Object.entries(show.days).filter(([, infos]) =>
      TAGS_AVP.includes(
        infos?.flag?.toLowerCase()?.trim()?.replaceAll(" ", "-")
      )
    )
    return { days: obj.map(([date, infos]) => ({ date, ...infos })), ...rest }
  })

  const shows = filteredAVP
    .map((show) => {
      const { days, ...rest } = show
      return days.map((day) => ({
        ...day,
        ...rest,
        AVPType:
          day?.flag?.toLowerCase()?.trim()?.replaceAll(" ", "-") ===
          "avant-première"
            ? "AVP"
            : "AVPE",
        apiLinkInfos: `https://www.pathe.fr/api/show/${rest.slug}/showtimes/${cinema}/${day.date}?language=fr`,
        movieLink: `https://www.pathe.fr/films/${rest.slug}`,
      }))
    })
    .flat()

  for (const show of shows) {
    const resShow = await fetch(show.apiLinkInfos)
    const dataShow = (await resShow.json())[0]

    const resMovie = await fetch(`https://www.pathe.fr/api/show/${show.slug}`)
    const dataMovie = await resMovie.json()

    // console.log("dataShow -------------------------")
    // console.dir(dataMovie, { depth: null })
    // console.log("------------------------------------")

    const formattedShow = {
      name: show.title,
      title: dataMovie.title,
      source: "pathe",
      showId: dataShow.refCmd.split("/").at(-2),
      linkShow: dataShow.refCmd,
      earlyType: show.AVPType,
      movieId: show.slug,
      linkMovie: show.movieLink,
      cinemaName: `pathe-${cinema}`,
      version: dataShow.version,
      dateShow: new Date(dataShow.time),
      cover: dataMovie.posterPath.lg,
      officialRelease: new Date(dataMovie.releaseAt.FR_FR),
    }

    const indexSpecialTitle = specialTitles.findIndex((t) =>
      formattedShow.title.toLowerCase().startsWith(t)
    )

    if (indexSpecialTitle !== -1) {
      formattedShow.title = formattedShow.title
        .toLowerCase()
        .replace(specialTitles[indexSpecialTitle], "")
    }

    const [imdbInfo, allocineInfo] = await Promise.all([
      await getIMDBInfo({
        title: formattedShow.title?.toLowerCase(),
        year: new Date(dataMovie.releaseAt.FR_FR).getFullYear(),
      }),
      await getAlloCineInfo({
        title: formattedShow.title?.toLowerCase(),
        year: new Date(dataMovie.releaseAt.FR_FR).getFullYear(),
      }),
    ])

    formattedShow.imdb = imdbInfo
    formattedShow.allocine = allocineInfo

    if (previewsList.has(show.slug)) {
      previewsList.set(show.slug, [
        ...previewsList.get(show.slug),
        formattedShow,
      ])
    } else {
      previewsList.set(show.slug, [formattedShow])
    }
  }
}

// async function getCinemaOfCity(city = DEFAULT_CITY) {
//   const res = await fetch("https://www.pathe.fr/api/cities?language=fr")
//   const data = await res.json()
//   const parisTheaters = data.find((c: any) => c.slug === city)?.cinemas
//   return parisTheaters
// }

export const scrapPathe = async () => {
  console.log("🚀 Pathé scrapping started")
  console.log("------------------------------------")
  for (const cinema of CINEMAS) {
    console.log("🥷 Fetched cinema shows -> ", cinema)
    console.group(cinema)
    await getCinemaShows(cinema)
    console.groupEnd()
  }
  console.log("------------------------------------")
  console.log(
    "✅ Pathé scrapping done -> number of movies retrieved",
    previewsList.length
  )

  writeFileSync(
    "./public/database.json",
    JSON.stringify(
      Array.from(previewsList, ([_, name]) => name).flat(),
      null,
      2
    )
  )
  // console.dir(Object.fromEntries(previewsList), { depth: null })
}

export const getPatheTheaters = async () => {
  const res = await fetch("https://www.pathe.fr/api/cinemas?language=fr")
  const data = await res.json()
  const info = []

  const cinemas = data.reduce((acc, cinema) => {
    const isInParis = cinema.citySlug === "paris"
    if (!isInParis) return acc

    acc.push({
      slug: `pathe-${cinema.slug}`,
      name: cinema.name,
      googleMaps: cinema.googleMyBusinessUrl,
      source: "pathe",
    })

    return acc
  }, [])

  writeFileSync("./public/cinema-info.json", JSON.stringify(cinemas, null, 2))
}
