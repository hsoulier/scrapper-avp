import { getImDbInfo } from "./db/imdb.js"
import { listMovies, updateMovie } from "./db/requests.js"
import { sql } from "./utils.js"

const init = async () => {
  const movies = await listMovies()

  for (const movie of movies) {
    if (movie.imdbId === "" || !movie.imdbId) {
      const res = await getImDbInfo(movie.title)

      if (!res) {
        console.log("no imdb", movie.title)
        continue
      }

      await updateMovie(movie.id, {
        imdbId: res.imdbId,
        poster: res.poster,
        director: res.director,
      })
    }
    if (movie.duration === "0" || !movie.duration) {
      console.log("no duration", movie.title)
    }
    if (movie.poster === "" || !movie.poster) {
      console.log("no poster", movie.title)
    }
    if (movie.director === "" || !movie.director) {
      console.log("no director", movie.title)
    }
  }

  console.log(movies.length)

  await sql.end()
}

init()
