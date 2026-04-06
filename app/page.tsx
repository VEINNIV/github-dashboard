"use client";

import { useState, useCallback } from "react";
import { GithubUser, GithubRepo } from "../types/github";
import { fetchUser, fetchRepos } from "../lib/github";
import { SearchBar } from "../components/SearchBar";
import { ProfileCard } from "../components/ProfileCard";
import { RepoCard } from "../components/RepoCard";
import { LanguageChart } from "../components/LanguageChart";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EasterEggMenu } from "../components/EasterEggMenu";

interface Hole {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);

  // Easter Egg State
  const [isWeaponActive, setIsWeaponActive] = useState(false);
  const [holes, setHoles] = useState<Hole[]>([]);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const [userData, reposData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
      ]);

      setUser(userData);
      setRepos(reposData);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle global click for weapon rendering
  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isWeaponActive) return;
    
    const holeId = Date.now() + Math.random();
    // Create a new hole at click coordinates
    const newHole = {
      id: holeId,
      x: e.clientX,
      y: e.clientY
    };
    
    setHoles((prev) => [...prev, newHole]);

    // Automatically remove the hole after 5 seconds
    setTimeout(() => {
      setHoles((prev) => prev.filter(h => h.id !== holeId));
    }, 5000);

  }, [isWeaponActive]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center py-16 px-4 sm:px-8 font-sans overflow-x-hidden relative ${isWeaponActive ? 'cursor-[crosshair]' : ''}`}
      onClick={handlePageClick}
    >
      {/* Easter Egg Wrapper & UI */}
      <EasterEggMenu 
        isWeaponActive={isWeaponActive} 
        onEquipWeapon={() => setIsWeaponActive(prev => !prev)} 
        isVisible={!!user}
      />

      {/* Render Bullet Holes */}
      <AnimatePresence>
        {holes.map(hole => (
          <motion.div
            key={hole.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="fixed z-40 pointer-events-none w-8 h-8 -ml-4 -mt-4 bg-slate-900 rounded-full"
            style={{ 
              left: hole.x, 
              top: hole.y,
              boxShadow: "inset 0 4px 6px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,0,0,0.3)"
            }}
          >
            {/* Crack lines for realism */}
            <div className="absolute top-1/2 left-1/2 w-12 h-px bg-slate-900/40 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-10 h-px bg-slate-900/40 -translate-x-1/2 -translate-y-1/2 -rotate-12"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-px bg-slate-900/40 -translate-x-1/2 -translate-y-1/2 rotate-[110deg]"></div>
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
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 drop-shadow-sm">
            Developer <span className="text-blue-600">Analytics</span>
          </h1>
          
          <p className="text-slate-500 font-medium mb-10 max-w-lg text-lg">
            A premium lens into any developer's public footprint. Search a username to visualize their code, languages, and core projects.
          </p>
          
          {/* Prevent clicks on search getting caught as generic background clicks if desired, but actually it's fun to shoot the search bar too */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex justify-center"
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <ErrorMessage message={error} />
          </motion.div>
        )}

        {/* Data Loaded State - Bento Grid Layout */}
        {user && !isLoading && !error && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full"
          >
            
            {/* Left Column: Profile & Languages */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <motion.div variants={itemVariants}>
                <ProfileCard user={user} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <LanguageChart repos={repos} />
              </motion.div>
            </div>

            {/* Right Column: Repositories */}
            <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col">
              <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col relative overflow-hidden group/repopanel transition-all duration-300 hover:shadow-[0_8px_40px_rgb(59,130,246,0.08)]">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl group-hover/repopanel:bg-blue-200/40 transition-colors duration-500"></div>
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800">Recent Projects</h2>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50/50 px-4 py-1.5 rounded-full ring-1 ring-blue-100 shadow-sm backdrop-blur-md">
                    {repos.length} Repos
                  </span>
                </div>
                
                {repos.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium relative z-10 flex flex-col items-center gap-2">
                    <span>No public repositories found.</span>
                    <span className="text-sm italic text-slate-400">Either they code entirely in private, or they just really like configuring dotfiles.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                    {repos.slice(0, 6).map((repo, index) => (
                      <RepoCard key={repo.id} repo={repo} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

          </motion.div>
        )}
        
      </div>
    </div>
  );
}
