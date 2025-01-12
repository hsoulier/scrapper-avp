import { parseHTML } from "linkedom"
import { JSDOM } from "jsdom"
import {
  getCinemaByName,
  getMovie,
  insertMovie,
  getShow,
  insertShow,
} from "../db/requests.js"
import { getTmDbInfo } from "../db/tmdb.js"

const TYPE_SHOWS = ["Avant-première avec équipe", "Avant-première"]

const debug = {
  movies: 0,
  shows: 0,
}

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

const getShows = async (info) => {
  for (const { title, link, id: movieId } of info) {
    const id = link.split("_").at(-1).replace(".html", "")

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

      const existingShow = await getShow(attributes?.showing)

      if (existingShow) continue

      const cinemaId = (await getCinemaByName(attributes.cinema))?.id

      const details = {
        id: attributes?.showing,
        cinemaId,
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

      await insertShow(details)

      debug.shows++
    }
  }

  console.log("✅ UGC scrapping done", debug)
}

export const scrapUGC = async () => {
  const $pathe = await fetch(
    "https://www.ugc.fr/filmsAjaxAction!getFilmsAndFilters.action?filter=onPreview&page=30010&cinemaId=&reset=false&"
  )
  const html = await $pathe.text()
  const { document } = parseHTML(html)

  const $movies = [
    ...document.querySelectorAll(".results-container > .row > *"),
  ]

  const moviesWithAVP = $movies.map((movie) => {
    const $link = movie.querySelector(".img-wrapper a")

    return {
      title: $link?.getAttribute("title").toLowerCase().trim(),
      link: `https://www.ugc.fr/${$link?.href}`,
    }
  })

  const newMovies = await Promise.all(
    moviesWithAVP.map(({ title, link }) =>
      getTmDbInfo(title).then((m) => ({ ...m, link }))
    )
  )
  for (const movie of newMovies) {
    const { link, ...m } = movie
    const existingMovie = await getMovie(m.id)

    if (existingMovie) continue

    await insertMovie(m)

    debug.movies++
  }

  await getShows(newMovies)
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

  for (const [index, cinema] of cinemasElements.entries()) {
    const name = cinema.querySelector("a").textContent.trim()
    const address = cinema.querySelector(".address").textContent
    const link = cinema.querySelector("a").href

    const existingCinema = await getCinemaByName(name)

    if (existingCinema) continue

    await insertCinema({
      id: `ugc-${index + 1}`,
      slug: link.replace(".html", ""),
      name,
      arrondissement: parseInt(address.split("  750")[1]),
      address,
      link: `https://www.ugc.fr/${link}`,
      source: "ugc",
    })
  }
}
