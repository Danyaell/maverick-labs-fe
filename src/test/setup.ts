import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});