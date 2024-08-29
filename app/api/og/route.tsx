import { backgroundImage } from "@/constants/og-image"
import satori, { type SatoriOptions } from "satori"

const imageOptions: SatoriOptions = {
  width: 1_080,
  height: 1_080,
  fonts: [],
}

export const runtime = "edge"

export const GET = async (request: Request) => {
  try {
    // const loadFont = async (url: string) => {
    //   const fontData = await fetch(new URL(url, import.meta.url))
    //   return fontData.arrayBuffer()
    // }

    console.log("Loading fonts", import.meta.url)
    const manrope = await fetch(
      new URL("../../../../assets/manrope.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer())

    // const fontNormal = await loadFont(
    //   "../../../../assets/plus-jakarta-sans-medium.ttf"
    // )
    // const fontExtraBold = await loadFont(
    //   "../../../../assets/plus-jakarta-sans-extra-bold.ttf"
    // )

    console.log("Fonts loaded", manrope)

    if (!manrope) {
      throw new Error("Failed to load font")
    }

    imageOptions.fonts = [
      {
        name: "Manrope",
        data: manrope,
        style: "normal",
        weight: 400,
      },
      {
        name: "Manrope",
        data: manrope,
        style: "normal",
        weight: 800,
      },
    ]

    // imageOptions.fonts = [
    //   {
    //     name: "Plus Jakarta Sans",
    //     data: fontExtraLight,
    //     style: "normal",
    //     weight: 200,
    //   },
    //   {
    //     name: "Plus Jakarta Sans",
    //     data: fontNormal,
    //     style: "normal",
    //     weight: 500,
    //   },
    //   {
    //     name: "Plus Jakarta Sans",
    //     data: fontExtraBold,
    //     style: "normal",
    //     weight: 800,
    //   },
    // ]

    const { searchParams } = new URL(request.url)

    const title =
      searchParams.get("title")?.replaceAll("_", " ") || "My default title"
    const location =
      searchParams.get("location")?.replaceAll("_", " ") || "Default Theater"
    const date =
      searchParams.get("date")?.replaceAll("_", "/") || "Default Date"
    const director =
      searchParams.get("director")?.replaceAll("_", " ") || "Default Director"

    const infos = [
      [
        {
          icon: "https://raw.githubusercontent.com/zhdsmy/apple-emoji/ios-15.4/png/160/emoji_u1f37f.png",
          title: "Film",
          value: title,
        },
        {
          icon: "https://raw.githubusercontent.com/zhdsmy/apple-emoji/ios-15.4/png/160/emoji_u1f3a5.png",
          title: "Réalisateur",
          value: director,
        },
      ],
      [
        {
          icon: "https://raw.githubusercontent.com/zhdsmy/apple-emoji/ios-15.4/png/160/emoji_u1f4c5.png",
          title: "En Salle",
          value: date,
        },
        {
          icon: "https://raw.githubusercontent.com/zhdsmy/apple-emoji/ios-15.4/png/160/emoji_u1f4cd.png",
          title: "Où ?",
          value: location,
        },
      ],
    ]

    return satori(
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        tw="flex flex-col justify-center items-center w-full h-full text-white text-4xl"
      >
        <img
          width={imageOptions.width}
          height={imageOptions.height}
          src={backgroundImage}
          alt="Background image"
          tw="absolute inset-0"
        />
        <div tw="flex items-center w-full justify-between px-12">
          <img
            width="320"
            tw="rounded-lg"
            src="https://www.ugc.fr/dynamique/films/17/16317/fr/poster/large/86ef4fd30e03877ad59a19cd1854d9af_31.jpg"
            alt="Movie cover"
          />
          <div tw="flex flex-col items-center">
            <div tw="p-6 rounded-2xl bg-black/30 flex flex-col items-start text-4xl leading-loose">
              <span tw="uppercase font-extrabold text-6xl">Avant-première</span>
              <span tw="uppercase text-5xl">Avec l'équipe du film</span>
            </div>
            <p tw="mt-4">Le 14/06/2024 à 19H00</p>
          </div>
        </div>

        <div tw="px-12 flex flex-col py-8">
          {infos.map((infoGroup, index) => (
            <div
              tw="flex items-center w-full justify-between"
              style={{ marginTop: index === 1 ? "3rem" : 0 }}
              key={index}
            >
              {infoGroup.map((info, index) => (
                <div tw="flex flex-col items-start w-1/2" key={index}>
                  <p tw="px-6 py-4 bg-black/50 rounded-xl mb-2 uppercase font-extrabold text-4xl leading-none">
                    <img src={info.icon} width={40} tw="mr-4" alt="Emoji" />{" "}
                    {info.title}
                  </p>
                  <span>{info.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>,
      imageOptions
    )
  } catch (error) {
    console.dir(error, { depth: null })
    if (error instanceof Error) {
      console.log(`${error.message}`)
      return new Response(
        JSON.stringify({ message: error.message, name: error.name }),
        { status: 500 }
      )
    }
    return new Response(`Unknown error`, { status: 500 })
  }
}
