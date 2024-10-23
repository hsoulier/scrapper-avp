import { scrapPathe, getPatheTheaters } from "./pathe.js"
import { scrapUGC, getUGCTheaters } from "./ugc.js"

const scrap = async () => {
  await scrapPathe()
  await getPatheTheaters()
  await scrapUGC()
  await getUGCTheaters()
}

scrap()
