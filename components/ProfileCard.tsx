import { GithubUser } from "../types/github";
import { MapPin, Users, BookMarked, ExternalLink } from "lucide-react";

interface ProfileCardProps {
  user: GithubUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_40px_rgb(59,130,246,0.08)]">
      {/* Decorative blurred background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/10 to-cyan-400/5 backdrop-blur-3xl z-0"></div>

      <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden border-[6px] border-white/60 mb-5 shadow-lg shadow-blue-500/10 transition-transform duration-500 group-hover:scale-105 group-hover:border-white/80">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="object-cover w-full h-full"
        />
      </div>
      
      <h2 className="relative z-10 text-2xl font-extrabold text-slate-800 tracking-tight">{user.name || user.login}</h2>
      
      <a 
        href={`https://github.com/${user.login}`} 
        target="_blank" 
        rel="noreferrer"
        className="relative z-10 flex items-center gap-1.5 text-blue-500 hover:text-blue-600 mb-6 font-semibold group/link transition-colors"
      >
        @{user.login}
        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-all" />
      </a>
      
      {user.bio && (
        <p className="relative z-10 text-slate-600 mb-8 max-w-sm text-sm font-medium leading-relaxed">{user.bio}</p>
      )}

      <div className="relative z-10 w-full grid grid-cols-2 gap-4 text-sm mt-auto">
        <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-center text-slate-500 mb-1.5">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-semibold text-xs tracking-wider uppercase">Followers</span>
          </div>
          <span className="text-xl font-bold text-slate-800">{user.followers}</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-center text-slate-500 mb-1.5">
            <BookMarked className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-semibold text-xs tracking-wider uppercase">Repos</span>
          </div>
          <span className="text-xl font-bold text-slate-800">{user.public_repos}</span>
        </div>
      </div>

      {user.location && (
        <div className="relative z-10 mt-6 flex items-center text-sm font-medium text-slate-500 bg-white/40 px-4 py-2 rounded-full border border-white/50 shadow-sm">
          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
          <span>{user.location}</span>
        </div>
      )}
    </div>
  );
}
