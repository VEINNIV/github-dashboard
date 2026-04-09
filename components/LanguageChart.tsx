"use client";

import { useEffect, useState } from "react";
import { GithubRepo } from "../types/github";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageChartProps {
  repos: GithubRepo[];
}

export function LanguageChart({ repos }: LanguageChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const languageCounts = repos.reduce(
    (acc, repo) => {
      if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const languages = Object.keys(languageCounts);

  if (languages.length === 0) {
    return (
      <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Language Breakdown
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          Not enough data to analyze languages.
        </p>
      </div>
    );
  }

  const sortedLanguages = languages
    .sort((a, b) => languageCounts[b] - languageCounts[a])
    .slice(0, 5);

  const dataValues = sortedLanguages.map((lang) => languageCounts[lang]);

  const legendColor = isDark ? "#94a3b8" : "#475569";
  const tooltipBg = isDark ? "rgba(15,23,42,0.92)" : "rgba(255,255,255,0.9)";
  const tooltipTitle = isDark ? "#f1f5f9" : "#1e293b";
  const tooltipBody = isDark ? "#e2e8f0" : "#334155";

  const data = {
    labels: sortedLanguages,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "rgba(59, 130, 246, 0.85)",
          "rgba(14, 165, 233, 0.85)",
          "rgba(16, 185, 129, 0.85)",
          "rgba(139, 92, 246, 0.85)",
          "rgba(244, 63, 94, 0.85)",
        ],
        borderColor: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.8)",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 24,
          font: { size: 13, family: "inherit", weight: 600 as const },
          color: legendColor,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        bodyFont: { weight: "bold" as const },
        padding: 12,
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 4,
      },
    },
    cutout: "72%",
    animation: { animateScale: true, animateRotate: true, duration: 1200 },
  };

  return (
    <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center min-h-[340px] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(59,130,246,0.08)] transition-all duration-300">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-100/40 dark:bg-cyan-900/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

      <h3 className="relative z-10 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-8 w-full text-center">
        Language Breakdown
      </h3>
      <div className="font-sans relative z-10 w-full h-52 flex justify-center drop-shadow-sm">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
