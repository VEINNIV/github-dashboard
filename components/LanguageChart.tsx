"use client";

import { GithubRepo } from "../types/github";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageChartProps {
  repos: GithubRepo[];
}

export function LanguageChart({ repos }: LanguageChartProps) {
  // Calculate language frequencies
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const languages = Object.keys(languageCounts);
  
  if (languages.length === 0) {
    return (
      <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Language Breakdown</h3>
        <p className="text-slate-500 font-medium text-sm">Not enough data to analyze languages.</p>
      </div>
    );
  }

  // Sort by count descending and take top 5
  const sortedLanguages = languages
    .sort((a, b) => languageCounts[b] - languageCounts[a])
    .slice(0, 5);

  const dataValues = sortedLanguages.map((lang) => languageCounts[lang]);

  // Chart data configuration matching the premium aesthetic
  const data = {
    labels: sortedLanguages,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "rgba(59, 130, 246, 0.9)", // blue-500
          "rgba(14, 165, 233, 0.9)", // sky-500
          "rgba(16, 185, 129, 0.9)", // emerald-500
          "rgba(139, 92, 246, 0.9)", // violet-500
          "rgba(99, 102, 241, 0.9)", // indigo-500
        ],
        borderColor: "rgba(255,255,255,0.8)",
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
          font: {
            size: 13,
            family: "inherit",
            weight: 600 as const,
          },
          color: "#475569" // slate-600
        }
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#334155",
        bodyFont: {
          weight: "bold" as const,
        },
        padding: 12,
        borderColor: "rgba(0,0,0,0.05)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 4,
      }
    },
    cutout: "72%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center min-h-[340px] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(59,130,246,0.08)] transition-all duration-300">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-100/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <h3 className="relative z-10 text-xl font-bold tracking-tight text-slate-800 mb-8 w-full text-center">
        Language Breakdown
      </h3>
      <div className="font-sans relative z-10 w-full h-52 flex justify-center drop-shadow-sm">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
