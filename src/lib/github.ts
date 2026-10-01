import type { GitHub } from "@/types/github";
import { serverEnv } from "@/lib/env";

export const mockGitHubStats: GitHub = {
  username: "TODO-github-username",
  repos: 12,
  stars: 8,
  followers: 5,
  topLanguages: [
    { name: "TypeScript", percentage: 45 },
    { name: "Python", percentage: 30 },
    { name: "JavaScript", percentage: 15 },
  ],
  updatedAt: new Date().toISOString(),
};

export async function getGitHubStats(username = mockGitHubStats.username): Promise<GitHub> {
  if (!serverEnv.GITHUB_TOKEN || username.startsWith("TODO")) {
    return mockGitHubStats;
  }

  try {
    const headers = {
      Authorization: `Bearer ${serverEnv.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    };

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return mockGitHubStats;
    }

    const user = (await userRes.json()) as {
      login: string;
      public_repos: number;
      followers: number;
    };
    const repos = (await reposRes.json()) as Array<{ stargazers_count: number; language: string | null }>;

    const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] ?? 0) + 1;
      }
      return acc;
    }, {});

    const total = Object.values(languageCounts).reduce((acc, count) => acc + count, 0);
    const topLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }));

    return {
      username: user.login,
      repos: user.public_repos,
      stars,
      followers: user.followers,
      topLanguages,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return mockGitHubStats;
  }
}
