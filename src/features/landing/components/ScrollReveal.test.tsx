import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ScrollReveal } from "./ScrollReveal";

let observerCallback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
}

describe("ScrollReveal", () => {
  beforeEach(() => {
    observe.mockReset();
    disconnect.mockReset();

    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: IntersectionObserverMock,
    });

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("observes its content on mount", () => {
    const { container } = render(
      <ScrollReveal>
        <p>Landing content</p>
      </ScrollReveal>,
    );

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveAttribute("data-revealed", "false");
    expect(observe).toHaveBeenCalledWith(wrapper);
  });

  test("reveals its content after entering the viewport", () => {
    const { container } = render(
      <ScrollReveal>
        <p>Landing content</p>
      </ScrollReveal>,
    );

    const wrapper = container.firstElementChild!;

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(wrapper).toHaveAttribute("data-revealed", "true");
    expect(disconnect).toHaveBeenCalled();
  });

  test("reveals immediately when reduced motion is requested", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const { container } = render(
      <ScrollReveal>
        <p>Landing content</p>
      </ScrollReveal>,
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-revealed",
      "true",
    );
    expect(observe).not.toHaveBeenCalled();
  });
});
