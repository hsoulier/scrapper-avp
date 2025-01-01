import { parseHTML } from "linkedom"
import { readFileSync, writeFileSync } from "fs"
import { getTmDbInfo } from "../db/tmdb.js"
import { uniqueArray } from "../utils.js"
import { scrapUGC } from "../providers/ugc.js"
import { scrapPathe } from "../providers/pathe.js"
import { scrapMk2 } from "../providers/mk2.js"

const movies = JSON.parse(
  readFileSync("./database/movies.json", "utf-8") || "[]"
)

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

  await scrapUGC(moviesWithAVP)

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

moviesFromUgc()
scrapPathe()
scrapMk2()
