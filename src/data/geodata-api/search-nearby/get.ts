import axios from "axios"
import proj4 from "proj4"

export type GetSearchNearbyRequest ={
  // "x" specifies the coordinate value of HK80 Easting (m).
  x:number,
  // "y" specifies the coordinate value of HK80 Northing (m).
  y: number
}
export type SearchNearbyResultEntry = {
  address: string
  additionalInfoValue: string[]
  name: string
  x: number
  additionalInfoKey: string[]
  y: number
}
export type GetSearchNearbyResponse = SearchNearbyResultEntry[]

export const getSearchNearby = async ({x, y}:GetSearchNearbyRequest):Promise<GetSearchNearbyResponse>=>{
  //TODO: validation
  const url = new URL(`./searchNearby`, process.env.NEXT_PUBLIC_GEODATA_BASE_URL);
  url.searchParams.set("x", x.toString());
  url.searchParams.set("y", y.toString());
  url.searchParams.set("lang", "en");
  return axios.get<GetSearchNearbyResponse>(url.toString()).then(res=>res.data);
}

proj4.defs("EPSG:2326","+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs");
proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
export const getSearchNearbyByLatLong = async ({longitude,latitude}:{longitude:number,latitude:number}):Promise<GetSearchNearbyResponse>=>{
  const result = proj4('EPSG:4326', 'EPSG:2326', [latitude, longitude]);
  return getSearchNearby({x:result[0], y:result[1] })
}