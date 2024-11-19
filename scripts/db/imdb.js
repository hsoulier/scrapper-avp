import { parseHTML } from "linkedom"

export const getIMDBInfo = async ({ title, year }) => {
  const $imdb = await fetch(
    `https://www.imdb.com/find?q=${title}&s=tt&ttype=ft&exact=true`
  )
  const html = await $imdb.text()
  const { document } = parseHTML(html)

  const json = JSON.parse(document.getElementById("__NEXT_DATA__").textContent)

  const matches = json.props.pageProps.titleResults.results || []

  if (!matches.length) {
    console.log("❌ [IMDB] No movies found for", title)

    return { id: "", title: "", poster: "" }
  }

  const movie = matches.find(
    (match) =>
      // ? For Movies released at the end/beginning of the year
      parseInt(match.titleReleaseText) === year ||
      parseInt(match.titleReleaseText) === year - 1 ||
      parseInt(match.titleReleaseText) === year + 1
  )

  if (!movie) {
    console.log("❌ [IMDB] No movie match", title, year)
  }

  return {
    id: movie?.id,
    title: movie?.titleNameText,
    poster: movie?.titlePosterImageModel?.url,
  }
}
