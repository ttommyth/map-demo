import axios from "axios"

export type PostRouteRequest ={
  origin:string,
  destination:string
}
export type PostRouteResponse = {
  token:string
}

/**
 * @api {POST} /route
 * @apiParam {String} origin      Address of the pickup point.
 * @apiParam {String} destination Address of the drop-off point.
 *
 * @apiSuccess {String} token     Processing token to identify the routing request
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    { "token": "9d3503e0-7236-4e47-a62f-8b01b5646c16" }
 *
 * @apiErrorExample {String} Error Response:
 *    HTTP/1.1 500 Internal Server Error
 *    Internal Server Error
 */
export const postRoute = async (request:PostRouteRequest):Promise<PostRouteResponse>=>{
  if(request.origin.length==0) throw new Error("Origin is empty");
  if(request.destination.length==0) throw new Error("Destination is empty");
  
  return axios.post<PostRouteResponse>(new URL(`./route`, process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(), request, {
    headers: {
      'Content-Type': 'application/json'
    } 
  }).then(res=>res.data);
}