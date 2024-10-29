import { parseHTML } from "linkedom"

const getMoviesPage = async () => {
  const res = await fetch("https://www.legrandrex.com/cinema")
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
    const [date, hours] = m.querySelector(".date-tout")?.textContent.split("à")

    const time = date.split("Le ").at(-1)

    const formattedDate = new Date()

    console.log(
      m.querySelector(".date-tout")?.textContent?.trim(),
      title,
      m.querySelector(".categorie-tout")?.textContent
    )

    return {
      title,
      date,
      // time,
      link,
    }
  })
}

getMoviesFromEventPage()
