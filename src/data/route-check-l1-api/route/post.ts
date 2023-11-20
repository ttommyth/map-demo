import axios from "axios"

export type PostRouteRequest ={
  origin:string,
  destination:string
}
export type PostRouteResponse = {
  token:string
}

export const postRoute = async (request:PostRouteRequest):Promise<PostRouteResponse>=>{
  if(request.origin.length==0) throw new Error("Origin is empty");
  if(request.destination.length==0) throw new Error("Destination is empty");
  
  return axios.post<PostRouteResponse>(new URL(`./route`, process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(), request, {
    headers: {
      'Content-Type': 'application/json'
    } 
  }).then(res=>res.data);
}