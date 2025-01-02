import { insertMovie, insertShow } from "./db/requests.js"
import { sql, supabase } from "./utils.js"

const scrap = async () => {
  try {
    const { data, error } = await supabase.from("movies").select("*")

    console.log(data.length)
  } catch (error) {
    console.error(error)
  }

  sql.end()
}

scrap()
