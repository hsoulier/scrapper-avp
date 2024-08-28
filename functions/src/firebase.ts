import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const app = initializeApp()
export const db = getFirestore(app, "avp-movies")

export const COLL_REFS = {
  MOVIES: db.collection("movies"),
  CINEMAS: db.collection("cinemas"),
  SHOWS: db.collection("film-shows"),
  USERS: db.collection("users"),
}
