import movies from "@/public/database.json"
import Link from "next/link"

export const Card = ({ movie }: { movie: (typeof movies)[number] }) => {
  const isLiveShow = movie.title?.startsWith("La Séance live")
  return (
    <Link
      href={`?movie=${movie.movieId}`}
      key={movie.showId}
      className="space-y-4"
    >
      <img
        src={movie?.imdb?.poster || movie?.cover}
        alt={`Cover du film ${movie.title}`}
        className="w-full object-cover rounded aspect-[2/3] border border-foreground/30"
      />
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl">
          {isLiveShow ? movie.title.split(":")[1] : movie.title}
        </h2>
        <time
          className="text-foreground/70 text-sm"
          dateTime={new Date(movie.dateShow).toISOString()}
        >
          {new Date(movie.dateShow).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </time>
      </div>
    </Link>
  )
}
