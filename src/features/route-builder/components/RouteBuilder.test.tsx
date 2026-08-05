import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { RouteBuilder } from "./RouteBuilder";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";
import { createGameDetail, DEFAULT_STAGE_ORDER } from "../../../test/fixtures/routeBuilderFixtures";

function getRenderedStageOrder(): string[] {
  const stageList = screen.getByRole("list", {
    name: /stage order/i,
  });

  return within(stageList)
    .getAllByRole("listitem")
    .map((item) => item.dataset.stageSlug ?? "");
}

vi.mock("./LiveRouteAnalysis", () => ({
  LiveRouteAnalysis: () => null,
}));

describe("RouteBuilder", () => {
  test("should render boss names", () => {
    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    expect(screen.getByTestId("stage-card-chill-penguin")).toHaveTextContent(
      "Chill Penguin",
    );
    expect(screen.getByTestId("stage-card-storm-eagle")).toHaveTextContent(
      "Storm Eagle",
    );
    expect(screen.getByTestId("stage-card-flame-mammoth")).toHaveTextContent(
      "Flame Mammoth",
    );
  });

  test("should render weapon rewards", () => {
    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    expect(screen.getByText("Shotgun Ice")).toBeInTheDocument();
    expect(screen.getByText("Storm Tornado")).toBeInTheDocument();
    expect(screen.getByText("Fire Wave")).toBeInTheDocument();
  });

  test("keeps visual order synchronized after moving stages", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(getRenderedStageOrder()).toEqual([
      "storm-eagle",
      "chill-penguin",
      "flame-mammoth",
    ]);

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(getRenderedStageOrder()).toEqual([
      "storm-eagle",
      "flame-mammoth",
      "chill-penguin",
    ]);
  });

  test("disables movement controls at list boundaries", () => {
    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    expect(
      screen.getByRole("button", {
        name: /move chill penguin stage up/i,
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: /move flame mammoth stage up/i,
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: /move flame mammoth stage down/i,
      }),
    ).toBeDisabled();
  });

  test("resets route after changing its order", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(getRenderedStageOrder()).toEqual([
      "storm-eagle",
      "chill-penguin",
      "flame-mammoth",
    ]);

    await user.click(
      screen.getByRole("button", {
        name: /reset to default order/i,
      }),
    );

    expect(getRenderedStageOrder()).toEqual(DEFAULT_STAGE_ORDER);
  });
});
