"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import Image from "next/image";
import { Search, Loader2, Clock } from "lucide-react";
import { searchUsers } from "../lib/github";
import { GithubSearchUser } from "../types/github";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export interface SearchBarHandle {
  focus: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const STORAGE_KEY = "recent_searches";
const MAX_RECENT = 5;

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  function SearchBar({ onSearch, isLoading }, ref) {
    const [input, setInput] = useState("");
    const debouncedInput = useDebounce(input, 1500);

    const [suggestions, setSuggestions] = useState<GithubSearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
        inputRef.current?.select();
      },
    }));

    useEffect(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }, []);

    const saveRecentSearch = useCallback((username: string) => {
      setRecentSearches((prev) => {
        const updated = [username, ...prev.filter((s) => s !== username)].slice(
          0,
          MAX_RECENT
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          /* ignore */
        }
        return updated;
      });
    }, []);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const getSuggestions = async () => {
        if (!debouncedInput) {
          setSuggestions([]);
          return;
        }
        setIsSearching(true);
        const results = await searchUsers(debouncedInput);
        setSuggestions(results);
        setIsSearching(false);
      };
      getSuggestions();
    }, [debouncedInput]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed) {
        setShowDropdown(false);
        saveRecentSearch(trimmed);
        onSearch(trimmed);
      }
    };

    const handleSelectUser = (username: string) => {
      setInput(username);
      setShowDropdown(false);
      saveRecentSearch(username);
      onSearch(username);
    };

    const isTyping = input !== debouncedInput && input.length > 0;
    const showRecent = !input.trim() && recentSearches.length > 0;
    const showSuggestions = !!input.trim();

    return (
      <div ref={wrapperRef} className="w-full max-w-2xl mx-auto relative z-50">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-100 to-blue-50 opacity-20 blur-lg transition duration-500 group-hover:opacity-40" />
          <div className="relative flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)] focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-100 dark:focus-within:border-blue-700">
            <Search className="absolute left-5 text-blue-500 w-5 h-5 transition-transform group-focus-within:scale-110" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Explore developers by username... (press / to focus)"
              className="w-full pl-14 pr-32 py-4 rounded-[2rem] bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 text-gray-800 dark:text-slate-100 text-lg font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 px-6 py-2.5 bg-gradient-to-r gap-2 flex items-center from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 text-white rounded-full text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (showRecent || showSuggestions) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-3 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-[0_20px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.3)] rounded-[1.5rem] overflow-hidden z-50"
            >
              {/* Recent Searches */}
              {showRecent && (
                <>
                  <div className="px-6 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Recent
                  </div>
                  <ul className="flex flex-col pb-2">
                    {recentSearches.map((username) => (
                      <li key={username}>
                        <button
                          onClick={() => handleSelectUser(username)}
                          className="w-full flex items-center gap-4 px-6 py-3 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-slate-200">
                            {username}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Suggestions when typing */}
              {showSuggestions && (
                <>
                  {isTyping ? (
                    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                      <div className="flex gap-1.5 mb-3">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                            className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="font-medium text-sm text-center italic text-slate-400 dark:text-slate-500">
                        Finish typing so I can do the actual searching.
                      </span>
                    </div>
                  ) : isSearching ? (
                    <div className="flex items-center justify-center p-6 text-blue-500">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span className="font-medium text-sm">
                        Searching the vast octoverse...
                      </span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul className="max-h-80 overflow-y-auto w-full flex flex-col py-2">
                      {suggestions.map((user) => (
                        <li key={user.id}>
                          <button
                            onClick={() => handleSelectUser(user.login)}
                            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors text-left"
                          >
                            <Image
                              src={user.avatar_url}
                              alt={user.login}
                              width={40}
                              height={40}
                              className="rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 dark:text-slate-200">
                                {user.login}
                              </span>
                              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                                View Profile
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : debouncedInput ? (
                    <div className="p-6 text-center text-gray-500 dark:text-slate-400 font-medium">
                      No matching users found for &ldquo;{debouncedInput}&rdquo;.
                    </div>
                  ) : null}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
