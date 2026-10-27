import React from 'react';
import { Video, Sparkles, Download, Layers, Wand2, PlayCircle, Palette, Flame } from 'lucide-react';
import { Project, VideoFormat } from '../types/studio';
import { PRESET_PROJECTS } from '../data/presetTemplates';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  project: Project;
  onSelectPreset: (preset: Project) => void;
  onOpenGenerator: () => void;
  onOpenExport: () => void;
  onOpenHookOptimizer: () => void;
  onChangeFormat: (format: VideoFormat) => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onSelectPreset,
  onOpenGenerator,
  onOpenExport,
  onOpenHookOptimizer,
  onChangeFormat
}) => {
  return (
    <header className="min-h-[70px] py-2 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex flex-col items-center justify-center text-center group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/25 mb-0.5 group-hover:scale-105 transition-transform">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs sm:text-sm tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              storyflix<span className="text-rose-500">AI</span>
            </span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Studio
            </span>
          </div>
        </div>

        {/* Studio Mode Switcher */}
        <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => onChangeFormat('viral_facts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              project.format !== 'cartoon_story'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Viral Shorts & Reels
          </button>
          <button
            onClick={() => onChangeFormat('cartoon_story')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              project.format === 'cartoon_story'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Cartoon Story Creator
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Preset Templates Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Templates</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
              Load Viral Presets
            </div>
            {PRESET_PROJECTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-zinc-800 flex items-center justify-between text-zinc-200 transition-colors"
              >
                <div>
                  <div className="font-semibold text-white truncate max-w-[170px]">{preset.title}</div>
                  <div className="text-[10px] text-zinc-400 capitalize">{preset.format.replace('_', ' ')}</div>
                </div>
                <PlayCircle className="w-4 h-4 text-rose-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Hook AI Optimizer */}
        <button
          onClick={onOpenHookOptimizer}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          title="Optimize 3-Second Viral Hook"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Optimize Hook</span>
        </button>

        {/* PWA Install / Add to Home Screen Button */}
        <PWAInstallButton />

        {/* Generate Video Modal Trigger */}
        <button
          onClick={onOpenGenerator}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-md shadow-violet-600/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Generate Video</span>
        </button>

        {/* Export Video Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-md shadow-rose-500/25 hover:brightness-110 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 9:16 Video</span>
        </button>
      </div>
    </header>
  );
};
