"use client"

import { db } from "@/services/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"

export const Cards = () => {
  const [cards, setCards] = useState<any[]>([])
  useEffect(() => {
    getDocs(collection(db, "film-shows"))
      .then((e) => {
        setCards(e.docs.map((e) => ({ ...e.data(), id: e.id })))
      })
      .catch((e) => {
        console.error(e)
      })
  }, [])
  return (
    <div>
      {cards.map((e) => (
        <div key={e.id}>{e.movie}</div>
      ))}
    </div>
  )
}
