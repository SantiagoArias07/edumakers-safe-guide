import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock leaflet — it uses browser APIs not available in jsdom
vi.mock('leaflet', () => ({
  default: {},
  map: vi.fn(),
  tileLayer: vi.fn(),
}))

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  CircleMarker: ({ children }) => <div data-testid="circle-marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({ flyTo: vi.fn(), setView: vi.fn() }),
}))

// Suppress console.error for expected React errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('act(') || args[0]?.includes?.('Warning:')) return
    originalError(...args)
  }
})
afterAll(() => {
  console.error = originalError
})
