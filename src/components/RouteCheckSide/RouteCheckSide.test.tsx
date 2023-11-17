/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RouteCheckSide from '.'
 
it('LocationTextBox works with init value and update value', () => {
  render(<RouteCheckSide />)
  expect(screen.getByLabelText('origin')).toBeInTheDocument()
  expect(screen.getByLabelText('destination')).toBeInTheDocument()
  expect(screen.getByText('Search Route')).toBeInTheDocument()
  fireEvent.input(screen.getByLabelText('origin'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('destination'), { target: { value: 'Kong' } })
})