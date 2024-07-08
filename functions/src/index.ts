import { onRequest } from "firebase-functions/v2/https"
import type {
  ResponseDataCinema,
  ResponseMovieInfo,
  MovieDoc,
  ConstantKeys,
  VERSION_TYPE,
  EARLY_TYPE,
} from "./types"
import { COLL_REFS } from "./firebase"
import { Timestamp } from "firebase-admin/firestore"

// const DEFAULT_CITY = "paris"
const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
]

const CINEMAS = [
  "cinema-pathe-alesia",
  // "cinema-gaumont-aquaboulevard",
  // "cinema-les-7-batignolles",
  // "cinema-pathe-beaugrenelle",
  // "cinema-pathe-convention",
  // "cinema-pathe-la-villette",
  // "cinema-pathe-les-fauvettes",
  // "cinema-pathe-montparnos",
  // "cinema-pathe-opera-premier",
  // "cinema-pathe-parnasse",
  // "cinema-pathe-wepler",
]

const getCinemaShows = async (cinema: string) => {
  const resCinema = await fetch(
    `https://www.pathe.fr/api/cinema/${cinema}/shows?language=fr`
  )
  const showsRaw = (await resCinema.json())?.shows as ResponseDataCinema

  const showsWithEarly = Object.entries(showsRaw)
    .filter(([_, value]) => value?.isEarlyAVP)
    .map(([slug, value]) => ({ slug, ...value })) as ({
    slug: string
  } & ResponseDataCinema["shows"][0])[]

  const showsEarly = showsWithEarly.map((show) => {
    const { days, ...rest } = show
    const obj = Object.entries(show.days).filter(([, infos]) =>
      TAGS_AVP.includes(
        infos?.flag?.toLowerCase()?.trim()?.replaceAll(" ", "-")
      )
    )
    return { days: obj.map(([date, infos]) => ({ date, ...infos })), ...rest }
  })

  const shows = showsEarly
    .map((show) => {
      const { days, ...rest } = show
      return days.map((day) => ({
        ...day,
        ...rest,
        earlyType:
          day?.flag?.toLowerCase()?.trim()?.replaceAll(" ", "-") ===
          "avant-première"
            ? "AVANT_PREMIERE"
            : "AVANT_PREMIERE_WITH_CREW",
        apiLinkInfos: `https://www.pathe.fr/api/show/${rest.slug}/showtimes/${cinema}/${day.date}?language=fr`,
        movieLink: `https://www.pathe.fr/films/${rest.slug}`,
        movieInfoLink: `https://www.pathe.fr/api/show/${rest.slug}?language=fr`,
      }))
    })
    .flat()

  for (const show of shows) {
    const resShow = await fetch(show.apiLinkInfos)
    const dataShow = (await resShow.json())[0] as ResponseMovieInfo

    const resInfo = await fetch(show.movieInfoLink)
    const mediaInfo = (await resInfo.json()) as { title: string }

    const movieRef = COLL_REFS.MOVIES.where("pathId", "==", show.slug)
    const { empty, docs } = await movieRef.get()
    const movieData = docs?.[0]?.data() || {
      pathId: show.slug,
      name: mediaInfo.title,
      source: "PATHE",
      scrapDate: Timestamp.now(),
    }
    let movieId = docs?.[0]?.id
    if (empty) {
      console.log("🤷‍♂️ Movie not found")
      const { id } = await COLL_REFS.MOVIES.add(movieData)
      movieId = id
    }

    const formattedShow: MovieDoc = {
      name: mediaInfo.title,
      showId: show.slug,
      cinemaName: cinema,
      dateShow: Timestamp.fromDate(new Date(dataShow.time)),
      linkMovie: show.movieLink,
      linkShow: dataShow.refCmd,
      version: dataShow.version.toUpperCase() as ConstantKeys<
        typeof VERSION_TYPE
      >,
      earlyType: show.earlyType as ConstantKeys<typeof EARLY_TYPE>,
      source: "PATHE",
      scrapDate: Timestamp.now(),
      movie: COLL_REFS.MOVIES.doc(movieId),
    }

    const showRef = COLL_REFS.SHOWS.doc(`${show.slug}-${dataShow.time}`)
    const showDoc = await showRef.get()
    if (showDoc.exists) {
      console.log("🤷‍♂️ Show already exists")
      continue
    }
    await showRef.set(formattedShow)
  }
}

export const scrapPathe = onRequest(async (request, response) => {
  // async function getCinemaOfCity(city = DEFAULT_CITY) {
  //   const res = await fetch("https://www.pathe.fr/api/cities?language=fr")
  //   const data = await res.json()
  //   const parisTheaters = data.find((c: any) => c.slug === city)?.cinemas
  //   return parisTheaters
  // }
  console.log("🚀 Pathé scrapping started")
  try {
    for (const cinema of CINEMAS) {
      console.log("🥷 Fetched cinema shows -> ", cinema)
      const data = await getCinemaShows(cinema)
      response.json(data)
    }
  } catch (error) {
    response.json({ error })
  }
})
