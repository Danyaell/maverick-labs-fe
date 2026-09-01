export interface RuntimeFlowNode {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
}

/** Browser -> client -> API -> database. CI/hosting/testing tools are deliberately excluded from this path. */
export const RUNTIME_FLOW: readonly RuntimeFlowNode[] = [
  {
    id: "browser",
    label: "Browser",
    detail: "Renders the interface and initiates requests through the React client.",
  },
  {
    id: "client",
    label: "React/TypeScript client",
    detail:
      "TanStack Query and typed API clients form the frontend's integration boundary with the backend.",
  },
  {
    id: "api",
    label: "Spring Boot REST API",
    detail:
      "Spring MVC controllers receive requests and expose DTOs; services own the application and route-analysis behavior.",
  },
  {
    id: "database",
    label: "MySQL",
    detail:
      "Stores catalog, stage, boss, weapon, collectible, and requirement data.",
  },
] as const;

export interface ArchitectureConcept {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const APPLICATION_BOUNDARIES: readonly ArchitectureConcept[] = [
  {
    id: "frontend-integration",
    title: "Frontend integration",
    description:
      "TanStack Query and typed API clients form the boundary between the UI and the backend.",
  },
  {
    id: "controllers",
    title: "Controllers",
    description: "Spring MVC controllers receive HTTP requests and expose DTOs.",
  },
  {
    id: "services",
    title: "Services",
    description: "Services own application and route-analysis behavior.",
  },
  {
    id: "repositories",
    title: "Repositories",
    description:
      "Repositories handle persistence through Spring Data JPA/Hibernate.",
  },
] as const;

export const DATA_AND_TESTING: readonly ArchitectureConcept[] = [
  {
    id: "flyway",
    title: "Flyway",
    description: "The source of truth for schema migrations and seed data.",
  },
  {
    id: "hibernate",
    title: "Hibernate",
    description: "Validates and accesses the migrated schema.",
  },
  {
    id: "testcontainers",
    title: "Testcontainers",
    description:
      "Runs backend integration tests against an isolated MySQL environment.",
  },
  {
    id: "frontend-tests",
    title: "Vitest & Testing Library",
    description: "Validate frontend behavior and components.",
  },
] as const;

export const DELIVERY_AND_HOSTING: readonly ArchitectureConcept[] = [
  {
    id: "github-actions",
    title: "GitHub Actions",
    description: "Validates changes through CI.",
  },
  {
    id: "vercel",
    title: "Vercel",
    description: "Hosts the React frontend.",
  },
  {
    id: "railway",
    title: "Railway",
    description: "Hosts the Spring Boot API and production MySQL service.",
  },
] as const;

export interface StackGroup {
  readonly id: string;
  readonly title: string;
  readonly items: readonly string[];
}

export const STACK_GROUPS: readonly StackGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    items: ["React", "TypeScript", "Vite", "TanStack Query", "dnd-kit"],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      "Java 21",
      "Spring Boot",
      "Spring MVC",
      "Spring Data JPA / Hibernate",
      "DTO-based REST contracts",
    ],
  },
  {
    id: "data-testing",
    title: "Data & testing",
    items: ["MySQL", "Flyway", "Testcontainers", "Vitest", "Testing Library"],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: ["GitHub Actions", "Vercel", "Railway"],
  },
] as const;
