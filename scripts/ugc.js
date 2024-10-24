import { parseHTML } from "linkedom"
import { readFileSync, writeFileSync } from "fs"
import slugify from "slugify"
import { getIMDBInfo } from "./imdb.js"
import { getAlloCineInfo } from "./allocine.js"

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

export const scrapUGC = async () => {
  const previewsList = []

  const res = await fetch(
    "https://www.ugc.fr/filmsAjaxAction!getFilmsAndFilters.action?filter=onPreview&page=30010&cinemaId=&reset=false&"
  )
  const html = await res.text()
  const { document } = parseHTML(html)

  // ? Get all movies from previews UGC page
  const films = document.querySelectorAll(
    ".component--film-tile .block--title [data-film-label]"
  )

  const titles = [...films].map((film) => {
    const id = film.href.split("_").at(-1).replace(".html", "")
    const imageEl = document.querySelector(`#goToFilm_${id}_visu_img img`)

    return {
      mediaLink: `https://ugc.fr/${film.href}`,
      id: id?.toString(),
      title: film.textContent.trim(),
      link: urlAVPMovie(id),
      cover: imageEl?.getAttribute("data-src") || "",
    }
  })

  // ! Debug values
  // const titles = [
  //   {
  //     mediaLink: "https://www.ugc.fr/film.html?id=15359",
  //     id: 15359?.toString(),
  //     title: "Dune 2",
  //     link: urlAVPMovie(15359, ""),
  //   },
  // ];

  // ? Get first date of projection (to get available previews)
  for (let i = 0; i < titles.length; i++) {
    const id = titles[i].id
    const firstDate = await getFirstDate(id)
    titles[i].link = urlAVPMovie(id, firstDate)
  }

  console.log("🏗️ Movies to fetch -> ", titles.length)
  console.log("------------------------------------")

  for (const title of titles.splice(0, 2)) {
    console.log("🥷 Fetching media -> ", title.title?.toLowerCase())
    const res2 = await fetch(title.link)
    const html2 = await res2.text()
    const { document: document2 } = parseHTML(html2)

    const mediaRes = await fetch(title.mediaLink)
    const mediaHtml = await mediaRes.text()
    const { document: mediaDocument } = parseHTML(mediaHtml)

    const [imdbInfo, allocineInfo] = await Promise.all([
      await getIMDBInfo({
        title: title.title?.toLowerCase(),
        year: new Date().getFullYear(),
      }),
      await getAlloCineInfo({
        title: title.title?.toLowerCase(),
        year: new Date().getFullYear(),
      }),
    ])

    const release = mediaDocument.querySelector(
      ".group-info .color--dark-blue"
    ).textContent

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
      const details = {
        imdb: imdbInfo,
        allocine: allocineInfo,
        name: title.title?.toLowerCase(),
        title:
          title.title[0].toUpperCase() +
            title.title.substring(1).toLowerCase() || "",
        source: "ugc",
        officialRelease: release ? new Date(release) : null,
      }
      if (!el?.dataset) continue
      for (const detail in el.dataset) {
        if (detail === "seanceHour" || detail === "seanceDate") {
          const date = el?.getAttribute(`data-seanceDate`)?.split("/")
          const hour = el?.getAttribute(`data-seanceHour`)?.split(":")
          if (date && hour) {
            details.dateShow = new Date(
              date[2],
              date[1] - 1,
              date[0],
              hour[0],
              hour[1]
            ).toISOString()
          }
          continue
        }
        if (detail === "filmId") {
          details.movieId = el?.getAttribute(`data-${detail}`)
          details.linkMovie = `https://www.ugc.fr/film.html?id=${el?.getAttribute(
            `data-${detail}`
          )}`
        }
        if (detail === "cinema") {
          details.cinemaName = slugify(el?.getAttribute(`data-${detail}`), {
            lower: true,
          })
        }
        if (detail === "showing") {
          details.showId = el?.getAttribute(`data-${detail}`)
          details.linkShow = `https://www.ugc.fr/reservationSeances.html?id=${el?.getAttribute(
            `data-${detail}`
          )}`
        }
        if (detail === "version") {
          details.version =
            el?.getAttribute(`data-${detail}`) === "VOSTF" ? "vost" : "vf"
        }
        details.earlyType =
          preview?.textContent?.trim() === "Avant-première avec équipe"
            ? "AVPE"
            : "AVP"

        details.cover = title.cover
      }
      previewsList.push(details)
    }
  }

  console.log("------------------------------------")
  console.log(
    "✅ UGC scrapping done -> number of movies retrieved",
    previewsList.length
  )

  const existingDb = readFileSync("./public/database.json", "utf-8")

  const db = JSON.parse(existingDb)

  const newDb = [...db, ...previewsList]

  console.log("📦 Saving new database", newDb.length)

  writeFileSync(
    "./public/database.json",
    JSON.stringify(newDb, null, 2),
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
