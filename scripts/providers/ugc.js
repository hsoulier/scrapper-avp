import { parseHTML } from "linkedom"
import { JSDOM } from "jsdom"
import { writeFileSync } from "fs"
import { loadJson, uniqueArray } from "../utils.js"

const TYPE_SHOWS = ["Avant-première avec équipe", "Avant-première"]

async function getFirstDate(id) {
  const res = await fetch(
    `https://www.ugc.fr/showingsFilmAjaxAction!getDaysByFilm.action?reloadShowingsTopic=reloadShowings&dayForm=dayFormDesktop&filmId=${id}&day=&regionId=1&defaultRegionId=1`
  )
  const html = await res.text()
  const { document } = parseHTML(html)

  const dates = document.querySelectorAll(".slider-item")
  const dateList = [...dates].map((date) => {
    const text = date.id.trim()
    const dateFormatted = text.split("nav_date_1_")[1]
    return dateFormatted
  })

  return dateList.length > 0 ? dateList[0] : ""
}

function urlAVPMovie(id, firstDate) {
  return `https://www.ugc.fr/showingsFilmAjaxAction!getShowingsByFilm.action?filmId=${id}&day=${firstDate}&regionId=1`
}

export const scrapUGC = async (info) => {
  const previewsList = []

  console.log("🏗️ Movies to fetch -> ", info.length)
  console.log("------------------------------------")

  const cinemas = loadJson("./database/cinemas.json")
  const shows = loadJson("./database/shows.json")

  for (const { title, link, id: movieId } of info) {
    const id = link.split("_").at(-1).replace(".html", "")

    console.log("🥷 Fetching media -> ", title?.toLowerCase(), id)

    const firstDate = await getFirstDate(id)
    const res2 = await fetch(urlAVPMovie(id, firstDate))
    const html2 = await res2.text()
    const { document: document2 } = new JSDOM(html2).window

    // ? Get All show types for each projection card
    const showTypes = document2.querySelectorAll(
      ".component--screening-cards li button .screening-detail"
    )

    // ? Filter show types by only previews with team and previews without team
    const previews = [...showTypes].filter((show) => {
      return TYPE_SHOWS.includes(show?.textContent?.trim())
    })

    for (const preview of previews) {
      const el = preview?.closest("button[type=button]")
      const attributes = Object.assign({}, el?.dataset)

      if (!attributes) continue

      const details = {
        id: attributes?.showing,
        cinemaId: cinemas.find((c) => c.name === attributes.cinema)?.id,
        language: attributes?.version === "VOSTF" ? "vost" : "vf",
        date: "",
        avpType:
          preview?.textContent?.trim() === "Avant-première avec équipe"
            ? "AVPE"
            : "AVP",
        movieId,
        linkShow: `https://www.ugc.fr/reservationSeances.html?id=${attributes?.showing}`,
        linkMovie: link,
      }

      const dateRaw = attributes?.seancedate?.split("/")
      const hour = attributes?.seancehour?.split(":")

      if (dateRaw && hour) {
        details.date = new Date(
          dateRaw[2],
          dateRaw[1] - 1,
          dateRaw[0],
          hour[0],
          hour[1]
        )
      }

      shows.push(details)
    }
  }

  console.log("------------------------------------")
  console.log(
    "✅ UGC scrapping done -> number of movies retrieved",
    previewsList.length,
    info.length
  )

  writeFileSync(
    "./database/shows.json",
    JSON.stringify(uniqueArray(shows), null, 2),
    "utf-8"
  )
}

export const getUGCTheaters = async () => {
  const $cinema = await fetch(
    "https://www.ugc.fr/cinemasAjaxAction!getCinemasList.action?id=1&latitude=&longitude="
  )
  const html = await $cinema.text()
  const { document } = parseHTML(html)

  const cinemasElements = [
    ...document.querySelectorAll(".text-wrapper.flex-grow-1"),
  ]

  console.log("🏗️ Cinemas to fetch -> ", cinemasElements.length)

  const cinemas = cinemasElements.map((cinema, index) => {
    const name = cinema.querySelector("a").textContent.trim()
    const address = cinema.querySelector(".address").textContent
    const link = cinema.querySelector("a").href

    return {
      id: `ugc-${index + 1}`,
      slug: link.replace(".html", ""),
      name,
      arrondissement: parseInt(address.split("  750")[1]),
      address,
      link: `https://www.ugc.fr/${link}`,
      source: "ugc",
    }
  })

  const newDb = uniqueArray([
    ...loadJson("./database/cinemas.json"),
    ...cinemas,
  ])

  writeFileSync(
    "./database/cinemas.json",
    JSON.stringify(newDb, null, 2),
    "utf-8"
  )
}
