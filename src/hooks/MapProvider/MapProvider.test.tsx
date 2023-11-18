/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ClientProviderMock } from '@/utils/ClientProviders.mock'
import { MapContextType, MapProvider, useMap } from '.';
import nock from 'nock';
import { useEffect } from 'react';
import { getMapboxDirections } from '@/data/mapbox-directions-api/get';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);
it('MapProvider works with children', () => {
  render(
    <ClientProviderMock>
      <MapProvider>
        <div>Child Component</div>
      </MapProvider>        
    </ClientProviderMock>
  )
  expect(screen.getByText('Child Component')).toBeInTheDocument()
});

const TestingComponent = (props: {ctxCalback: (ctx: MapContextType)=>unknown}) => {
  const mapCtx = useMap();
  useEffect(()=>{
    props.ctxCalback(mapCtx);
  }, [mapCtx, props]);
  return (
    <>
      {mapCtx.mapConfig?
        <span role='result' title='mapConfig'>{JSON.stringify(mapCtx.mapConfig)}</span>:<></>}
      {mapCtx.direction?
        <span role='result' title='direction'>{JSON.stringify(mapCtx.direction)}</span>:<></>}
    </>
  );
};
it('useMap only works when provider exist', async () => {
  const spy = jest.spyOn(console, 'error')
  spy.mockImplementation(() => {})

  expect(
    ()=>{
      render(
        <TestingComponent ctxCalback={()=>{}}/>
      )}
  ).toThrow("useMap must be used within a MapProvider")
  spy.mockRestore()
});

it('MapProvider updated map config', async () => {
  const testMapConfig={
    latitude: 0,
    longitude: 0,
    zoom: 0,
  };
  render(
    <ClientProviderMock>
      <MapProvider>
        <TestingComponent ctxCalback={ctx=>{
          ctx.setMapConfig(testMapConfig);
        }}/>
      </MapProvider>        
    </ClientProviderMock>
  )
  await waitFor(() => {
    expect(screen.getByTitle('mapConfig')).toBeDefined();
  });
  expect(screen.getByTitle('mapConfig')).toHaveTextContent(JSON.stringify(testMapConfig));
});

it('MapProvider get direction after path updated', async () => {
  const testPath: [number,number][] = [[0,0], [1,1]];
  const url = new URL(`./driving/${encodeURIComponent(testPath.map(it=>`${it[0]},${it[1]}`).join(";"))}`, process.env.NEXT_PUBLIC_MAPBOX_DIRECTIONS_API_BASE_URL);
  url.searchParams.set("alternatives", "false");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("language", "en");
  url.searchParams.set("overview", "full");
  url.searchParams.set("steps", "true");
  url.searchParams.set("access_token", process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
  const mockResponse =  { routes: [{ duration: 100, distance: 100, geometry: { coordinates: [[0,0], [1,1]] } }], waypoints: [{ name: "test", location: [0,0] }] };
  mock.onGet(url.toString())
    .reply(200, mockResponse);
  expect(await getMapboxDirections({coordinates: testPath, profile: "driving"})).toEqual(mockResponse);
  
  render(
    <ClientProviderMock>
      <MapProvider>
        <TestingComponent ctxCalback={ctx=>{
          ctx.setPath(testPath);
        }}/>
      </MapProvider>        
    </ClientProviderMock>
  )
  
  await waitFor(() => {
    expect(screen.getByTitle('direction')).toBeDefined();
  })
  expect(screen.getByTitle('direction')).toHaveTextContent(JSON.stringify(mockResponse));

});
