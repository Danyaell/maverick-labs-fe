import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";
import { RouteAnalysisComparison } from "./RouteAnalysisComparison";
import {
  adjustedOrderRequest,
  adjustedOrderResponse,
  initialOrderRequest,
  initialOrderResponse,
} from "../data/routeAnalysisDemo.fixture";

function renderComparison() {
  return render(
    <MemoryRouter>
      <RouteAnalysisComparison />
    </MemoryRouter>,
  );
}

describe("routeAnalysisDemo fixture integrity", () => {
  test("both requests use MMX and HUNDRED_PERCENT with eight unique stages", () => {
    for (const request of [initialOrderRequest, adjustedOrderRequest]) {
      expect(request.gameCode).toBe("MMX");
      expect(request.goal).toBe("HUNDRED_PERCENT");
      expect(request.stageOrder).toHaveLength(8);
      expect(new Set(request.stageOrder).size).toBe(8);
    }
  });

  test("the two orders are not identical", () => {
    expect(initialOrderRequest.stageOrder).not.toEqual(
      adjustedOrderRequest.stageOrder,
    );
  });
});

describe("RouteAnalysisComparison", () => {
  test("renders the initial state by default", () => {
    renderComparison();

    const initialButton = screen.getByRole("button", {
      name: /initial order/i,
    });
    expect(initialButton).toHaveAttribute("aria-pressed", "true");

    const adjustedButton = screen.getByRole("button", {
      name: /recommended adjustment/i,
    });
    expect(adjustedButton).toHaveAttribute("aria-pressed", "false");
  });

  test("the initial route order and metrics match the fixture", () => {
    renderComparison();

    const stageOrder = screen.getByRole("list");
    const items = within(stageOrder).getAllByRole("listitem");
    expect(items).toHaveLength(8);
    expect(items[0]).toHaveTextContent("Spark Mandrill");
    expect(items[1]).toHaveTextContent("Chill Penguin");

    expect(
      screen.getByText(`${initialOrderResponse.backtrackingScore} / 100`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${initialOrderResponse.estimatedMinutes} min`),
    ).toBeInTheDocument();
  });

  test("selecting Recommended adjustment changes the visible order and metrics", async () => {
    const user = userEvent.setup();
    renderComparison();

    await user.click(
      screen.getByRole("button", { name: /recommended adjustment/i }),
    );

    const stageOrder = screen.getByRole("list");
    const items = within(stageOrder).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Chill Penguin");
    expect(items[1]).toHaveTextContent("Spark Mandrill");

    expect(
      screen.getByText(`${adjustedOrderResponse.backtrackingScore} / 100`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/good choice: chill penguin before spark mandrill/i),
    ).toBeInTheDocument();
  });

  test("supports selecting the adjustment from the keyboard", async () => {
    const user = userEvent.setup();
    renderComparison();

    await user.tab();
    await user.tab();
    const adjustedButton = screen.getByRole("button", {
      name: /recommended adjustment/i,
    });
    expect(adjustedButton).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(adjustedButton).toHaveAttribute("aria-pressed", "true");
    expect(adjustedButton).toHaveFocus();
  });

  test("marks the two swapped stages so their moved position is visible", () => {
    renderComparison();

    expect(screen.getAllByText("Moved")).toHaveLength(2);
  });

  test("links the CTA to the MMX route builder", () => {
    renderComparison();

    expect(
      screen.getByRole("link", { name: /try your own mmx route/i }),
    ).toHaveAttribute("href", "/games/MMX/route-builder");
  });

  test("explains the initial route limitations", () => {
    renderComparison();

    expect(
      screen.getByText(
        /shotgun ice and the leg upgrade are not yet available/i,
      ),
    ).toBeInTheDocument();
  });

  test("updates the explanation after selecting the adjustment", async () => {
    const user = userEvent.setup();
    renderComparison();

    await user.click(
      screen.getByRole("button", { name: /recommended adjustment/i }),
    );

    expect(
      screen.getByText(/the sub tank still requires boomerang cutter/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/are not yet available/i),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(/recommended adjustment selected/i),
    ).toHaveAttribute("aria-live", "polite");
  });
});
