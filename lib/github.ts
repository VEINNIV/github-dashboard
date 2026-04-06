import { GithubUser, GithubRepo } from "../types/github";

const API_BASE = "https://api.github.com";

// Helper function to handle fetch errors
const fetchWithErrorHandling = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("User not found");
    }
    if (res.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

/**
 * Fetches user profile data from GitHub
 */
export const fetchUser = async (username: string): Promise<GithubUser> => {
  const url = `${API_BASE}/users/${username}`;
  return fetchWithErrorHandling(url);
};

/**
 * Fetches user repositories from GitHub (max 100, sorted by recently updated)
 */
export const fetchRepos = async (username: string): Promise<GithubRepo[]> => {
  const url = `${API_BASE}/users/${username}/repos?per_page=100&sort=updated`;
  return fetchWithErrorHandling(url);
};

/**
 * Validates and searches users for the live autocomplete dropdown.
 * Gracefully handles errors (e.g. rate limit) by returning an empty list.
 */
export const searchUsers = async (query: string): Promise<any[]> => {
  if (!query) return [];
  const url = `${API_BASE}/search/users?q=${encodeURIComponent(query)}&per_page=5`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Search API failed:", error);
    return [];
  }
};
