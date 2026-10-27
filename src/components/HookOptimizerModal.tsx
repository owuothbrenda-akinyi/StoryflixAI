import React, { useState } from 'react';
import { Sparkles, X, Flame, Check, ArrowRight, TrendingUp } from 'lucide-react';
import { Project } from '../types/studio';

interface HookOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onApplyHook: (newHook: string) => void;
}

interface HookOption {
  text: string;
  angle: string;
  predictedScore: number;
}

export const HookOptimizerModal: React.FC<HookOptimizerModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyHook
}) => {
  const [currentHook, setCurrentHook] = useState(project.viralHook || project.title);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hookOptions, setHookOptions] = useState<HookOption[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/enhance-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentHook })
      });

      if (!response.ok) {
        throw new Error('Failed to optimize hook.');
      }

      const data = await response.json();
      setHookOptions(data.hooks || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not optimize hook.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">AI 3-Second Viral Hook Optimizer</h2>
              <p className="text-xs text-zinc-400">
                Generate high-retention opening hooks that stop scrolling on TikTok & Reels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Hook Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-300">Current Opening Hook</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentHook}
              onChange={(e) => setCurrentHook(e.target.value)}
              placeholder="e.g. The 3rd trick feels almost illegal..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !currentHook.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isOptimizing ? 'Optimizing...' : 'Generate 5 Hooks'}</span>
            </button>
          </div>
        </div>

        {/* Generated Hooks List */}
        {hookOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              High-Retention Hook Variations
            </span>
            <div className="flex flex-col gap-2">
              {hookOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 rounded-2xl flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {opt.angle}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {opt.predictedScore}/100 Retention Score
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">"{opt.text}"</div>
                  </div>

                  <button
                    onClick={() => {
                      onApplyHook(opt.text);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-xs font-bold text-zinc-200 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
