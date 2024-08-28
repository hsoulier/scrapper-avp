import { COLL_REFS } from "./firebase"
import type {
  ResponseDataCinema,
  ResponsePatheShow,
  ResponsePathShowDay,
} from "./types"

type ParsedShow = Omit<ResponsePatheShow, "days"> & {
  cinema: string
  days: (ResponsePathShowDay & { date: string })[]
}

const TAGS_AVP = ["AVP", "avp-equipe"]

export const getCinemaShows = async (
  cinema: string,
  shows: Map<string, ParsedShow[]>
) => {
  try {
    const res = await fetch(
      `https://www.pathe.fr/api/cinema/${cinema}/shows?language=fr`
    )
    const showsRaw = (await res.json())?.shows as ResponseDataCinema["shows"]

    // eslint-disable-next-line func-call-spacing
    const showsWithEarly = Object.entries(showsRaw).reduce(
      (acc, [slug, value]) => {
        if (!value?.isEarlyAVP) return acc
        const { days, ...rest } = value
        const parsedDays = Object.entries(days).reduce<ParsedShow["days"]>(
          (acc, [date, infos]) => {
            const hasTags = infos?.tags?.some((tag) => TAGS_AVP.includes(tag))
            if (!hasTags) return acc
            acc.push({ date, ...infos })
            return acc
          },
          []
        )
        if (acc.has(slug)) {
          acc.set(slug, [
            ...acc.get(slug)!,
            { ...rest, days: parsedDays, cinema },
          ])
          return acc
        }
        acc.set(slug, [{ ...rest, days: parsedDays, cinema }])
        return acc
      },
      shows
    )

    return showsWithEarly
  } catch (error) {
    console.error(error)
    return []
  }
}

export const setMovieInfo = async (slug: string) => {
  const res = await fetch(`https://www.pathe.fr/api/show/${slug}`)
  const movie = await res.json()
  await COLL_REFS.MOVIES.doc(slug).set(movie)
}
