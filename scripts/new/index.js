import { parseHTML } from "linkedom"
import { getTmDbInfo } from "../db/tmdb.js"
import { sql } from "../utils.js"
import { scrapUGC, getUGCTheaters } from "../providers/ugc.js"
import { scrapPathe, getPatheTheaters } from "../providers/pathe.js"
import { scrapMk2, getMk2Theaters } from "../providers/mk2.js"
import { getMovie, insertMovie } from "../db/requests.js"

const moviesFromUgc = async () => {
  const $pathe = await fetch(
    "https://www.ugc.fr/filmsAjaxAction!getFilmsAndFilters.action?filter=onPreview&page=30010&cinemaId=&reset=false&"
  )
  const html = await $pathe.text()
  const { document } = parseHTML(html)

  const $movies = [
    ...document.querySelectorAll(".results-container > .row > *"),
  ]

  const moviesWithAVP = $movies.map((movie) => {
    const $link = movie.querySelector(".img-wrapper a")

    return {
      title: $link?.getAttribute("title").toLowerCase().trim(),
      link: `https://www.ugc.fr/${$link?.href}`,
    }
  })

  const newMovies = await Promise.all(
    moviesWithAVP.map(({ title, link }) =>
      getTmDbInfo(title).then((m) => ({ ...m, link }))
    )
  )

  await scrapUGC(newMovies)

  for (const movie of newMovies) {
    const { link, ...m } = movie
    const existingMovie = await getMovie(m.id)

    if (existingMovie) continue

    await insertMovie(m)
  }
}

const init = async () => {
  await moviesFromUgc()
  await scrapPathe()
  await scrapMk2()

  sql.end()
}

const cinemas = async () => {
  await getMk2Theaters()
  await getUGCTheaters()
  await getPatheTheaters()
}

init()
