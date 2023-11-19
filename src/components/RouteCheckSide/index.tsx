"use client";
import LocationTextBox from "@/components/LocationTextBox"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PostRouteRequest, getRoute, postRoute } from "@/data/route-check-l1-api/route";
import { useMap } from "@/hooks/MapProvider";
import { useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { HiMapPin} from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
type RouteCheckFormInputs = {
  origin: string,
  destination: string,
};

const validationSchema = yup.object({
  origin: yup.string().required("Required").max(200, "Max length reached"),
  destination: yup.string().required("Required").max(200, "Max length reached"),
})


const RouteCheckSide = () => {
  const {setPath} = useMap();
  const { register, handleSubmit, watch,setValue, control, formState: { errors } } = useForm<RouteCheckFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues:{
      origin: "",
      destination: "",
    }
  });
  const postRouteMutate = useMutation({
    mutationFn: (values: PostRouteRequest) => postRoute(values),
  })
  const getRouteQuery = useQuery({
    queryKey:["getRoute", postRouteMutate.data?.token],
    queryFn: async ()=>{
      const res = await getRoute({token:postRouteMutate.data!.token});
      if(res.status=="in progress"){
        throw res;
      }
      return res;
    },
    enabled:!!postRouteMutate.data?.token,
    retry:(failureCount, error: any)=>{
      if(error.status=="in progress"){
        return failureCount<20;
      }
      return false;
    },
    retryDelay: 1000
  });
  useEffect(()=>{
    if(postRouteMutate.isPending || getRouteQuery.isFetching)
      return;
    if(getRouteQuery.data?.status=="success" && getRouteQuery.status=="success"){
      setPath(getRouteQuery.data?.path);
    }else{
      setPath(undefined);
    }
  }, [postRouteMutate, getRouteQuery]);
  const onSubmit: SubmitHandler<RouteCheckFormInputs> = data => postRouteMutate.mutate(data);
  const formLoading = postRouteMutate.isPending || getRouteQuery.isFetching;
  return <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
    <div className="flex flex-col gap-4 relative">
      <div className="absolute left-0  top-0 py-4 h-full"><div className="border-dotted border-l-2 border-gray-500 h-full ml-[0.7rem] "></div></div>
      <span className="relative flex items-center  w-full gap-2 bg-base-50">
        <FaRegCircle className="w-icon h-icon "/>
        <Controller
          name="origin"
          control={control}
          render={({ field }) =>
            <LocationTextBox value={field.value} onValueChange={v=>field.onChange(v)} disabled={formLoading} reset={()=>setValue(field.name, "")} 
              label="Starting location" name={field.name} error={errors[field.name]?.message}/>
          }
        />
      </span>
      <span className="relative flex items-center   w-full gap-2 bg-base-50">
        <HiMapPin className="w-icon h-icon"/>
        <Controller
          name="destination"
          control={control}
          render={({ field }) =>
            <LocationTextBox value={field.value} onValueChange={v=>field.onChange(v)} disabled={formLoading} reset={()=>setValue(field.name, "")} 
              label="Drop-off point" name={field.name} error={errors[field.name]?.message}/>
          }
        />
      </span>
    </div>
    <div className="flex flex-col gap-4 relative">
      <button type="submit" className="ring-2 ring-primary-500 hover:ring-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors p-2 sm:p-4  rounded-md 
      disabled:bg-gray-100  disabled:ring-gray-500 disabled:cursor-wait relative"
      disabled={formLoading}>
        Search Route
        {formLoading?
          <div className="absolute right-8  top-1/2 -translate-y-1/2">
            <AiOutlineLoading3Quarters className="w-icon h-icon animate-spin"/>
          </div>:<></>}
      </button>
      {/* <button type="button" onClick={()=>getRouteQuery.refetch()}>retry get route</button> */}

      {postRouteMutate.status=="error"?
        <span className="text-error-500" role="alert">
          Failed to get route token, <button type="submit" value="retry">click here to retry</button>
        </span>:<></>}

      {getRouteQuery.isFetching?<>
      </>:<>
        {(getRouteQuery.status=="error")?
          <span className="text-error-500" role="alert">
          Failed to get route detail, <button type="button" onClick={()=>getRouteQuery.refetch()}>click here to retry</button>
          </span>:<></>}
        {(getRouteQuery.status=="success"&&getRouteQuery.data?.status=="failure")?
          <span className="text-error-500" role="alert">
            {getRouteQuery.data.error}, <button type="button" onClick={()=>getRouteQuery.refetch()}>click here to retry</button>
          </span>:<></>}
        {
          (getRouteQuery.status=="success"&&getRouteQuery.data?.status=="success")?
            <div className="border-success-600 border rounded-md w-full p-4 flex flex-row sm:flex-col bg-success-100 gap-2">
              <span className="text-success-600 text-md sm:text-xl">Route Found</span>
              <div className="flex flex-col text-xs">
                <span title="Total Time">Total Time: {getRouteQuery.data.total_time}</span>
                <span title="Total Distance">Total Distance: {getRouteQuery.data.total_distance}</span>
              </div>
            </div>:<>
            </>
        }
      </>}
    </div>
    
  </form>
}
export default RouteCheckSide;