/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LocationTextBox from '.'
 
it('LocationTextBox works with init value and update value', () => {
  let testValue = "a";
  render(<LocationTextBox inputProps={{value:testValue, onChange:ev=>testValue=ev.target.value}} label="test" name="test"/>)
  expect(screen.getByLabelText('test')).toHaveValue("a")
  fireEvent.input(screen.getByLabelText('test'), { target: { value: 'Hong' } })
  expect(testValue).toBe("Hong")
});
it('LocationTextBox works with error value', () => {
  render(<LocationTextBox inputProps={{}} label="test" name="test" error='error is here'/>)
  expect(screen.getByText("error is here")).toBeInTheDocument();
});