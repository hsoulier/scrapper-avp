import { sql } from "./utils.js"
import { getUGCTheaters, scrapUGC } from "./providers/ugc.js"
import { scrapPathe, getPatheTheaters } from "./providers/pathe.js"
import { scrapMk2, getMk2Theaters } from "./providers/mk2.js"

const init = async () => {
  await scrapUGC()
  await scrapPathe()
  await scrapMk2()

  sql.end()
}

const getCinemas = async () => {
  await getMk2Theaters()
  await getUGCTheaters()
  await getPatheTheaters()
}

init()
