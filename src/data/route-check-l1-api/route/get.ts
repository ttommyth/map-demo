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
/**
 * @api {GET} /route/:token
 * @apiParam {String} token Refers to the processing token returned from the `/route` endpoint.
 *
 * @apiSuccess (Busy) {String} status Current status of the route request on the backend.
 * @apiSuccessExample (Busy) {json}
 *    HTTP/1.1 200 OK
 *    { "status": "in progress" }
 * @apiSuccess (Failure) {String} status Current status of the route request on the backend.
 * @apiSuccess (Failure) {String} error  Only exists if an error occurred. The error response from the backend.
 * @apiSuccessExample (Failure) {json}
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "failure",
 *      "error": "Location not accessible by car"
 *    }
 * @apiSuccess (Success) {String} status         Current status of the route request on the backend.
 * @apiSuccess (Success) {Array[]} path          An array of sets of coordinates, where start point, end point also included in ascending order
 * @apiSuccess (Success) {String} path.0         latitude
 * @apiSuccess (Success) {String} path.1         longitude
 * @apiSuccess (Success) {Number} total_distance The distance. The unit is not important for this challenge.
 * @apiSuccess (Success) {Number} total_time     The total it takes to complete the journey. The unit is not important for this challenge.
 * @apiSuccessExample (Success) {json}
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "path": [
 *        ["22.372081", "114.107877"],
 *        ["22.326442", "114.167811"],
 *        ["22.284419", "114.159510"]
 *      ],
 *      "total_distance": 20000,
 *      "total_time": 1800
 *    }
 *
 * @apiErrorExample {String} Error Response:
 *    HTTP/1.1 500 Internal Server Error
 *    Internal Server Error
 */
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