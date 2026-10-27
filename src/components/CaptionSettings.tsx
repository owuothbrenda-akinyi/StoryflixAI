import React from 'react';
import { Type, Sparkles, MoveVertical, Sliders, Smile } from 'lucide-react';
import { CaptionPreset, Project } from '../types/studio';

interface CaptionSettingsProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
}

const CAPTION_PRESETS: {
  id: CaptionPreset;
  name: string;
  creatorTag: string;
  previewBg: string;
  previewTextColor: string;
  previewBorderColor: string;
}[] = [
  {
    id: 'hormozi_yellow',
    name: 'Hormozi Viral Yellow',
    creatorTag: 'Top Choice for Retention',
    previewBg: 'bg-zinc-950',
    previewTextColor: 'text-yellow-300',
    previewBorderColor: 'border-yellow-400'
  },
  {
    id: 'neon_beast',
    name: 'MrBeast Neon Cyan/Pink',
    creatorTag: 'High-Energy Dopamine',
    previewBg: 'bg-zinc-950',
    previewTextColor: 'text-cyan-400',
    previewBorderColor: 'border-pink-500'
  },
  {
    id: 'cartoon_comic',
    name: 'Cartoon Comic Pop',
    creatorTag: 'Whimsical & Fun',
    previewBg: 'bg-zinc-950',
    previewTextColor: 'text-amber-400',
    previewBorderColor: 'border-amber-400'
  },
  {
    id: 'minimal_glass',
    name: 'Minimal Glass Clean',
    creatorTag: 'Aesthetic / Luxury',
    previewBg: 'bg-zinc-900',
    previewTextColor: 'text-white',
    previewBorderColor: 'border-zinc-700'
  },
  {
    id: 'danger_red',
    name: 'Red Danger & Shock',
    creatorTag: 'Mystery / Conspiracy',
    previewBg: 'bg-zinc-950',
    previewTextColor: 'text-rose-500',
    previewBorderColor: 'border-rose-500'
  },
  {
    id: 'cyber_violet',
    name: 'Cyberpunk Violet',
    creatorTag: 'Sci-Fi & Gaming',
    previewBg: 'bg-zinc-950',
    previewTextColor: 'text-fuchsia-400',
    previewBorderColor: 'border-blue-500'
  }
];

export const CaptionSettings: React.FC<CaptionSettingsProps> = ({
  project,
  onUpdateProject
}) => {
  return (
    <div className="flex flex-col gap-4 text-zinc-100 p-1">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-rose-500" />
          <h3 className="font-bold text-sm text-white">Viral Dynamic Subtitles & Captions</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          Word-by-Word
        </span>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Subtitle Visual Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CAPTION_PRESETS.map((preset) => {
            const isSelected = project.captionPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onUpdateProject({ captionPreset: preset.id })}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-rose-500 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/50'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{preset.name}</span>
                </div>
                <div className="text-[10px] text-zinc-400">{preset.creatorTag}</div>

                {/* Subtitle Mini Live Preview Badge */}
                <div className={`mt-1 py-1 px-2 rounded-lg ${preset.previewBg} border border-zinc-800 text-center font-black text-xs ${preset.previewTextColor} tracking-wide`}>
                  VIRAL POP 🚀
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders: Vertical Y Position & Font Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5">
        {/* Vertical Position */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <MoveVertical className="w-3.5 h-3.5 text-blue-400" />
              Vertical Height (Y%)
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {project.captionYPercent}%
            </span>
          </div>
          <input
            type="range"
            min={45}
            max={85}
            step={1}
            value={project.captionYPercent}
            onChange={(e) => onUpdateProject({ captionYPercent: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-[10px] text-zinc-500">
            Recommended: 65% - 72% to clear TikTok comment & share buttons
          </span>
        </div>

        {/* Font Size */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Font Size
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {project.captionFontSize}px
            </span>
          </div>
          <input
            type="range"
            min={24}
            max={46}
            step={2}
            value={project.captionFontSize}
            onChange={(e) => onUpdateProject({ captionFontSize: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-zinc-500">
            Recommended: 32px - 36px for high mobile readability
          </span>
        </div>
      </div>

      {/* Auto Emoji Toggle */}
      <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Auto-Inject Animated Emojis</div>
            <div className="text-[11px] text-zinc-400">
              Spices up highlighted words with dynamic emotion markers (e.g. 🤯, 🔥, 💀)
            </div>
          </div>
        </div>

        <button
          onClick={() => onUpdateProject({ autoEmojis: !project.autoEmojis })}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
            project.autoEmojis ? 'bg-emerald-500' : 'bg-zinc-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              project.autoEmojis ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
