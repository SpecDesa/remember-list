import { type items  } from "./schema"

export enum ListStatus {
  STOCKING = 'Stocking',
  SHOPPING = 'Shopping',
}


export type ItemType = typeof items.$inferSelect
