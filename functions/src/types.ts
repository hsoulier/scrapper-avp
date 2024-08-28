import type { DocumentReference, Timestamp } from "firebase-admin/firestore"

export const VERSION_TYPE = {
  VO: "Version Originale",
  VOST: "Version Originale Sous-titrée",
  VF: "Version Française",
} as const

export const EARLY_TYPE = {
  AVANT_PREMIERE: "Avant Première",
  AVANT_PREMIERE_WITH_CREW: "Avant Première en présence de l'équipe",
} as const

export const SOURCE = {
  UGC: "UGC",
  PATHE: "Pathé",
  REX: "Le Grand Rex",
  MK2: "MK2",
  CGR: "CGR",
} as const

export type ConstantValues<T extends Record<string, string>> = T[keyof T]
export type ConstantKeys<T extends Record<string, string>> = keyof T

export type MovieDoc = {
  name: string
  showId: string
  cinemaName: string
  dateShow: Timestamp
  linkMovie: string
  linkShow: string
  version: ConstantKeys<typeof VERSION_TYPE>
  earlyType: ConstantKeys<typeof EARLY_TYPE>
  source: ConstantKeys<typeof SOURCE>
  scrapDate: Timestamp
  movie: DocumentReference
}

export type ResponsePathShowDay = {
  tags: string[]
  bookable: boolean
  versions: ("vost" | "vf" | "vo")[]
  flag: "Avant-première" | (string & {})
}

export type ResponsePatheShow = {
  // slug movie
  days: {
    [key: `${number}-${number}-${number}`]: ResponsePathShowDay
  }
  bookable: boolean
  isBookable: boolean
  isNew: boolean
  isComingSoon: boolean
  isEarlyVisible: boolean
  isEarlyBookable: boolean
  isEarlyAVP: boolean
  cineOrder: number
  cineSpecialOrder: null
  cineUpcomingOrder: number
  cineEntertainmentOrder: number
  cineEntertainmentOrder2: number
  specialEvent: boolean
}

export type ResponseDataCinema = {
  shows: {
    [key: string]: ResponsePatheShow
  }
}

export type ResponseMovieInfo = {
  status: string
  time: string
  version: "vost" | "vf" | "vo"
  tags: string[]
  reservabilityStart: string
  reservabilityEnd: string
  isMovie: boolean
  refCmd: string
  auditoriumName: string
  auditoriumCapacity: string
  endTime: string
  special: any
}
