import "dotenv/config"

export const getTmDbInfo = async (title, year) => {
  try {
    const encodedTitle = encodeURIComponent(title)

    const query = `query=${encodedTitle}&include_adult=true&language=fr-FR&page=1&year=${year}`

    const url = `https://api.themoviedb.org/3/search/movie?${query}`

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    }

    const res = await fetch(url, options)
    const json = await res.json()

    if (json.results.length === 0) {
      console.log("❌ [TMDB] No movie match", title, year)
      return null
    }
    return {
      id: json.results[0].id,
      title: json.results[0].title,
      poster: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${json.results[0].poster_path}`,
    }
  } catch (error) {}
}
