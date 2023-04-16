
export type BusLineDto = {
  code: string,
  origin: string,
  destination: string,
  lineHours: Date[],
  prefix: string[],
  vehicle: Object,
}