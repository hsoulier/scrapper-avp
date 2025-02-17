import { parseHTML } from "linkedom"

export const getImDbInfo = async (title) => {
  try {
    const query = new URLSearchParams()

    query.set("q", title)

    const res = await fetch(`https://www.imdb.com/find/?${query.toString()}`, {
      method: "GET",
    })

    const html = await res.text()
    const { document } = parseHTML(html)

    const data = document.getElementById("__NEXT_DATA__").textContent

    const json = JSON.parse(data)

    const movies = json.props.pageProps.titleResults.results.filter(
      (m) => m.imageType === "movie"
    )

    return movies
  } catch (error) {
    console.error(`❌ [IMDB] ${error}`)
  }
}
