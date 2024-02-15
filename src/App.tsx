import { useState } from "react"
import Table from "./components/table"
import TablePathe from "./components/table-pathe"

function App() {
  const [tab, setTab] = useState<"ugc" | "pathe">("ugc")

  return (
    <main className="bg-neutral-900 h-screen overflow-y-auto text-neutral-200 w-screen">
      <section className="mt-8 mx-8 flex flex-col gap-12">
        <aside>
          <h1 className="text-3xl font-bold">Cinémas</h1>
          <div className="flex gap-4 mt-4">
            <button
              data-state={tab === "ugc" ? "selected" : "none"}
              className="px-4 py-2 rounded-lg data-[state=selected]:bg-neutral-500 data-[state=selected]:text-neutral-100"
              onClick={() => setTab("ugc")}
            >
              UGC
            </button>
            <button
              data-state={tab === "pathe" ? "selected" : "none"}
              className="px-4 py-2 rounded-lg data-[state=selected]:bg-neutral-500 data-[state=selected]:text-neutral-100"
              onClick={() => setTab("pathe")}
            >
              Pathé
            </button>
          </div>
        </aside>
        <article className="mb-8 w-full flex flex-col gap-2">
          {tab === "ugc" && (
            <>
              <h1 className="text-xl font-bold">UGC Data AVP à Paris</h1>
              <div className="rounded-xl border border-neutral-700">
                <Table />
              </div>
            </>
          )}
          {tab === "pathe" && (
            <>
              <h1 className="text-xl font-bold">Pathé Data AVP à Paris</h1>
              <div className="rounded-xl border border-neutral-700">
                <TablePathe />
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
