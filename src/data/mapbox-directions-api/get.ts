import axios from "axios"

export type GetDirectionsRequest ={
  profile:"traffic"|"walking"|"cycling"|"driving",
  coordinates:[longitude: number,latitude : number][],
}
export interface GetDirectionsResponse {
  routes: Route[]
  waypoints: Waypoint[]
  code: string
  uuid: string
}

export interface Route {
  weight_name: string
  weight: number
  duration: number
  distance: number
  legs: Leg[]
  geometry: Geometry
}

export interface Leg {
  via_waypoints: ViaWaypoint[]
  admins: Admin[]
  weight: number
  duration: number
  steps: Step[]
  distance: number
  summary: string
}

export interface ViaWaypoint {
  waypoint_index: number
  distance_from_start: number
  geometry_index: number
}

export interface Admin {
  iso_3166_1_alpha3: string
  iso_3166_1: string
}

export interface Step {
  intersections: Intersection[]
  maneuver: Maneuver
  name: string
  duration: number
  distance: number
  driving_side: string
  weight: number
  mode: string
  geometry: Geometry
  destinations?: string
  rotary_name?: string
  ref?: string
  exits?: string
}

export interface Intersection {
  bearings: number[]
  entry: boolean[]
  mapbox_streets_v8?: MapboxStreetsV8
  is_urban?: boolean
  admin_index: number
  out?: number
  geometry_index: number
  location: [longitude:number,latitude:number]
  in?: number
  duration?: number
  turn_weight?: number
  turn_duration?: number
  weight?: number
  yield_sign?: boolean
  classes?: string[]
  lanes?: Lane[]
  traffic_signal?: boolean
  toll_collection?: TollCollection
}

export interface MapboxStreetsV8 {
  class: string
}

export interface Lane {
  indications: string[]
  valid: boolean
  active: boolean
  valid_indication?: string
}

export interface TollCollection {
  type: string
}

export interface Maneuver {
  type: string
  instruction: string
  bearing_after: number
  bearing_before: number
  location: [longitude:number,latitude:number]
  modifier?: string
  exit?: number
}

export interface Geometry {
  coordinates: [longitude:number,latitude:number][]
  type: string
}

export interface Waypoint {
  distance: number
  name: string
  location:  [longitude:number,latitude:number]
}



export const getMapboxDirections = async ({profile, coordinates}:GetDirectionsRequest):Promise<GetDirectionsResponse>=>{
  //TODO: validation
  const url = new URL(`./${profile}/${encodeURIComponent(coordinates.map(it=>`${it[0]},${it[1]}`).join(";"))}`, process.env.NEXT_PUBLIC_MAPBOX_DIRECTIONS_API_BASE_URL);
  url.searchParams.set("alternatives", "false");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("language", "en");
  url.searchParams.set("overview", "full");
  url.searchParams.set("steps", "true");
  url.searchParams.set("access_token", process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
  return axios.get<GetDirectionsResponse>(url.toString()).then(res=>res.data);
}