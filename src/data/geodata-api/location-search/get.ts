import axios from "axios"

export type GetLocationSearchRequest ={
  query:string
}
export type LocationSearchResultEntry ={
  addressZH:string,
  nameZH:string,
  x:number,
  y:number,
  nameEN:string,
  addressEN:string
}
export type GetLocationSearchResponse = LocationSearchResultEntry[]

export const getLocationSearch = async ({query}:GetLocationSearchRequest):Promise<GetLocationSearchResponse>=>{
  //TODO: validation
  const url = new URL(`./locationSearch`, process.env.NEXT_PUBLIC_GEODATA_BASE_URL);
  url.searchParams.set("q", query);
  return axios.get<GetLocationSearchResponse>(url.toString()).then(res=>res.data);
}