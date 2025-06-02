import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Axios mocks
global.axiosGetMock = vi.fn()
global.axiosPostMock = vi.fn()
global.axiosDeleteMock = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: global.axiosGetMock,
      post: global.axiosPostMock,
      delete: global.axiosDeleteMock,
      interceptors: { response: { use: vi.fn() } }
    })
  }
}))

// Mock import.meta.env
if (!global.import) global.import = {}
global.import.meta = {
  env: {
    VITE_API_BASE_URL: 'http://localhost:8000',
    MODE: 'test'
  }
}

// Mock ResizeObserver
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe () {}
    unobserve () {}
    disconnect () {}
  }
}
