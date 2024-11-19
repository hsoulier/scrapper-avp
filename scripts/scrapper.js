import { scrapPathe, getPatheTheaters } from "./providers/pathe.js"
import { scrapUGC, getUGCTheaters } from "./providers/ugc.js"

const scrap = async () => {
  await scrapPathe()
  await getPatheTheaters()
  await scrapUGC()
  await getUGCTheaters()
}

scrap()
