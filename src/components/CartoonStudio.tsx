import React from 'react';
import { Palette, Sparkles, User, Smile, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { CartoonStyle, CharacterPreset, Project } from '../types/studio';
import { CHARACTER_PRESETS } from '../data/presetTemplates';

interface CartoonStudioProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
}

const CARTOON_STYLES: { id: CartoonStyle; name: string; tag: string }[] = [
  { id: 'pixar_3d', name: '3D Pixar & Disney Animation', tag: 'Cute & Whimsical Lighting' },
  { id: 'anime_manga', name: 'Anime & Shonen Legend', tag: 'Dynamic Action Outlines' },
  { id: 'comic_book', name: 'Vintage Comic Pop Art', tag: 'Bold Dots & Halftone Ink' },
  { id: 'cyberpunk_retro', name: 'Cyberpunk Retro 80s', tag: 'Neon Grids & Synthglow' },
  { id: 'chibi_fantasy', name: 'Chibi & Kawaii Mascot', tag: 'Big Eyes, Tiny Body' },
];

export const CartoonStudio: React.FC<CartoonStudioProps> = ({
  project,
  onUpdateProject
}) => {
  const activeCharId = project.characterAvatar || 'sir_reginald';
  const selectedChar = CHARACTER_PRESETS.find((c) => c.id === activeCharId) || CHARACTER_PRESETS[0];

  const handleSelectCharacter = (preset: CharacterPreset) => {
    onUpdateProject({
      characterAvatar: preset.id,
      characterName: preset.name,
      cartoonStyle: preset.style
    });
  };

  return (
    <div className="flex flex-col gap-4 text-zinc-100 p-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-violet-400" />
          <h3 className="font-bold text-sm text-white">Cartoon & Comic Story Creator</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
          Animated Avatars
        </span>
      </div>

      {/* Character Avatars Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
          <span>Lead Cartoon Character</span>
          <span className="text-[10px] text-zinc-500 font-normal">Select animated character avatar</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CHARACTER_PRESETS.map((char) => {
            const isSelected = char.id === activeCharId;
            return (
              <button
                key={char.id}
                onClick={() => handleSelectCharacter(char)}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                {/* SVG Avatar Container */}
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-zinc-900/80 border border-zinc-800 shadow-inner flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: char.avatarSvg }}
                />
                <div>
                  <div className="text-xs font-black text-white">{char.name}</div>
                  <div className="text-[10px] text-zinc-400 capitalize">{char.style.replace('_', ' ')}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Character Profile & Dialogue Settings */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 p-1 border border-zinc-700 shrink-0"
            dangerouslySetInnerHTML={{ __html: selectedChar.avatarSvg }}
          />
          <div className="flex-1">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{selectedChar.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">
                Active Hero
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{selectedChar.tagline}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">Character Name / Title</label>
          <input
            type="text"
            value={project.characterName || selectedChar.name}
            onChange={(e) => onUpdateProject({ characterName: e.target.value })}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Art Style Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Animation & Art Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CARTOON_STYLES.map((style) => {
            const isSelected = project.cartoonStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onUpdateProject({ cartoonStyle: style.id })}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-500 text-white ring-1 ring-violet-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-bold text-white">{style.name}</span>
                <span className="text-[10px] text-zinc-400">{style.tag}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
