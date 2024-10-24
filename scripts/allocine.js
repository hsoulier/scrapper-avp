import { parseHTML } from "linkedom"

export const getAlloCineInfo = async ({ title, year }) => {
  const $imdb = await fetch(
    `https://www.allocine.fr/rechercher/movie/?q=${title}`
  )
  const html = await $imdb.text()
  const { document } = parseHTML(html)

  const matches = [...document.querySelectorAll(".movies-results li")]

  if (!matches.length) {
    console.dir(matches, { depth: null })
    console.log("❌ [ALLOCINE] No movies found for", title)
  }

  if (matches.length > 1) {
    console.log("🎬 Multiple movies found on Allocine for", title)
    // console.dir(
    //   matches.map((match) => ({
    //     title: match.querySelector("h2")?.textContent?.trim(),
    //     year: match.querySelector(".date")?.textContent?.trim(),
    //   })),
    //   { depth: null }
    // )
  }

  const movie = matches.find((match) => {
    const yearMatch = match.querySelector(".date")?.textContent
    if (!yearMatch) return false

    const formattedYear = parseInt(yearMatch.split(" ").at(-1))
    // ? For Movies released at the end/beginning of the year
    return (
      formattedYear === year ||
      formattedYear === year - 1 ||
      formattedYear === year + 1
    )
  })

  if (!movie) {
    console.log("❌ [ALLOCINE] No movie match ", title, year)
    return { id: "", title: "", poster: "" }
  }

  // ? Not Working (th eliks on the page are not working when fetching the page)
  const id = document
    .querySelector(".thumbnail-link")
    ?.href?.split("fichefilm_gen_cfilm=")
    .at(-1)
    ?.split(".html")?.[0]

  return {
    id: "",
    title: movie?.querySelector("h2").textContent?.trim(),
    poster: movie?.querySelector(".thumbnail-img").src,
  }
}
