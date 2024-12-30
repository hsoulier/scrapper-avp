import { parseHTML } from "linkedom"
import { getTmDbInfo } from "../db/tmdb.js"
import { writeFileSync } from "fs"
import { scrapUGC } from "../providers/ugc.js"

const years = [
  new Date().getFullYear() + 1,
  new Date().getFullYear(),
  new Date().getFullYear() - 1,
]

const moviesFromUgc = async () => {
  const $pathe = await fetch(
    "https://www.ugc.fr/filmsAjaxAction!getFilmsAndFilters.action?filter=onPreview&page=30010&cinemaId=&reset=false&"
  )
  const html = await $pathe.text()
  const { document } = parseHTML(html)

  const $movies = [
    ...document.querySelectorAll(".results-container > .row > *"),
  ]

  const info = $movies.map((movie) => {
    const $link = movie.querySelector(".img-wrapper a")

    return {
      title: $link?.getAttribute("title").toLowerCase().trim(),
      link: `https://www.ugc.fr/${$link?.href}`,
    }
  })

  // for (const link of moviePages) {
  //   const $pathe = await fetch(link)
  //   const html = await $pathe.text()
  //   const { document } = parseHTML(html)
  // }

  const movies = await Promise.all(
    info.map(({ title, link }) =>
      getTmDbInfo(title, years).then((m) => ({
        ...m,
        link,
      }))
    )
  )

  const shows = []

  const a = await scrapUGC(info)

  // for (const movie of movies) {
  //   const $show = await fetch(
  //     "https://www.ugc.fr/filmsAjaxAction!getFilmsAndFilters.action?filter=onPreview&page=30010&cinemaId=&reset=false&"
  //   )
  //   const html = await $show.text()
  //   const { document } = parseHTML(html)
  // }

  return {
    movies: movies.map((m) => {
      const { link, ...rest } = m
      return rest
    }),
    shows,
  }
}

moviesFromUgc().then((m) => {
  // writeFileSync("./database/movies.json", JSON.stringify(m, null, 2), "utf-8")
})
