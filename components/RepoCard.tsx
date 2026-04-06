import { GithubRepo } from "../types/github";
import { Star, GitBranch, Circle, ArrowUpRight } from "lucide-react";

interface RepoCardProps {
  repo: GithubRepo;
  index?: number;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Swift: "#F05138",
};

export function RepoCard({ repo, index = 0 }: RepoCardProps) {
  const langColor = repo.language ? languageColors[repo.language] || "#8b949e" : "#8b949e";
  // Create a staggered entrance animation delay based on index
  const delay = `${index * 50}ms`;

  return (
    <a 
      href={repo.html_url} 
      target="_blank" 
      rel="noreferrer"
      className="block p-6 bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-sm border border-white/60 hover:bg-white/80 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-1 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: delay, animationFillMode: "both" }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex items-start justify-between mb-3 relative z-10">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 truncate pr-4 transition-colors flex items-center gap-2">
          {repo.name}
          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-blue-500" />
        </h3>
        <div className="flex items-center text-sm font-semibold text-slate-600 bg-white/80 px-2.5 py-1 rounded-full shadow-sm ring-1 ring-black/5 shrink-0">
          <Star className="w-3.5 h-3.5 mr-1.5 text-amber-400 fill-amber-400/20" />
          <span>{repo.stargazers_count}</span>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 h-10 leading-relaxed relative z-10">
        {repo.description || "No description provided for this repository."}
      </p>
      
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto relative z-10">
        <div className="flex flex-wrap items-center gap-4">
          {repo.language && (
            <div className="flex items-center">
              <Circle 
                className="w-3 h-3 mr-1.5 fill-current" 
                style={{ color: langColor }}
              />
              <span className="text-slate-600">{repo.language}</span>
            </div>
          )}
          <div className="flex items-center text-slate-400">
            <GitBranch className="w-3.5 h-3.5 mr-1.5" />
            <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
