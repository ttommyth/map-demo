import { MapContext } from ".";

export const MapProviderMock = ({children}:{children:React.ReactNode})=>{
  return <MapContext.Provider value={{
    mapConfig: {
      latitude: 0,
      longitude: 0,
      zoom: 0,
    },
    setMapConfig: ()=>{},
    setPath: ()=>{},
    setOnMapClick: ()=>{},
    onMapClick: ()=>{},
  }}>
    {children}
  </MapContext.Provider>
};