/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LocationTextBox from '.'
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ClientProviderMock } from '@/utils/ClientProviders.mock';
const mock = new MockAdapter(axios, { onNoMatch: "throwException" });
 
it('LocationTextBox works with init value and update value', () => {
  let testValue = "a";
  render(<ClientProviderMock>
    <LocationTextBox value={testValue} onValueChange={v=>testValue=v} label="test" name="test"/>
  </ClientProviderMock>)
  expect(screen.getByLabelText('test')).toHaveValue("a")
  fireEvent.input(screen.getByLabelText('test'), { target: { value: 'Hong' } })
  expect(testValue).toBe("Hong")
});
it('LocationTextBox works with error value', () => {
  render(<ClientProviderMock>
    <LocationTextBox value={""} onValueChange={v=>{}} label="test" name="test" error='error is here'/>
  </ClientProviderMock>)
  expect(screen.getByText("error is here")).toBeInTheDocument();
});
it('LocationTextBox show related location', async () => {
  const mock = new MockAdapter(axios, { onNoMatch: "throwException" });
  const url = new URL(`./locationSearch`, process.env.NEXT_PUBLIC_GEODATA_BASE_URL);
  url.searchParams.set("q", "Hong Kong");
  mock.onGet(
    url.toString()
  ).replyOnce(
    200,
    Array(100).fill(0).map((_,idx)=>({
      "addressZH": ""+idx,
      "nameZH": ""+idx,
      "x": idx,
      "y": idx,
      "nameEN": ""+idx,
      "addressEN": ""+idx
    }))
  );
  
  render(<ClientProviderMock>
    <LocationTextBox value={"Hong Kong"} onValueChange={v=>{}} label="test" name="test"/>
  </ClientProviderMock>)
  expect(screen.getByLabelText('test')).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('test'))
  fireEvent.focus(screen.getByLabelText('test'))
  fireEvent.input(screen.getByLabelText('test'), { target: { value: 'Hong Kong' }})
  
  await waitFor(() => {
    expect(mock.history.get.length==1) // Ensure called once
    expect(mock.history.get[0].url).toBe(url.toString())
  }, {
    timeout: 1000
  })
});