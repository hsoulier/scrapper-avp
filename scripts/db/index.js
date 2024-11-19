import { getIMDBInfo } from "./imdb.js"
import { getTmDbInfo } from "./tmdb.js"

export const getInfoFromDb = async (t, y) => {
  const [imdb, tmdb] = await Promise.all([
    await getIMDBInfo({ title: t, year: y }),
    await getTmDbInfo(t, y),
    // await getAlloCineInfo({ title: t, year: y }),
  ])

  const allocine = { id: "", title: "", poster: "" }

  const { id, title, poster } = imdb || tmdb || allocine

  return {
    db: { id, title, poster },
    imdb,
    allocine,
    tmdb,
  }
}
