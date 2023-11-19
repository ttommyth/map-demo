import { getLocationSearch } from "@/data/geodata-api/location-search/get";
import { getSearchNearbyByLatLong } from "@/data/geodata-api/search-nearby/get";
import { useMap } from "@/hooks/MapProvider";
import { Combobox, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MapLayerMouseEvent, MapMouseEvent } from "mapbox-gl";
import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiMapPin, HiXMark } from "react-icons/hi2";
import { useDebounce } from "usehooks-ts";

const LocationTextBox:FC<{value: string, onValueChange:(v:string)=>unknown, disabled?: boolean, error?:string, reset?:()=>unknown, label:string, name:string}> = 
({value, onValueChange,disabled, error,reset, label, name}) => {
  const {mapClickLocation, setMapClickLocation, waitingMapClickKey, setWaitingMapClickKey} = useMap();
  const debouncedValue = useDebounce<string>(value, 1000);
  const relatedLocationQuery = useQuery({
    queryKey: ['location', debouncedValue],
    queryFn: async () => {      
      // Take first 10 results
      return await getLocationSearch({query: debouncedValue}).then(res=>res.slice(0,10));
    },
    enabled:debouncedValue.length>=2
  });
  
  useEffect(()=>{
    if(!mapClickLocation || waitingMapClickKey!=name)
      return;
    onValueChange(mapClickLocation);
    setWaitingMapClickKey(undefined);
    setMapClickLocation(undefined);
  }, [mapClickLocation, waitingMapClickKey])
  return <div className="flex flex-col w-full relative">
    <span className="w-full relative mt-2">
      <span className="flex w-full -translate-y-full absolute top-0 text-xs">
        <label htmlFor={"input-"+name} className="grow">{label}</label>
        {
          waitingMapClickKey==name?
            <span className="text-gray-500 flex">
              click on the map to select location
              <HiMapPin className="" title="click on the map to select location"/>
            </span>:<></>
        }
      </span>
      <Combobox value={value} onChange={onValueChange} disabled={disabled}>
        <Combobox.Input onChange={(event) => onValueChange(event.target.value)}
          id={"input-"+name}
          onFocus={ev=>{
            setWaitingMapClickKey(name);
          }}
          className=" w-full rounded-md ring-base-500 ring-1 focus:ring-primary-500 focus:ring-2 focus:outline-none px-2 py-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {
          debouncedValue.length>=2?
            <Combobox.Options 
              className="absolute left-0 right-0 top-full z-10 mt-2 bg-white  ring-primary-500 ring-2 rounded-md flex flex-col gap-1 p-2 max-h-96 overflow-y-scroll">
              {
                relatedLocationQuery.data?.map((location, i)=>
                  <Combobox.Option key={i} value={location.nameEN} className={
                    ({active})=>`rounded-md hover:bg-primary-100 p-1 px-2 cursor-pointer flex flex-col ${active?"bg-primary-100":""}`
                  }>
                    <span className="" role="related-location-name">{location.nameEN}</span>
                    <span className="text-xs text-gray-500">{location.addressEN}</span>
                  </Combobox.Option>
                )
              }
              {(relatedLocationQuery.isFetching && !relatedLocationQuery.data?.length)?<span>Loading...</span>:<>
                {
                  relatedLocationQuery.data?.length==0?<span>No results</span>:<></>
                }
              </>}
            </Combobox.Options>:<>
            </>
        }
      </Combobox>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row">
        {
          relatedLocationQuery.isFetching? 
            <AiOutlineLoading3Quarters className="w-icon h-icon animate-spin"/>:<></>
        }
        <button  type="button" className="" onClick={()=>{reset?.()}} disabled={disabled}><HiXMark className="w-icon h-icon"/> </button>
      </span>
    </span>

    {error?
      <span className="text-xs text-error-500">{error}</span>:<>
      </>}
  </div>
};

export default LocationTextBox;