"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GithubUser, GithubRepo } from "../types/github";
import { fetchUser, fetchRepos } from "../lib/github";
import { SearchBar, SearchBarHandle } from "../components/SearchBar";
import { ProfileCard } from "../components/ProfileCard";
import { RepoCard } from "../components/RepoCard";
import { LanguageChart } from "../components/LanguageChart";
import { ErrorMessage } from "../components/ErrorMessage";
import { StatsBar } from "../components/StatsBar";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  SkeletonProfileCard,
  SkeletonLanguageChart,
  SkeletonStatsBar,
  SkeletonReposPanel,
} from "../components/SkeletonCard";
import { Fingerprint, Heart, Code2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { EasterEggMenu } from "../components/EasterEggMenu";

interface Hole {
  id: number;
  x: number;
  y: number;
}

type SortOption = "updated" | "stars" | "forks" | "name";

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchBarRef = useRef<SearchBarHandle>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);

  const [isWeaponActive, setIsWeaponActive] = useState(false);
  const [holes, setHoles] = useState<Hole[]>([]);

  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  const handleSearch = useCallback(
    async (username: string) => {
      setIsLoading(true);
      setError(null);
      setUser(null);
      setRepos([]);
      setSelectedLang(null);
      setSortBy("updated");

      router.push(`/?user=${encodeURIComponent(username)}`, { scroll: false });

      try {
        const [userData, reposData] = await Promise.all([
          fetchUser(username),
          fetchRepos(username),
        ]);
        setUser(userData);
        setRepos(reposData);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while fetching data.";
        setError(message);
        router.push("/", { scroll: false });
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  /* On mount: trigger search if ?user= param is present */
  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) {
      handleSearch(userParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keyboard shortcut: press / to focus the search input */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchBarRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isWeaponActive) return;
      const holeId = Date.now() + Math.random();
      setHoles((prev) => [...prev, { id: holeId, x: e.clientX, y: e.clientY }]);
      setTimeout(
        () => setHoles((prev) => prev.filter((h) => h.id !== holeId)),
        5000
      );
    },
    [isWeaponActive]
  );

  /* Filtering & sorting */
  const uniqueLangs = [
    ...new Set(repos.filter((r) => r.language).map((r) => r.language!)),
  ];

  const displayRepos = repos
    .filter((r) => !selectedLang || r.language === selectedLang)
    .sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          return b.forks_count - a.forks_count;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-16 px-4 sm:px-8 font-sans overflow-x-hidden relative ${
        isWeaponActive ? "cursor-crosshair" : ""
      }`}
      onClick={handlePageClick}
    >
      <ThemeToggle />

      <EasterEggMenu
        isWeaponActive={isWeaponActive}
        onEquipWeapon={() => setIsWeaponActive((prev) => !prev)}
        isVisible={!!user}
      />

      {/* Bullet holes */}
      <AnimatePresence>
        {holes.map((hole) => (
          <motion.div
            key={hole.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="fixed z-40 pointer-events-none w-8 h-8 -ml-4 -mt-4 bg-slate-900 rounded-full"
            style={{
              left: hole.x,
              top: hole.y,
              boxShadow:
                "inset 0 4px 6px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,0,0,0.3)",
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-12 h-px bg-slate-900/40 -translate-x-1/2 -translate-y-1/2 rotate-45" />
            <div className="absolute top-1/2 left-1/2 w-10 h-px bg-slate-900/40 -translate-x-1/2 -translate-y-1/2 -rotate-12" />
            <div className="absolute top-1/2 left-1/2 w-8 h-px bg-slate-900/40 -translate-x-1/2 -translate-y-1/2 rotate-[110deg]" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 relative z-10">
        {/* Header & Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center mt-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 p-4 rounded-[2rem] mb-6 shadow-xl shadow-blue-500/30"
          >
            <Fingerprint className="w-10 h-10 text-white" strokeWidth={1.5} />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-4 drop-shadow-sm">
            Developer <span className="text-blue-600">Analytics</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-lg text-lg">
            A premium lens into any developer&apos;s public footprint. Search a
            username to visualize their code, languages, and core projects.
          </p>

          <SearchBar
            ref={searchBarRef}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Skeleton loading — same grid layout as data state */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            <div className="lg:col-span-3">
              <SkeletonStatsBar />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-8">
              <SkeletonProfileCard />
              <SkeletonLanguageChart />
            </div>
            <div className="lg:col-span-2">
              <SkeletonReposPanel />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <ErrorMessage message={error} />
          </motion.div>
        )}

        {/* Data — Bento Grid */}
        {user && !isLoading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full"
          >
            {/* Stats bar — full width */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <StatsBar repos={repos} />
            </motion.div>

            {/* Left column */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <motion.div variants={itemVariants}>
                <ProfileCard user={user} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <LanguageChart repos={repos} />
              </motion.div>
            </div>

            {/* Right column — Repos */}
            <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col">
              <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col relative overflow-hidden group/repopanel transition-all duration-300 hover:shadow-[0_8px_40px_rgb(59,130,246,0.08)]">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl group-hover/repopanel:bg-blue-200/40 dark:group-hover/repopanel:bg-blue-800/30 transition-colors duration-500" />

                {/* Panel header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Recent Projects
                  </h2>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full ring-1 ring-blue-100 dark:ring-blue-800 shadow-sm backdrop-blur-md">
                    {repos.length} Repos
                  </span>
                </div>

                {/* Language filter pills */}
                {uniqueLangs.length > 0 && (
                  <div className="relative z-10 flex flex-wrap items-center gap-2 mb-3">
                    <button
                      onClick={() => setSelectedLang(null)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        selectedLang === null
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                          : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-white/60 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      All
                    </button>
                    {uniqueLangs.slice(0, 7).map((lang) => (
                      <button
                        key={lang}
                        onClick={() =>
                          setSelectedLang(selectedLang === lang ? null : lang)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          selectedLang === lang
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                            : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-white/60 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sort dropdown */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  {selectedLang && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Showing {Math.min(displayRepos.length, 6)} of{" "}
                      {displayRepos.length} {selectedLang} repos
                    </span>
                  )}
                  <div className="relative ml-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="updated">Latest</option>
                      <option value="stars">Most Stars</option>
                      <option value="forks">Most Forks</option>
                      <option value="name">Name A–Z</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Repo grid or empty state */}
                {displayRepos.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-medium relative z-10 flex flex-col items-center gap-2">
                    {selectedLang ? (
                      <>
                        <span>No {selectedLang} repositories found.</span>
                        <button
                          onClick={() => setSelectedLang(null)}
                          className="text-blue-500 dark:text-blue-400 text-sm font-semibold hover:underline"
                        >
                          Show all repos
                        </button>
                      </>
                    ) : (
                      <>
                        <span>No public repositories found.</span>
                        <span className="text-sm italic text-slate-400 dark:text-slate-500">
                          Either they code entirely in private, or they just
                          really like configuring dotfiles.
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                    {displayRepos.slice(0, 6).map((repo, index) => (
                      <RepoCard key={repo.id} repo={repo} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-16 pb-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 font-medium">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>by</span>
          <a
            href="https://github.com/VEINNIV"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            VEINNIV
          </a>
          <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
          <a
            href="https://github.com/VEINNIV/github-dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}
