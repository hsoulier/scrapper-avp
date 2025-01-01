import { parseHTML } from "linkedom"
import { readFileSync, writeFileSync } from "fs"
import { getTmDbInfo } from "../db/tmdb.js"
import { uniqueArray } from "../utils.js"
import { scrapUGC, getUGCTheaters } from "../providers/ugc.js"
import { scrapPathe, getPatheTheaters } from "../providers/pathe.js"
import { scrapMk2, getMk2Theaters } from "../providers/mk2.js"

const moviesFromUgc = async () => {
  const movies = JSON.parse(
    readFileSync("./database/movies.json", "utf-8") || "[]"
  )
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

  writeFileSync(
    "./database/movies.json",
    JSON.stringify(
      uniqueArray([
        ...movies,
        ...newMovies.map((m) => {
          const { link, ...rest } = m
          return rest
        }),
      ]),
      null,
      2
    ),
    "utf-8"
  )
}

const init = async () => {
  await moviesFromUgc()
  await scrapPathe()
  await scrapMk2()
}

const cinemas = async () => {
  await getMk2Theaters()
  await getUGCTheaters()
  await getPatheTheaters()
}

init()
