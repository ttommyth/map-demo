// page.js
"use client";

import Map, { Layer, MapRef, Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useMap } from "@/hooks/MapProvider";
import { useRef } from "react";
import { HiMapPin } from "react-icons/hi2";

const MainMap = ()=>{
  const {mapConfig, direction, onMapClick} = useMap();
  const mapRef = useRef<MapRef>(null);
  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      initialViewState={{ latitude: 22.372035, longitude: 114.107848, zoom: 10, ...mapConfig }}
      maxZoom={20}
      minZoom={3}
      onClick={onMapClick}
    >
      {
        direction?.routes?
          <Source id="polylineLayer" type="geojson" data={{type:"Feature", properties:{},geometry: {
            type: "LineString",
            coordinates: direction.routes[0].geometry.coordinates
          }}}>
            <Layer
              id="lineLayer"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "#ff2b29",
                "line-width": 5
              }}
            />
          </Source>
          :<>
          </>
      }
      {direction?.waypoints?.map((wp,idx)=><Marker longitude={wp.location[0]} latitude={wp.location[1]} key={idx}>
        <div className="flex flex-col items-center gap-0 bg-white/50  rounded-full p-2 group">
          <span className="font-black whitespace-pre-wrap max-w-32 text-right">{wp.name}</span>
          <span className="text-xl flex flex-row items-center text-primary-500 font-black  ">
            {idx+1}
            <HiMapPin className="w-icon h-icon stroke-primary-800 fill-primary-500 stroke-2" />
          </span>
        </div>
      </Marker>)}
    </Map>
  );
}

export default MainMap;