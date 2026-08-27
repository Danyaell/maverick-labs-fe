import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, type RouteObject } from "react-router";
import { describe, expect, test } from "vitest";
import App from "./App";

function renderApp(initialEntry: string, children: RouteObject[]) {
  const router = createMemoryRouter(
    [{ path: "/", element: <App />, children }],
    { initialEntries: [initialEntry] },
  );

  return render(<RouterProvider router={router} />);
}

describe("App", () => {
  test("logo links back to the root", () => {
    renderApp("/", [{ index: true, element: <p>Home</p> }]);

    expect(screen.getByRole("link", { name: /maverick labs/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  test("footer links to the Architecture landing anchor instead of /about", () => {
    renderApp("/", [{ index: true, element: <p>Home</p> }]);

    const architectureLink = screen.getByRole("link", { name: /architecture/i });
    expect(architectureLink).toHaveAttribute("href", "/#architecture");
    expect(screen.queryByRole("link", { name: /^about$/i })).not.toBeInTheDocument();
  });

  test("renders no breadcrumb trail when the matched route has no breadcrumb handle", () => {
    renderApp("/", [{ index: true, element: <p>Home</p> }]);

    expect(screen.queryByRole("navigation", { name: /breadcrumb/i })).not.toBeInTheDocument();
  });

  test("renders a breadcrumb trail when the matched route defines one", () => {
    renderApp("/games", [
      {
        path: "games",
        handle: { breadcrumb: () => ({ label: "Games", to: "/games" }) },
        element: <p>Catalog</p>,
      },
    ]);

    const breadcrumbNav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(breadcrumbNav).toBeInTheDocument();
    expect(within(breadcrumbNav).getByText("Games")).toBeInTheDocument();
  });
});
