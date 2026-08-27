import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";
import { CapabilitiesSection } from "./CapabilitiesSection";

function renderSection() {
  return render(
    <MemoryRouter>
      <CapabilitiesSection />
    </MemoryRouter>,
  );
}

describe("CapabilitiesSection", () => {
  test("renders exactly four list items in a semantic ordered list", () => {
    renderSection();

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(4);
  });

  test("renders all four capability titles in the expected order", () => {
    renderSection();

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Explore the eight-game catalog",
      "Inspect stages, Mavericks, weapons, and collectibles",
      "Build an eight-stage route",
      "Analyze every completed route change",
    ]);
  });

  test("communicates the eight-game catalog and MMX-only route planning availability", () => {
    renderSection();

    expect(
      screen.getByText(/browse all eight main mega man x titles/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /detailed stages and route planning are currently available for mega man x/i,
      ),
    ).toBeInTheDocument();
  });

  test("links to the catalog, MMX detail, route builder, and analysis comparison", () => {
    renderSection();

    expect(screen.getByRole("link", { name: "View catalog" })).toHaveAttribute(
      "href",
      "/games",
    );
    expect(
      screen.getByRole("link", { name: "Explore Mega Man X" }),
    ).toHaveAttribute("href", "/games/MMX");
    expect(
      screen.getByRole("link", { name: "Open Route Builder" }),
    ).toHaveAttribute("href", "/games/MMX/route-builder");
    expect(
      screen.getByRole("link", { name: "See the analysis comparison" }),
    ).toHaveAttribute("href", "/#demo");
  });

  test("resolves all four visual assets to a non-empty image source", () => {
    const { container } = renderSection();

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(4);
    for (const image of images) {
      expect(image.getAttribute("src")).toBeTruthy();
    }
  });

  test("links are accessible by their visible labels", () => {
    renderSection();

    for (const label of [
      "View catalog",
      "Explore Mega Man X",
      "Open Route Builder",
      "See the analysis comparison",
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
