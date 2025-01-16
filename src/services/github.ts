import axios from "axios";

export interface GithubRepository {
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  type: "Author" | "Contributor";
}

export interface Repository {
  name: string;
  description: string | null;
  stars: number;
  url: string;
  type: "Author" | "Contributor";
}

const repositoryData = [
  {
    name: "przeprogramowani/advent-of-frontend",
    description:
      "Advent of Frontend challenges powered by GPT-4, part of Przeprogramowani.pl",
    type: "Author" as const,
  },
  {
    name: "przeprogramowani/typescript-challenges",
    description:
      "Open source collection of Typescript challenges, part of Przeprogramowani.pl",
    type: "Author" as const,
  },
  {
    name: "openapi-ts/openapi-typescript",
    description:
      "Generate types from OpenAPI specifications - introduced remote spec fetching.",
    type: "Contributor" as const,
  },
  {
    name: "HamedMP/CursorLens",
    description:
      "Track and measure requests to LLM Platforms - introduced fine-grained log management.",
    type: "Contributor" as const,
  },
  {
    name: "psmyrdek/ng-up",
    description:
      "Open source tooling to enable Angular.js to Angular migration - AST experiments.",
    type: "Author" as const,
  },
  {
    name: "psmyrdek/ml_sandbox",
    description:
      "Low-level machine learning experiments - for fun, learning and knowledge sharing.",
    type: "Author" as const,
  },
];

const mockRepositories: GithubRepository[] = repositoryData.map((repo) => ({
  name: repo.name,
  description: repo.description,
  stargazers_count: Math.floor(Math.random() * 1000),
  html_url: `https://github.com/${repo.name}`,
  type: repo.type,
}));

export async function getGithubRepositories(): Promise<Repository[]> {
  // Use mock data in development mode
  if (import.meta.env.DEV) {
    return mockRepositories.map((repo) => ({
      name: "DEV DATA",
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url,
      type: repo.type,
    }));
  }

  // Fetch real data in production
  const repositories: GithubRepository[] = await Promise.all(
    repositoryData.map(async (repo) => {
      const response = await axios.get(
        `https://api.github.com/repos/${repo.name}`,
        {
          headers: {
            Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
          },
        }
      );
      return {
        ...response.data,
        description: repo.description,
        type: repo.type,
      };
    })
  );

  return repositories.map((repo) => ({
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    url: repo.html_url,
    type: repo.type,
  }));
}
