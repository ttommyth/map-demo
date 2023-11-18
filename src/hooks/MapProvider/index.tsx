"use client"
import { getMapboxDirections } from "@/data/mapbox-directions-api/get";
import { useQuery } from "@tanstack/react-query";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { MapMouseEvent } from "react-map-gl";

export type MapContextType={
  mapConfig?:{
    latitude:number,
    longitude:number,
    zoom:number,
  },
  direction?:{
    routes:{
      duration: number,
      distance: number,
      geometry: {
        coordinates: [longitude:number,latitude:number][],
      }
    }[],
    waypoints:{
      name:string,
      location:[longitude:number,latitude:number],
    }[]
  },
  setMapConfig:(v:MapContextType["mapConfig"])=>unknown,
  setPath:(v:[longitude:number,latitude:number][]|undefined)=>unknown,
  setOnMapClick: (v:(ev: MapMouseEvent)=>unknown)=>unknown,
  onMapClick: (ev: MapMouseEvent)=>unknown,
  // setDirection:(v:MapContextType["direction"])=>unknown,
}

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider:FC<PropsWithChildren<unknown>> = ({children})=>{
  const [onMapClick, setOnMapClick] = useState<MapContextType["onMapClick"] | undefined>(undefined);
  const [mapConfig, setMapConfig] = useState<MapContextType["mapConfig"]>(undefined);
  const [path, setPath] = useState<[longitude:number,latitude:number][] | undefined>(undefined);
  const getDirectionQuery = useQuery({
    queryKey: ["getDirection", ...path??[]],
    queryFn:()=>{
      return getMapboxDirections({coordinates: path!, profile: "driving"});
    },
    enabled: !!path,
  });
  
  const direction = useMemo(()=>{
    if(getDirectionQuery.status =="success" && getDirectionQuery.data.routes.length>0){
      const data = getDirectionQuery.data;
      return ({
        routes: data.routes,
        waypoints: data.waypoints
      });
    }else{
      return undefined;
    }
  }, [getDirectionQuery]);
  return <MapContext.Provider value={{mapConfig, direction, setMapConfig, setPath, onMapClick: onMapClick?onMapClick:(ev:any)=>{}, setOnMapClick}}>
    {children}
  </MapContext.Provider>
};

export const useMap=()=>{
  const context = useContext(MapContext);
  if(context === null){
    throw new Error("useMap must be used within a MapProvider")
  }
  return context;
}

