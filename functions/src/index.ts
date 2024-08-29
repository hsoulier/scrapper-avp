import { onRequest } from "firebase-functions/v2/https"
// import type {
//   ResponseDataCinema,
//   ResponseMovieInfo,
//   MovieDoc,
//   ConstantKeys,
//   VERSION_TYPE,
//   EARLY_TYPE,
// } from "./types"
// import { db } from "./firebase"
// import { Timestamp } from "firebase-admin/firestore"
import { getCinemaShows, setMovieInfo } from "./pathe"
import { db, COLL_REFS } from "./firebase"

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

export const scrapPathe = onRequest(async (request, response) => {
  console.log("🚀 Pathé scrapping started")
  try {
    const data = new Map()

    for (const cinema of CINEMAS) {
      console.log("🥷 Fetched cinema shows -> ", cinema)
      await getCinemaShows(cinema, data)
    }

    const parsedData = Object.fromEntries(data.entries())
    for (const slug in parsedData) {
      await setMovieInfo(slug)

      const shows = parsedData[slug]
      const batch = db.batch()
      for (const show of shows) {
        for (const day of show.days) {
          batch.set(COLL_REFS.SHOWS.doc(`${day.date}-${slug}`), {
            day: new Date(day.date),
            tags: day.tags,
            showId: slug,
            cinemaName: show.cinema,
            movie: slug,
          })
        }
      }
      await batch.commit()
    }

    response.json(Object.fromEntries(data.entries()))
  } catch (error) {
    console.error(error)
    response.json({ error })
  }
})
