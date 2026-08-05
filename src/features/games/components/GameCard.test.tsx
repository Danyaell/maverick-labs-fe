import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { GameCard } from "./GameCard";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";

test("renders GameCard title and link", () => {
  const game = { code: "MMX", title: "Mega Man X", releaseOrder: 1 };

  renderWithQueryClient(
    <MemoryRouter>
      <GameCard game={game} />
    </MemoryRouter>,
  );

  expect(screen.getByAltText("Mega Man X")).toBeInTheDocument();
  const link = screen.getByRole("link", {
    name: "Mega Man X",
  });

  expect(link).toHaveAttribute("href", "/games/MMX");
});
