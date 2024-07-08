import type { EARLY_TYPE, SOURCE, VERSION_TYPE } from "@/constants/mapping"
import type { ConstantKeys } from "@/types/utils"
import type { Timestamp } from "firebase/firestore"

export type MovieDoc = {
  name: string
  showId: string
  movieId: string
  cinemaName: string
  dateShow: Timestamp
  linkMovie: string
  linkShow: string
  version: ConstantKeys<typeof VERSION_TYPE>
  earlyType: ConstantKeys<typeof EARLY_TYPE>
  source: ConstantKeys<typeof SOURCE>
  scrapDate: Timestamp
}
