import { writeFileSync } from "fs";

const DEFAULT_CITY = "paris";
async function getCinemaOfCity(city = DEFAULT_CITY) {
  const res = await fetch("https://www.pathe.fr/api/cities?language=fr");
  const data = await res.json();
  const parisTheaters = data.find((c) => c.slug === city)?.cinemas;
  return parisTheaters;
}

const init = async () => {
  console.log("🚀 Pathé scrapping started");
  console.log("------------------------------------");
  const cinemas = [
    "cinema-pathe-alesia",
    "cinema-gaumont-aquaboulevard",
    "cinema-les-7-batignolles",
    "cinema-pathe-beaugrenelle",
    "cinema-pathe-convention",
    "cinema-pathe-la-villette",
    "cinema-pathe-les-fauvettes",
    "cinema-pathe-montparnos",
    "cinema-pathe-opera-premier",
    "cinema-pathe-parnasse",
    "cinema-pathe-wepler",
  ];

  const previewsList = [];

  for (const cinema of cinemas) {
    const res = await fetch(
      `https://www.pathe.fr/api/cinema/${cinema}/shows?language=fr`
    );
    const data = await res.json();
    // console.log(data);
    const shows = Object.entries(data.shows)
      .filter(([, value]) => value.isEarlyAVP)
      .map(([key, value]) => {
        const title = key.split("-").slice(0, -1).join(" ");
        console.log("🥷 Fetched media with AVP -> ", title, cinema);
        return { title, cinema, ...value };
      });

    const earlyPreview = [];

    for (const show of shows) {
      const { days, ...rest } = show;
      const preview = Object.entries(show.days)
        .filter(([, infos]) => {
          console.log(infos.flag);
          return ["avant-première", "avant-premiere-+-équipe"].includes(
            infos?.flag?.toLowerCase()?.trim()?.replace(" ", "-")
          );
        })
        .map(([date, infos]) => ({
          date,
          showingType:
            infos?.flag?.toLowerCase()?.trim()?.replace(" ", "-") ===
            "avant-première"
              ? "AVP"
              : "AVPE",
          ...rest,
          ...infos,
        }));

      earlyPreview.push(...preview);
      console.log(preview);
    }

    // console.dir(earlyPreview, { depth: null });
    previewsList.push(earlyPreview);
  }

  writeFileSync(
    "./data/pathe.json",
    JSON.stringify(previewsList.flat()),
    "utf-8"
  );

  console.log("------------------------------------");
  console.log(
    "✅ Pathé scrapping done -> number of movies retrieved",
    previewsList.length
  );
};

init();
