import { parseHTML } from "linkedom"
import { readFileSync, writeFileSync } from "fs"
import slugify from "slugify"

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

  // ? Get first date of projection (to get available previews)

  console.log("🏗️ Movies to fetch -> ", info.length)
  console.log("------------------------------------")

  for (const { title, link } of info) {
    const id = link.split("_").at(-1).replace(".html", "")

    console.log("🥷 Fetching media -> ", title?.toLowerCase(), id)

    const firstDate = await getFirstDate(id)
    const res2 = await fetch(urlAVPMovie(id, firstDate))
    const html2 = await res2.text()
    const { document: document2 } = parseHTML(html2)

    // ? Get All show types for each projection card
    const showTypes = document2.querySelectorAll(
      ".component--screening-cards li button .screening-detail"
    )

    // ? Filter show types by only previews with team and previews without team
    const previews = [...showTypes].filter((show) => {
      return TYPE_SHOWS.includes(show?.textContent?.trim())
    })

    for (const preview of previews) {
      const el = preview?.closest("button")
      const attributes = el?.dataset

      if (!attributes) continue

      const dateRaw = attributes?.seanceDate?.split("/")
      const hour = attributes?.seanceHour?.split(":")
      const date =
        dateRaw && hour
          ? (details.date = new Date(
              dateRaw[2],
              dateRaw[1] - 1,
              dateRaw[0],
              hour[0],
              hour[1]
            ).toISOString())
          : ""

      const details = {
        id: attributes?.showing,
        cinemaId: "",
        language: attributes?.version === "VOSTF" ? "vost" : "vf",
        date,
        avpType:
          preview?.textContent?.trim() === "Avant-première avec équipe"
            ? "AVPE"
            : "AVP",
        movieId: id,
        linkShow: `https://www.ugc.fr/reservationSeances.html?id=${attributes?.showing}`,
        linkMovie: link,
      }

      // for (const detail in el.dataset) {
      // if (detail === "seanceHour" || detail === "seanceDate") {
      //   const date = attributes?.seanceDate?.split("/")
      //   const hour = attributes?.seanceHour?.split(":")
      //   if (date && hour) {
      //     details.date = new Date(
      //       date[2],
      //       date[1] - 1,
      //       date[0],
      //       hour[0],
      //       hour[1]
      //     ).toISOString()
      //   }
      //   continue
      // }
      // if (detail === "cinema") {
      //   details.cinemaName = slugify(el?.getAttribute(`data-${detail}`), {
      //     lower: true,
      //   })
      // }
      // }

      previewsList.push(details)
    }
  }

  console.log("------------------------------------")
  console.log(
    "✅ UGC scrapping done -> number of movies retrieved",
    previewsList.length,
    info.length
  )

  console.dir(previewsList, { depth: null })

  // writeFileSync(
  //   "./public/database.json",
  //   JSON.stringify(newDb, null, 2),
  //   "utf-8"
  // )
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

  const cinemas = cinemasElements.map((cinema) => {
    const name = cinema.querySelector("a").textContent.trim()
    const address = cinema.querySelector(".address").textContent
    const link = cinema.querySelector("a").href
    return {
      slug: slugify(name, { lower: true }),
      name,
      address,
      link: `https://www.ugc.fr/${link}`,
      source: "ugc",
    }
  })

  const existingDb = readFileSync("./public/cinema-info.json", "utf-8")

  const db = JSON.parse(existingDb)

  const newDb = [...db, ...cinemas]

  console.log("📦 Saving new cinema info", newDb.length)

  writeFileSync(
    "./public/cinema-info.json",
    JSON.stringify(newDb, null, 2),
    "utf-8"
  )
}
