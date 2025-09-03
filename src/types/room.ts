import type { CorporateInfo } from "./types";

export interface Room {
  room_id: string;
  name: string;
  code: string;
  status: string;
  corporates: CorporateInfo;
}
