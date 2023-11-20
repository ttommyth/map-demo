import axios from "axios"

export type GetRouteRequest ={
  token:string
}
export type GetRouteResponse = {
  status:"success",
  path:[longitude:number,latitude:number][],
  total_distance:number,
  total_time:number
} | {
  status: "failure",
  error:string,
} |  {
  status: "in progress",
}

export const getRoute = async ({token}:GetRouteRequest):Promise<GetRouteResponse>=>{
  // Not sure if the token only exists with guid format, so I don't validate it here
  if(token.length==0) throw new Error("Token is empty");
  
  return axios.get<GetRouteResponse>(new URL(`./route/${token}`, process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()).then(res=>{
    if(res.data && res.data.status=="success"){
      res.data.path = res.data.path.map(it=>[Number.parseFloat(it[1].toString()),parseFloat(it[0].toString())]); //flip [latitude:number,longitude:number] to [longitude:number,latitude:number]
    }
    return res.data;
  });
}