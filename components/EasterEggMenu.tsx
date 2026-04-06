"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Skull, Crosshair, X, Loader2, Target, Code, Award } from "lucide-react";

interface EasterEggMenuProps {
  onEquipWeapon: () => void;
  isWeaponActive: boolean;
  isVisible: boolean;
}

export function EasterEggMenu({ onEquipWeapon, isWeaponActive, isVisible }: EasterEggMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [evadeCount, setEvadeCount] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Fake interactive states
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: "error" | "success" } | null>(null);

  const maxEvades = 5;

  const handleHover = () => {
    if (evadeCount < maxEvades && !isOpen) {
      // Randomly jump away
      const randomX = (Math.random() - 0.5) * 200 - 100; 
      const randomY = (Math.random() - 0.5) * 200 - 100;
      setOffset({ x: randomX, y: randomY });
      setEvadeCount((prev) => prev + 1);
    }
  };

  const handleFakeAction = (taskName: string, duration: number, finalMessage: string, msgType: "error" | "success" = "error") => {
    setActiveTask(taskName);
    setMessage(null);
    setTimeout(() => {
      setMessage({ text: finalMessage, type: msgType });
      setActiveTask(null);
    }, duration);
  };

  return (
    <div className="fixed bottom-14 right-14 z-50">
      
      {/* Floating Menu Toggle - Slightly more visible now */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: offset.x, y: offset.y }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ x: offset.x, y: offset.y }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            onMouseEnter={handleHover}
            className="absolute"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 bg-white/70 backdrop-blur-xl border-2 border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white transition-colors"
              title="Classified Options"
            >
              <Menu className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Sidebar / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30, x: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30, x: 30 }}
            className="absolute bottom-0 right-0 w-80 glass-panel rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border-white/80"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Skull className="w-4 h-4 text-rose-500" /> HR Chaos Panel
              </h3>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setMessage(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition shadow-sm bg-white/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Account Actions */}
              <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl flex flex-col gap-3">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Database Overrides</p>
                
                {message ? (
                  <div className={`text-xs font-semibold p-3 rounded-xl border ${
                    message.type === "error" 
                      ? "text-rose-500 bg-rose-50 border-rose-100" 
                      : "text-emerald-500 bg-emerald-50 border-emerald-100"
                  }`}>
                    {message.text}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleFakeAction(
                        "deleting", 
                        2500, 
                        "Permission Denied: System has dynamically blocked attempt to delete Linus Torvalds' legacy."
                      )}
                      disabled={!!activeTask}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {activeTask === "deleting" ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Contacting MS Legal...</> : "Delete GitHub Account"}
                    </button>

                    <button
                      onClick={() => handleFakeAction(
                        "cobol", 
                        3000, 
                        "Success: Mainframe compilation engaged. Good luck maintaining this.",
                        "success"
                      )}
                      disabled={!!activeTask}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {activeTask === "cobol" ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Transpiling to COBOL...</> : <><Code className="w-3.5 h-3.5" /> Convert Repos to COBOL</>}
                    </button>
                    
                    <button
                      onClick={() => handleFakeAction(
                        "seniority", 
                        2000, 
                        "Promotion failed: Developer requires exactly 10x more caffeine intake.",
                        "error"
                      )}
                      disabled={!!activeTask}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {activeTask === "seniority" ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Bypassing Interview...</> : <><Award className="w-3.5 h-3.5" /> Inject "Staff Engineer" Title</>}
                    </button>
                  </div>
                )}
              </div>

              {/* Weapon Option */}
              <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl flex flex-col gap-3">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Stress Relief</p>
                <button
                  onClick={onEquipWeapon}
                  className={`w-full py-2.5 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isWeaponActive 
                      ? "bg-slate-800 text-white ring-2 ring-slate-400 ring-offset-2 ring-offset-white/50" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                  }`}
                >
                  {isWeaponActive ? <Target className="w-4 h-4 animate-pulse text-rose-400" /> : <Crosshair className="w-4 h-4" />}
                  {isWeaponActive ? "Holster Weapon" : "Equip Toy Blaster"}
                </button>
                {isWeaponActive && (
                  <p className="text-xs font-semibold text-slate-500 text-center uppercase tracking-wide mt-1 animate-pulse">
                    ⚠️ UI DAMAGE ENABLED ⚠️
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
