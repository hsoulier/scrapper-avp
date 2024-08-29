import { db } from "@/lib/firebase.admin"

const Home = async () => {
  try {
    const docs = await db.collection("movies").get()

    const shows = docs.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as any[]

    return (
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] gap-4 container mt-4">
        {shows.map((show) => (
          <section key={show.id}>
            <img
              src={show?.posterPath?.lg || ""}
              alt=""
              className="rounded-md border border-gray-100 w-full"
            />
            <h1 className="mx-1 font-semibold mb-1 mt-4">
              {show.originalTitle}
            </h1>
            <p>{show.synopsis}</p>
          </section>
        ))}
      </main>
    )
  } catch (error) {
    console.error(error)
    return <div>Error</div>
  }
}

export default Home
