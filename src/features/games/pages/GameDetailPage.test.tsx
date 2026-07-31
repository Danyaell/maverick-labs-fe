import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { GameDetailPage } from "./GameDetailPage";
import type { GameDetail } from "../types/game.types";

const { mockFetchGameDetail } = vi.hoisted(() => ({
  mockFetchGameDetail: vi.fn(),
}));

vi.mock("../api/gameApi", () => ({
  fetchGameDetail: mockFetchGameDetail,
}));

describe("GameDetailPage", () => {
  beforeEach(() => {
    mockFetchGameDetail.mockReset();
  });

  test("shows the selected stage boss, weapon reward, and collectibles", async () => {
    const gameDetail: GameDetail = {
      code: "MMX",
      title: "Mega Man X",
      releaseOrder: 1,
      stages: [
        {
          slug: "chill-penguin",
          name: "Chill Penguin Stage",
          stageOrder: 1,
          imageAssetKey: "mmx.stage.chill-penguin",
          boss: {
            slug: "chill-penguin",
            name: "Chill Penguin",
            imageAssetKey: "mmx.boss.chill-penguin",
          },
          weaponReward: {
            slug: "shotgun-ice",
            name: "Shotgun Ice",
            description: "Fires ice projectiles.",
            imageAssetKey: "mmx.weapon.shotgun-ice",
          },
          collectibles: [
            {
              slug: "heart-tank",
              name: "Heart Tank",
              type: "HEART_TANK",
              description: "Increases maximum health.",
              imageAssetKey: "mmx.collectible.heart-tank",
              sortOrder: 1,
            },
          ],
        },
        {
          slug: "storm-eagle",
          name: "Storm Eagle Stage",
          stageOrder: 2,
          imageAssetKey: "mmx.stage.storm-eagle",
          boss: {
            slug: "storm-eagle",
            name: "Storm Eagle",
            imageAssetKey: "mmx.boss.storm-eagle",
          },
          weaponReward: {
            slug: "storm-tornado",
            name: "Storm Tornado",
            description: "Creates a tornado attack.",
            imageAssetKey: "mmx.weapon.storm-tornado",
          },
          collectibles: [
            {
              slug: "sub-tank",
              name: "Sub Tank",
              type: "SUB_TANK",
              description: "Provides extra health reserve.",
              imageAssetKey: "mmx.collectible.sub-tank",
              sortOrder: 1,
            },
          ],
        },
      ],
    };

    mockFetchGameDetail.mockResolvedValue(gameDetail);

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/games/MMX"]}>
        <Routes>
          <Route path="/games/:gameCode" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByAltText("Mega Man X")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /storm eagle stage/i }),
    );

    expect(screen.getByText("Storm Eagle")).toBeInTheDocument();
    expect(screen.getByText("Storm Tornado")).toBeInTheDocument();
    expect(screen.getByText("Sub Tank")).toBeInTheDocument();
  });
});
