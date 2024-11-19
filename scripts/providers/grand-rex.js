import { parseHTML } from "linkedom"
import { getMovieFromTmDb } from "../db/tmdb.js"

const getMoviesPage = async () => {
  const options = { method: "GET", headers: { "Accept-Language": "fr-FR" } }
  const res = await fetch("https://www.legrandrex.com/cinema", options)
  const text = await res.text()

  const { document } = parseHTML(text)

  return document
}

const getMoviesFromEventPage = async () => {
  const doc = await getMoviesPage()

  const movies = [
    ...doc.querySelectorAll("#list-all > .row > div > .row"),
  ].filter((m) => {
    const isAVP =
      m.querySelector(".categorie-tout")?.textContent === "Avant-premieres"

    const isVIP = m
      .querySelector(".title-movie-tout")
      ?.textContent?.endsWith("VIP")

    return isAVP && !isVIP
  })

  return movies.map((m) => {
    const title = m
      .querySelector(".title-movie-tout")
      ?.textContent?.replaceAll("(AVP)", "")
    const link = m.querySelector(".title-movie-tout a")?.href
    const [date] = m.querySelector(".date-tout")?.textContent.split("à")

    const match = date.match(/\d.*/)
    if (!match) throw new Error(`No date found for ${title}`)
    const result = match[0].trim()

    const formattedDate = new Date(result)

    getMovieFromTmDb(title, formattedDate.getFullYear()).then((res) => {
      const a = res.results?.[0]
      console.log(a?.title, a?.release_date, title)
    })

    return {
      title,
      date: formattedDate,
      // time,
      link,
    }
  })
}

const getMovieInfos = async () => {
  const movies = await getMoviesFromEventPage()

  // return movies.map(async (m) => {
  //   const res = await fetch(m.link)
  //   const text = await res.text()

  //   const { document } = parseHTML(text)

  //   const times = [
  //     ...document.querySelectorAll(
  //       'a[href="#seances"][role=button] > div:not(.hide)'
  //     ),
  //   ]

  //   // ? Reupere pas les horaires de la semaine courante ??
  //   const rows = [...document.querySelectorAll("div.seances > div:not(.hide)")]

  //   const index = rows.findIndex((r) => r.querySelector(".box-time-calendar"))

  //   const description = document
  //     .querySelector(".box-time-calendar")
  //     ?.textContent?.trim()

  //   // console.log(m.title, description, times.length, m.link)

  //   console.log(
  //     index,
  //     rows?.length,
  //     times?.length,
  //     // rows[index].textContent?.trim(),
  //     times[index]?.textContent?.trim(),
  //     m.date
  //   )

  //   return {
  //     ...m,
  //     description,
  //   }
  // })
}

getMovieInfos()
