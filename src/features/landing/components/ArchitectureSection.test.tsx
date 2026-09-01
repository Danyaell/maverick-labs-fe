import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ArchitectureSection } from "./ArchitectureSection";
import {
  BACKEND_REPOSITORY_URL,
  FRONTEND_REPOSITORY_URL,
} from "../../../shared/config/env";

describe("ArchitectureSection", () => {
  test("retains the stable id=\"architecture\" anchor", () => {
    const { container } = render(<ArchitectureSection />);

    expect(container.querySelector("section#architecture")).not.toBeNull();
  });

  test("the runtime flow lists Browser, client, API, and MySQL in order", () => {
    render(<ArchitectureSection />);

    const flow = screen.getByRole("list", { name: /runtime request flow/i });
    const items = within(flow).getAllByRole("listitem");

    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Browser");
    expect(items[1]).toHaveTextContent("React/TypeScript client");
    expect(items[2]).toHaveTextContent("Spring Boot REST API");
    expect(items[3]).toHaveTextContent("MySQL");
  });

  test("keeps GitHub Actions, Vercel, and Railway out of the runtime flow", () => {
    render(<ArchitectureSection />);

    const flow = screen.getByRole("list", { name: /runtime request flow/i });
    expect(within(flow).queryByText(/github actions/i)).not.toBeInTheDocument();
    expect(within(flow).queryByText(/vercel/i)).not.toBeInTheDocument();
    expect(within(flow).queryByText(/railway/i)).not.toBeInTheDocument();

    expect(screen.getAllByText(/github actions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vercel/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/railway/i).length).toBeGreaterThan(0);
  });

  test("describes TanStack Query and typed clients at the frontend/API boundary", () => {
    render(<ArchitectureSection />);

    expect(
      screen.getAllByText(/tanstack query and typed api clients/i).length,
    ).toBeGreaterThan(0);
  });

  test("represents controllers, services, repositories, and DTOs", () => {
    render(<ArchitectureSection />);

    expect(screen.getByText("Controllers:")).toBeInTheDocument();
    expect(screen.getByText(/receive http requests and expose dtos/i)).toBeInTheDocument();
    expect(screen.getByText("Services:")).toBeInTheDocument();
    expect(screen.getByText("Repositories:")).toBeInTheDocument();
    expect(
      screen.getByText(/persistence through spring data jpa\/hibernate/i),
    ).toBeInTheDocument();
  });

  test("identifies Flyway as the schema and seed source of truth", () => {
    render(<ArchitectureSection />);

    expect(screen.getByText("Flyway:")).toBeInTheDocument();
    expect(
      screen.getByText(/source of truth for schema migrations and seed data/i),
    ).toBeInTheDocument();
  });

  test("surfaces Testcontainers, Vitest, and Testing Library as testing concerns", () => {
    render(<ArchitectureSection />);

    expect(screen.getByText("Testcontainers:")).toBeInTheDocument();
    expect(screen.getByText("Vitest & Testing Library:")).toBeInTheDocument();
  });

  test("renders all four stack groups with their required technologies", () => {
    render(<ArchitectureSection />);

    const expectations: Record<string, string[]> = {
      Frontend: ["React", "TypeScript", "Vite", "TanStack Query", "dnd-kit"],
      Backend: [
        "Java 21",
        "Spring Boot",
        "Spring MVC",
        "Spring Data JPA / Hibernate",
        "DTO-based REST contracts",
      ],
      "Data & testing": [
        "MySQL",
        "Flyway",
        "Testcontainers",
        "Vitest",
        "Testing Library",
      ],
      Delivery: ["GitHub Actions", "Vercel", "Railway"],
    };

    for (const [groupTitle, items] of Object.entries(expectations)) {
      const heading = screen.getByRole("heading", { name: groupTitle });
      const group = heading.closest("div");
      expect(group).not.toBeNull();
      for (const item of items) {
        expect(within(group as HTMLElement).getByText(item)).toBeInTheDocument();
      }
    }
  });

  test("links to the frontend and backend repositories safely in a new tab", () => {
    render(<ArchitectureSection />);

    const frontendLink = screen.getByRole("link", {
      name: /view frontend repository/i,
    });
    expect(frontendLink).toHaveAttribute("href", FRONTEND_REPOSITORY_URL);
    expect(frontendLink).toHaveAttribute("target", "_blank");
    expect(frontendLink).toHaveAttribute("rel", "noopener noreferrer");

    const backendLink = screen.getByRole("link", {
      name: /view backend repository/i,
    });
    expect(backendLink).toHaveAttribute("href", BACKEND_REPOSITORY_URL);
    expect(backendLink).toHaveAttribute("target", "_blank");
    expect(backendLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
