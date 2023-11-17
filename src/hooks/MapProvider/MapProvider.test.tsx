import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { MapContext, MapProvider } from '.'

// test('component handles button click', () => {
//   const addItem = jest.fn()
//   render(
//     <MapProvider>
      
//     </MapProvider>
//   )
// })

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