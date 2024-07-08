"use client"

import { db } from "@/services/firebase"
import { collection, getDoc, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"

export const Cards = () => {
  const [cards, setCards] = useState<any[]>([])
  useEffect(() => {
    getDocs(collection(db, "shows")).then((e) =>
      setCards(e.docs.map((e) => e.data()))
    )
  }, [])
  return (
    <div>
      {cards.map((e) => (
        <div key={e.id}>{e.name}</div>
      ))}
    </div>
  )
}
