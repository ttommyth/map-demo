// page.js
"use client";

import Map, { Layer, MapRef, MapboxStyle, Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useMap } from "@/hooks/MapProvider";
import { useCallback, useRef, useState } from "react";
import { HiMapPin } from "react-icons/hi2";
import MAP_STYLE from './map-style-basic-v8.json';

const MainMap = ()=>{
  const [cursor, setCursor] = useState<string>('auto');
  const {mapConfig, direction, setMapClickLocation, waitingMapClickKey} = useMap();
  const mapRef = useRef<MapRef>(null);
  
  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);
  
  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle={MAP_STYLE as MapboxStyle}
      initialViewState={{ latitude: 22.372035, longitude: 114.107848, zoom: 10, ...mapConfig }}
      maxZoom={20}
      minZoom={3}
      onClick={ev=>waitingMapClickKey&&setMapClickLocation(ev.features?.[0]?.properties?.name_en)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor={cursor}
      interactiveLayerIds={
        MAP_STYLE.layers.map(layer => layer.id).filter(it=>
          [
            /park/,
            /building/,
            /bridge|road|tunnel/,
            /label|place|poi/
          ].find(regex=>regex.test(it))
        )
      }
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