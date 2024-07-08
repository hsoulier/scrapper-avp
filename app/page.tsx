import { Cards } from "@/components/cards"
import Image from "next/image"

export default function Home() {
  return (
    <main className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))]">
      <Cards />
    </main>
  )
}
