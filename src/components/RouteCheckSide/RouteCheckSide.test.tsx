/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RouteCheckSide from '.'
import { ClientProviderMock } from '@/utils/ClientProviders.mock'
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { postRoute } from '@/data/route-check-l1-api/route';
 
const mock = new MockAdapter(axios, { onNoMatch: "throwException" });
it('RouteCheckSide exists in view', () => {
  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  expect(screen.getByLabelText('Starting location')).toBeInTheDocument()
  expect(screen.getByLabelText('Drop-off point')).toBeInTheDocument()
  expect(screen.getByText('Search Route')).toBeInTheDocument()
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
  expect(screen.getByLabelText('Starting location')).toHaveValue("Hong")
  expect(screen.getByLabelText('Drop-off point')).toHaveValue("Kong")
})
it('RouteCheckSide Success Flow', async () => {
  mock.onPost(
    new URL("./route", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(),
  ).reply(200, { "token": "9d3503e0-7236-4e47-a62f-8b01b5646c16" });

  mock.onGet(
    new URL("./route/9d3503e0-7236-4e47-a62f-8b01b5646c16", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()
  ).reply(200,{
    "status": "success",
    "path": [
      ["22.372081", "114.107877"],
      ["22.326442", "114.167811"],
      ["22.284419", "114.159510"]
    ],
    "total_distance": 20000,
    "total_time": 1800
  });

  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
  fireEvent.click(screen.getByText('Search Route'))

  await waitFor(async () => {
    expect(await screen.findByText("Search Route")).not.toBeDisabled()
    expect(screen.getByText('Route Found')).toBeInTheDocument()
    expect(screen.getByTitle('Total Distance')).toBeInTheDocument()
    expect(screen.getByTitle('Total Time')).toBeInTheDocument()
  })
  expect(screen.getByTitle('Total Distance')).toContainHTML("20000")
  expect(screen.getByTitle('Total Time')).toContainHTML("1800")
})
it('RouteCheckSide failed to get route token', async () => {
  mock.onPost(
    new URL("./route", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(),
  ).reply(500);

  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
  fireEvent.click(screen.getByText('Search Route'))

  await waitFor(async () => {
    expect(await screen.findByText("Search Route")).not.toBeDisabled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  expect(screen.getByRole('alert')).toContainHTML("Failed to get route token")
});
it('RouteCheckSide failed to get route detail', async () => {
  mock.onPost(
    new URL("./route", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(),
  ).reply(200, { "token": "9d3503e0-7236-4e47-a62f-8b01b5646c16" });

  mock.onGet(
    new URL("./route/9d3503e0-7236-4e47-a62f-8b01b5646c16", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()
  ).reply(500);

  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
  fireEvent.click(screen.getByText('Search Route'))

  await waitFor(async () => {
    expect(await screen.findByText("Search Route")).not.toBeDisabled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  expect(screen.getByRole('alert')).toContainHTML("Failed to get route detail")
})
it('RouteCheckSide received failure route detail result', async () => {
  mock.onPost(
    new URL("./route", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(),
  ).reply(200, { "token": "9d3503e0-7236-4e47-a62f-8b01b5646c16" });

  mock.onGet(
    new URL("./route/9d3503e0-7236-4e47-a62f-8b01b5646c16", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()
  ).reply(200,{
    "status": "failure",
    "error": "Unit Test Success"  
  });

  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
  fireEvent.click(screen.getByText('Search Route'))

  await waitFor(async () => {
    expect(await screen.findByText("Search Route")).not.toBeDisabled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  expect(screen.getByRole('alert')).toContainHTML("Unit Test Success")
})
it('RouteCheckSide get route detail should retry', async () => {
  const mock = new MockAdapter(axios, { onNoMatch: "throwException" });
  mock.onPost(
    new URL("./route", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString(),
  ).reply(200, { "token": "9d3503e0-7236-4e47-a62f-8b01b5646c16" });


  mock.onGet(
    new URL("./route/9d3503e0-7236-4e47-a62f-8b01b5646c16", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()
  ).replyOnce(200,{
    "status": "in progress",
  });
  mock.onGet(
    new URL("./route/9d3503e0-7236-4e47-a62f-8b01b5646c16", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()
  ).reply(200,{
    "status": "success",
    "path": [
      ["22.372081", "114.107877"],
      ["22.326442", "114.167811"],
      ["22.284419", "114.159510"]
    ],
    "total_distance": 20000,
    "total_time": 1800
  });
  

  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
  fireEvent.click(screen.getByText('Search Route'))

  await waitFor(async () => {
    expect(await screen.findByText("Search Route")).not.toBeDisabled()
    expect(screen.getByText('Route Found')).toBeInTheDocument()
    expect(screen.getByTitle('Total Distance')).toBeInTheDocument()
    expect(screen.getByTitle('Total Time')).toBeInTheDocument()
  }, {timeout: 5000})
  expect(screen.getByTitle('Total Distance')).toContainHTML("20000")
  expect(screen.getByTitle('Total Time')).toContainHTML("1800")
  expect(mock.history.get.filter(it=>it.url==
    new URL("./route/9d3503e0-7236-4e47-a62f-8b01b5646c16", process.env.NEXT_PUBLIC_ROUTE_CHECK_L1_BASE_URL).toString()
  ).length).toEqual(2) //Ensure it retry
})