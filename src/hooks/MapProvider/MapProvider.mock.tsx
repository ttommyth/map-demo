import { MapContext, MapContextType } from ".";

export const MapProviderMock = ({children, mockValue }:{children:React.ReactNode,  mockValue?: Partial<MapContextType>})=>{
  return <MapContext.Provider value={{
    mapConfig: {
      latitude: 0,
      longitude: 0,
      zoom: 0,
    },
    setMapConfig: ()=>{},
    setPath: ()=>{},
    setWaitingMapClickKey: ()=>{},
    setMapClickLocation: ()=>{},
    mapClickLocation: undefined,
    ...mockValue
  }}>
    {children}
  </MapContext.Provider>
};