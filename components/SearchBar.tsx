"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchUsers } from "../lib/github";
import { GithubSearchUser } from "../types/github";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 1500);
  
  const [suggestions, setSuggestions] = useState<GithubSearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when debounced input changes
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
    if (input.trim()) {
      setShowDropdown(false);
      onSearch(input.trim());
    }
  };

  const handleSelectUser = (username: string) => {
    setInput(username);
    setShowDropdown(false);
    onSearch(username);
  };

  const isTyping = input !== debouncedInput && input.length > 0;

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto relative z-50">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-100 to-blue-50 opacity-20 blur-lg transition duration-500 group-hover:opacity-40"></div>
        <div className="relative flex items-center bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)] focus-within:bg-white focus-within:border-blue-100">
          <Search className="absolute left-5 text-blue-500 w-5 h-5 transition-transform group-focus-within:scale-110" />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (input.trim()) setShowDropdown(true);
            }}
            placeholder="Explore developers by username..."
            className="w-full pl-14 pr-32 py-4 rounded-[2rem] bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-800 text-lg font-medium"
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

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showDropdown && input.trim() && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_rgb(0,0,0,0.06)] rounded-[1.5rem] overflow-hidden z-50"
          >
            {isTyping ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                <div className="flex gap-1.5 mb-3">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                </div>
                <span className="font-medium text-sm text-center italic text-slate-400">
                  You seem deep in thought... Finish typing so I can do the actual searching.
                </span>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center p-6 text-blue-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="font-medium text-sm">Searching the vast octoverse...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto w-full flex flex-col py-2">
                {suggestions.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => handleSelectUser(user.login)}
                      className="w-full flex items-center gap-4 px-6 py-3 hover:bg-blue-50/60 transition-colors text-left"
                    >
                      <img 
                        src={user.avatar_url} 
                        alt={user.login} 
                        className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{user.login}</span>
                        <span className="text-xs font-medium text-gray-500">View Profile</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : debouncedInput ? (
              <div className="p-6 text-center text-gray-500 font-medium">
                No matching users found for "{debouncedInput}".
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
