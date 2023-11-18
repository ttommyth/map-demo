/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RouteCheckSide from '.'
import { ClientProviderMock } from '@/utils/ClientProviders.mock'
 
it('RouteCheckSide exists in view', () => {
  render(<ClientProviderMock><RouteCheckSide/></ClientProviderMock>)
  expect(screen.getByLabelText('Starting location')).toBeInTheDocument()
  expect(screen.getByLabelText('Drop-off point')).toBeInTheDocument()
  expect(screen.getByText('Search Route')).toBeInTheDocument()
  fireEvent.input(screen.getByLabelText('Starting location'), { target: { value: 'Hong' } })
  fireEvent.input(screen.getByLabelText('Drop-off point'), { target: { value: 'Kong' } })
})