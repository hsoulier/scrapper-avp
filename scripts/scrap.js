import { scrapUGC } from "./ugc.js"
import { scrapPathe } from "./pathe.js"

const scrap = async () => {
  await Promise.all([scrapUGC(), scrapPathe()])
}

scrap()
