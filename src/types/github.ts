export interface GitHubLanguageStat {
  name: string;
  percentage: number;
}

export interface GitHub {
  username: string;
  repos: number;
  stars: number;
  followers: number;
  topLanguages: GitHubLanguageStat[];
  updatedAt: string;
}
