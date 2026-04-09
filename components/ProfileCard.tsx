import Image from "next/image";
import { GithubUser } from "../types/github";
import {
  MapPin,
  Users,
  BookMarked,
  ExternalLink,
  Calendar,
  UserCheck,
} from "lucide-react";

interface ProfileCardProps {
  user: GithubUser;
}

function formatJoinDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_40px_rgb(59,130,246,0.08)]">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/10 to-cyan-400/5 dark:from-blue-500/5 dark:to-cyan-400/5 backdrop-blur-3xl z-0" />

      <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden border-[6px] border-white/60 dark:border-slate-700/60 mb-5 shadow-lg shadow-blue-500/10 transition-transform duration-500 group-hover:scale-105 group-hover:border-white/80 dark:group-hover:border-slate-600/80">
        <Image
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      <h2 className="relative z-10 text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
        {user.name || user.login}
      </h2>

      <a
        href={user.html_url}
        target="_blank"
        rel="noreferrer"
        className="relative z-10 flex items-center gap-1.5 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 mb-4 font-semibold group/link transition-colors"
      >
        @{user.login}
        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-all" />
      </a>

      {user.bio && (
        <p className="relative z-10 text-slate-600 dark:text-slate-300 mb-6 max-w-sm text-sm font-medium leading-relaxed">
          {user.bio}
        </p>
      )}

      <div className="relative z-10 w-full grid grid-cols-3 gap-3 text-sm mt-auto">
        {[
          { icon: Users, label: "Followers", value: user.followers },
          { icon: UserCheck, label: "Following", value: user.following },
          { icon: BookMarked, label: "Repos", value: user.public_repos },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-700/40 shadow-sm transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="flex items-center text-slate-500 mb-1.5">
              <Icon className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              <span className="font-semibold text-[10px] tracking-wider uppercase dark:text-slate-400">
                {label}
              </span>
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-3">
        {user.location && (
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 px-4 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            <span>{user.location}</span>
          </div>
        )}
        {user.created_at && (
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 px-4 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            <span>Joined {formatJoinDate(user.created_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
