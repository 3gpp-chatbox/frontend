import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost:8000';

// Mock import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:8000',
      MODE: 'test',
    },
  },
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 