import Image from "next/image"

const films = [
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
  {
    title: "Film",
    cover:
      "https://m.media-amazon.com/images/I/71XlZvKMwoL._AC_UF1000,1000_QL80_.jpg",
    date: new Date(),
  },
]
export default function MusicPage() {
  return (
    <>
      <section>
        <h1 className="text-4xl font-bold mb-8">Films récents</h1>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] gap-y-6 gap-x-4">
          {films.map((film) => (
            <article key={film.title} className="space-y-4">
              <img
                src={film.cover}
                alt={`Cover du film ${film.title}`}
                className="w-full h-64 object-cover rounded"
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xl">{film.title}</h2>
                <time
                  className="text-foreground/70 text-sm"
                  dateTime={film.date.toISOString()}
                >
                  {film.date.toLocaleDateString()}
                </time>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
