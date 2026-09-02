import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LandingPage } from "../features/landing/pages/LandingPage";
import { GameCatalogPage } from "../features/games/pages/GameCatalogPage";
import { GameDetailPage } from "../features/games/pages/GameDetailPage";
import { RouteBuilderPage } from "../features/route-builder/pages/RouteBuilderPage";

const GAME_NAMES: Record<string, string> = {
  MMX: "Mega Man X",
  MMX2: "Mega Man X2",
  MMX3: "Mega Man X3",
  MMX4: "Mega Man X4",
  MMX5: "Mega Man X5",
  MMX6: "Mega Man X6",
  MMX7: "Mega Man X7",
  MMX8: "Mega Man X8",
};

export const routeConfig: RouteObject[] = [
  {
    path: "/",
    handle: {
      breadcrumb: () => ({
        label: "Home",
        to: "/",
      }),
    },
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "games",
        handle: {
          breadcrumb: () => ({
            label: "Games",
            to: "/games",
          }),
        },
        children: [
          {
            index: true,
            element: <GameCatalogPage />,
          },
          {
            path: ":gameCode",
            handle: {
              breadcrumb: (gameCode?: string) => ({
                label: GAME_NAMES[gameCode ?? ""] ?? gameCode ?? "Game",
                to: `/games/${gameCode}`,
              }),
            },
            children: [
              {
                index: true,
                element: <GameDetailPage />,
              },
              {
                path: "route-builder",
                element: <RouteBuilderPage />,
                handle: {
                  breadcrumb: (gameCode?: string) => ({
                    label: "Route Builder",
                    to: `/games/${gameCode}/route-builder`,
                  }),
                },
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routeConfig);
