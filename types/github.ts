export interface GithubUser {
  login: string;
  avatar_url: string;
  name: string;
  location: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
}

export interface GithubSearchUser {
  id: number;
  login: string;
  avatar_url: string;
}
