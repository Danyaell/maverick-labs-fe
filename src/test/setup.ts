import '@testing-library/jest-dom/vitest'

// Place for global mocks, polyfills, or test helpers
class ResizeObserverMock {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});