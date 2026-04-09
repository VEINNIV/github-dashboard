"use client";

import { GithubRepo } from "../types/github";
import { Star, GitFork, Zap, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBarProps {
  repos: GithubRepo[];
}

export function StatsBar({ repos }: StatsBarProps) {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const activeRepos = repos.filter((r) => new Date(r.updated_at) > sixMonthsAgo).length;

  const langCounts = repos.reduce(
    (acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topLang = Object.entries(langCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";

  const stats = [
    { icon: Star, label: "Total Stars", value: totalStars.toLocaleString(), color: "text-amber-500" },
    { icon: GitFork, label: "Total Forks", value: totalForks.toLocaleString(), color: "text-blue-500" },
    { icon: Zap, label: "Active Repos", value: String(activeRepos), color: "text-emerald-500" },
    { icon: Code2, label: "Top Language", value: topLang, color: "text-violet-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
          className="glass-panel rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgb(59,130,246,0.08)]"
        >
          <Icon className={`w-5 h-5 ${color} mb-2`} />
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
