"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const applyTheme = useCallback((dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    if (isAnimating) return;
    const next = !isDark;
    const btn = btnRef.current;
    if (!btn) {
      applyTheme(next);
      setIsDark(next);
      return;
    }

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    /* ---- View Transition API (modern browsers) ---- */
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (typeof doc.startViewTransition === "function") {
      document.documentElement.style.setProperty("--vt-x", `${cx}px`);
      document.documentElement.style.setProperty("--vt-y", `${cy}px`);

      const transition = doc.startViewTransition!(() => {
        applyTheme(next);
      });

      transition.ready.then(() => {
        const maxRadius = Math.hypot(
          Math.max(cx, window.innerWidth - cx),
          Math.max(cy, window.innerHeight - cy)
        );
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });

      setIsDark(next);
      return;
    }

    /* ---- Fallback: multi-layer overlay reveal ---- */
    setIsAnimating(true);
    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const glow = document.createElement("div");
    glow.style.cssText = `
      position:fixed;inset:0;z-index:9998;pointer-events:none;
      background:radial-gradient(circle at ${cx}px ${cy}px, 
        ${next ? "rgba(59,130,246,0.3)" : "rgba(250,204,21,0.25)"} 0%,
        transparent 60%);
      opacity:0;
    `;
    document.body.appendChild(glow);
    glow.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
      duration: 700,
      easing: "ease-out",
    }).onfinish = () => glow.remove();

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      background:${next ? "#0f172a" : "#fafafa"};
      clip-path:circle(0px at ${cx}px ${cy}px);
    `;
    document.body.appendChild(overlay);

    const anim = overlay.animate(
      [
        { clipPath: `circle(0px at ${cx}px ${cy}px)` },
        { clipPath: `circle(${maxRadius}px at ${cx}px ${cy}px)` },
      ],
      { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
    );

    anim.onfinish = () => {
      applyTheme(next);
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        easing: "ease-out",
      }).onfinish = () => {
        overlay.remove();
        setIsAnimating(false);
      };
    };

    setIsDark(next);
  }, [isDark, isAnimating, applyTheme]);

  if (!mounted) return null;

  return (
    <motion.button
      ref={btnRef}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full glass-panel flex items-center justify-center shadow-lg transition-colors group"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -120, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 120, scale: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            className="text-slate-300 group-hover:text-blue-400 transition-colors"
          >
            <Moon className="w-[18px] h-[18px]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 120, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -120, scale: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            className="text-slate-600 group-hover:text-amber-500 transition-colors"
          >
            <Sun className="w-[18px] h-[18px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
