import '@testing-library/jest-dom/vitest'

// Place for global mocks, polyfills, or test helpers
class ResizeObserverMock implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}

  observe(
    _target: Element,
    _options?: ResizeObserverOptions,
  ): void {}

  unobserve(_target: Element): void {}

  disconnect(): void {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});