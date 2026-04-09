"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  X,
  Loader2,
  Target,
  Crosshair,
  Rocket,
  Trash2,
  Star,
  Award,
  Coffee,
  Sparkles,
} from "lucide-react";

interface EasterEggMenuProps {
  onEquipWeapon: () => void;
  isWeaponActive: boolean;
  isVisible: boolean;
}

interface ConsoleLine {
  id: number;
  text: string;
  type: "cmd" | "ok" | "err" | "info";
}

export function EasterEggMenu({
  onEquipWeapon,
  isWeaponActive,
  isVisible,
}: EasterEggMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [konami, setKonami] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setKonami((prev) => {
        const next = [...prev, e.key].slice(-konamiCode.length);
        if (next.join(",") === konamiCode.join(",")) {
          pushLine("$ sudo unlock-everything", "cmd");
          setTimeout(
            () =>
              pushLine(
                "ACCESS GRANTED. You are now a 10x developer. (Nothing has changed.)",
                "ok"
              ),
            1200
          );
          if (!isOpen) setIsOpen(true);
        }
        return next;
      });
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [consoleLines]);

  const pushLine = useCallback(
    (text: string, type: ConsoleLine["type"] = "info") => {
      setConsoleLines((prev) => [
        ...prev.slice(-12),
        { id: Date.now() + Math.random(), text, type },
      ]);
    },
    []
  );

  const runFakeCommand = (
    cmd: string,
    steps: { text: string; type: ConsoleLine["type"]; delay: number }[]
  ) => {
    if (activeTask) return;
    setActiveTask(cmd);
    pushLine(`$ ${cmd}`, "cmd");

    let totalDelay = 0;
    steps.forEach(({ text, type, delay }) => {
      totalDelay += delay;
      setTimeout(() => pushLine(text, type), totalDelay);
    });
    setTimeout(() => setActiveTask(null), totalDelay + 100);
  };

  const commands = [
    {
      label: "Deploy to Prod",
      icon: Rocket,
      color: "text-rose-500",
      lightBg: "bg-rose-50 hover:bg-rose-100",
      darkBg: "dark:bg-rose-950/40 dark:hover:bg-rose-900/40",
      run: () =>
        runFakeCommand("git push origin main --force --yolo", [
          { text: "Compiling 42,069 modules...", type: "info", delay: 800 },
          { text: "Running tests... 0 found. Skipping.", type: "info", delay: 1200 },
          { text: "FATAL: It's Friday. Pipeline blocked by common sense.", type: "err", delay: 1000 },
        ]),
    },
    {
      label: "Add 10K Stars",
      icon: Star,
      color: "text-amber-500",
      lightBg: "bg-amber-50 hover:bg-amber-100",
      darkBg: "dark:bg-amber-950/40 dark:hover:bg-amber-900/40",
      run: () =>
        runFakeCommand("gh api /repos/stars --method POST --count 10000", [
          { text: "Authenticating with GitHub...", type: "info", delay: 700 },
          { text: "Sending 10,000 star requests...", type: "info", delay: 1500 },
          { text: "429 Too Many Requests — GitHub is onto you.", type: "err", delay: 1000 },
        ]),
    },
    {
      label: "rm -rf /",
      icon: Trash2,
      color: "text-red-500 dark:text-red-400",
      lightBg: "bg-red-50 hover:bg-red-100",
      darkBg: "dark:bg-red-950/40 dark:hover:bg-red-900/40",
      run: () =>
        runFakeCommand("sudo rm -rf / --no-preserve-root", [
          { text: "Removing /usr/bin...", type: "info", delay: 600 },
          { text: "Removing /etc/passwd...", type: "info", delay: 800 },
          { text: "Permission Denied. The kernel has trust issues.", type: "err", delay: 1000 },
          { text: "Also, your sysadmin has been notified.", type: "info", delay: 600 },
        ]),
    },
    {
      label: "10x Certificate",
      icon: Award,
      color: "text-violet-500",
      lightBg: "bg-violet-50 hover:bg-violet-100",
      darkBg: "dark:bg-violet-950/40 dark:hover:bg-violet-900/40",
      run: () =>
        runFakeCommand("generate-cert --type=10x-developer --format=pdf", [
          { text: "Analyzing commit history...", type: "info", delay: 800 },
          { text: "Measuring Stack Overflow dependency...", type: "info", delay: 1200 },
          { text: "Certificate generated! Validity: until your next npm install.", type: "ok", delay: 1000 },
        ]),
    },
    {
      label: "Brew Coffee",
      icon: Coffee,
      color: "text-amber-700 dark:text-amber-400",
      lightBg: "bg-amber-50 hover:bg-amber-100",
      darkBg: "dark:bg-amber-950/40 dark:hover:bg-amber-900/40",
      run: () =>
        runFakeCommand("brew install --cask real-coffee", [
          { text: "Tapping homebrew/physical-world...", type: "info", delay: 700 },
          { text: "Downloading beans... 100% (arabica-v2.4.1)", type: "info", delay: 1200 },
          { text: "Error: Hardware device 'coffee-maker' not found. Try drinking water.", type: "err", delay: 1000 },
        ]),
    },
  ];

  const handleTriggerClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount >= 2) {
      setIsOpen(true);
      setClickCount(0);
    }
  };

  const lineColor = (type: ConsoleLine["type"]) => {
    switch (type) {
      case "cmd":
        return "text-emerald-600 dark:text-emerald-400 font-semibold";
      case "ok":
        return "text-emerald-500 dark:text-emerald-300";
      case "err":
        return "text-rose-500 dark:text-rose-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger — subtle terminal icon, 3 clicks to open */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleTriggerClick}
              className="group w-11 h-11 rounded-xl bg-slate-800/80 dark:bg-white/10 backdrop-blur-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors relative"
              title={
                clickCount === 0
                  ? "..."
                  : clickCount === 1
                    ? "Are you sure?"
                    : "Last chance..."
              }
            >
              <Terminal className="w-4 h-4" />
              {clickCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                >
                  {clickCount}
                </motion.div>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Console Panel — adapts to light/dark */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-0 right-0 w-[340px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-black/10 dark:shadow-black/40"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setClickCount(0);
                    }}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                  />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 ml-2">
                  dev-console
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setClickCount(0);
                }}
                className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Console output */}
            <div
              ref={outputRef}
              className="px-4 py-3 min-h-[100px] max-h-[180px] overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-0.5 bg-slate-50/50 dark:bg-transparent"
            >
              {consoleLines.length === 0 && (
                <span className="text-slate-400 dark:text-slate-600 italic">
                  Type a command below or try the Konami code...
                </span>
              )}
              {consoleLines.map((line) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={lineColor(line.type)}
                >
                  {line.text}
                </motion.div>
              ))}
              {activeTask && (
                <div className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 mt-0.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="animate-pulse">processing...</span>
                </div>
              )}
            </div>

            {/* Command buttons */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex flex-col gap-2 bg-white dark:bg-slate-950">
              <div className="grid grid-cols-3 gap-1.5">
                {commands.map(({ label, icon: Icon, color, lightBg, darkBg, run }) => (
                  <button
                    key={label}
                    onClick={run}
                    disabled={!!activeTask}
                    className={`${lightBg} ${darkBg} flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-wait`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-slate-700 dark:text-slate-300 truncate w-full text-center">
                      {label}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setConsoleLines([])}
                  disabled={!!activeTask}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-40 text-[10px] font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-500 dark:text-slate-400">Clear</span>
                </button>
              </div>

              {/* Weapon toggle */}
              <button
                onClick={onEquipWeapon}
                className={`w-full py-2 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isWeaponActive
                    ? "bg-rose-600 text-white ring-1 ring-rose-400"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {isWeaponActive ? (
                  <Target className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5" />
                )}
                {isWeaponActive ? "Holster Weapon" : "Equip Toy Blaster"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
