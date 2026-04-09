import { GithubUser, GithubRepo, GithubSearchUser } from "../types/github";

const API_BASE = "https://api.github.com";

const fetchWithErrorHandling = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("User not found. Double-check the username and try again.");
    }
    if (res.status === 403) {
      throw new Error(
        "GitHub API rate limit exceeded. Please wait a minute and try again."
      );
    }
    throw new Error(`Failed to fetch data (HTTP ${res.status}).`);
  }
  return res.json();
};

export const fetchUser = async (username: string): Promise<GithubUser> => {
  return fetchWithErrorHandling(`${API_BASE}/users/${username}`);
};

export const fetchRepos = async (username: string): Promise<GithubRepo[]> => {
  return fetchWithErrorHandling(
    `${API_BASE}/users/${username}/repos?per_page=100&sort=updated`
  );
};

/**
 * Searches users for the live autocomplete dropdown.
 * Gracefully returns an empty list on any failure (e.g. rate-limit).
 */
export const searchUsers = async (
  query: string
): Promise<GithubSearchUser[]> => {
  if (!query) return [];
  try {
    const res = await fetch(
      `${API_BASE}/search/users?q=${encodeURIComponent(query)}&per_page=5`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
};
