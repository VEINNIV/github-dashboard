export function SkeletonProfileCard() {
  return (
    <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center overflow-hidden">
      <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 mb-5 animate-pulse" />
      <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded-full mb-2 animate-pulse" />
      <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 animate-pulse" />
      <div className="w-full grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[72px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <div className="mt-5 h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
    </div>
  );
}

export function SkeletonRepoCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[1.5rem] border border-white/60 dark:border-slate-700/50 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between mb-3">
        <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded mb-2" />
      <div className="h-3.5 w-3/5 bg-slate-100 dark:bg-slate-800 rounded mb-8" />
      <div className="flex gap-4">
        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
        <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
}

export function SkeletonLanguageChart() {
  return (
    <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center min-h-[340px] animate-pulse">
      <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded-full mb-8" />
      <div className="w-44 h-44 rounded-full border-[22px] border-slate-200 dark:border-slate-700 mb-8" />
      <div className="flex gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-4 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonStatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-panel rounded-2xl p-4 flex flex-col items-center animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 mb-2" />
          <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
          <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonReposPanel() {
  return (
    <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="h-7 w-44 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonRepoCard key={i} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}
