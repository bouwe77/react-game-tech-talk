import { render, screen } from '@testing-library/react'
import App from './App'

test.skip('renders repactman', () => {
  render(<App />)
  const linkElement = screen.getByText(/repactman/i)
  expect(linkElement).toBeInTheDocument()
})
