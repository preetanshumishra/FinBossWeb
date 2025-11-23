import '@testing-library/jest-dom';

// Polyfill TextEncoder for tests (for react-router compatibility)
// This is needed for react-router v6 in Jest/jsdom environment
if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = class TextEncoder {
    encode(input: string) {
      const uint8 = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        uint8[i] = input.charCodeAt(i);
      }
      return uint8;
    }
  };
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
declare global {
  interface Global {
    IntersectionObserver: any;
  }
}

(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
