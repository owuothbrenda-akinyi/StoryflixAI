import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  Clock,
  Mic,
  Palette,
  Flame,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Video
} from 'lucide-react';
import { CartoonStyle, Project, VideoFormat, VideoTone } from '../types/studio';

interface ScriptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScript: (generatedData: any, chosenFormat: VideoFormat, chosenTone: VideoTone, chosenCartoonStyle: CartoonStyle) => void;
}

const INSPIRATION_IDEAS = [
  { text: '5 psychological tricks that make anyone respect you instantly', format: 'viral_facts', tone: 'dark_mystery' },
  { text: 'A clumsy medieval knight accidentally steps into a modern pizza shop', format: 'cartoon_story', tone: 'funny_cartoon' },
  { text: 'What actually happens to your body if you drink coffee at 3 AM?', format: 'what_if', tone: 'fast_viral' },
  { text: 'Reddit Confession: I found a secret door behind my college dorm closet', format: 'reddit_story', tone: 'dramatic_suspense' },
  { text: 'The ruthless morning routine of a 22-year-old self-made millionaire', format: 'motivation_mindset', tone: 'motivational' },
  { text: 'Why passenger planes are strictly prohibited from flying over Antarctica', format: 'conspiracy_mystery', tone: 'dark_mystery' },
];

export const ScriptGeneratorModal: React.FC<ScriptGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyScript,
}) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<VideoFormat>('viral_facts');
  const [targetDuration, setTargetDuration] = useState<number>(30);
  const [tone, setTone] = useState<VideoTone>('fast_viral');
  const [cartoonStyle, setCartoonStyle] = useState<CartoonStyle>('pixar_3d');
  const [voiceStyle, setVoiceStyle] = useState('hype_beast');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          format,
          targetDuration,
          tone,
          cartoonStyle,
          voiceStyle
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate viral script.');
      }

      const data = await response.json();
      clearInterval(stepInterval);
      onApplyScript(data, format, tone, cartoonStyle);
      onClose();
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Something went wrong while generating script.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 flex flex-col gap-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/file_00000000e26881faac56ba951981b62c_1cd8f2f6.png"
              alt="storyflixAI Icon"
              className="w-10 h-10 rounded-2xl object-cover shadow-lg shadow-blue-500/25 ring-1 ring-white/20 shrink-0"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                AI Viral Video & Cartoon Generator
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Gemini 3.8
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Turn any idea into a retention-optimized 9:16 script, scenes, audio cues, and viral hook.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Idea / Topic */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
            <span>Video Topic or Story Idea</span>
            <span className="text-[11px] text-zinc-500 font-normal">Be specific or pick an inspiration below</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="e.g. 5 psychological secrets that make people trust you instantly, or a funny animated cartoon about a wizard whose spells turn everything into cheese..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none transition-all"
            />
          </div>

          {/* Quick Generate Video Action Bar below Prompt */}
          <div className="flex items-center justify-between gap-2 p-2 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl">
            <span className="text-[11px] text-zinc-400 font-medium px-2">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">⌘/Ctrl + Enter</kbd> to generate
            </span>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Video className="w-4 h-4 text-white fill-white/20" />
              <span>{isLoading ? 'Generating...' : 'Generate Video'}</span>
            </button>
          </div>

          {/* Prompt Inspiration Pills */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 self-center mr-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Viral Ideas:
            </span>
            {INSPIRATION_IDEAS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopic(item.text);
                  setFormat(item.format as VideoFormat);
                  setTone(item.tone as VideoTone);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition-all text-left truncate max-w-[260px]"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Format Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Video Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as VideoFormat)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="viral_facts">Viral Facts & Top Lists (High Retention)</option>
              <option value="cartoon_story">Animated Cartoon Story & Comedy</option>
              <option value="reddit_story">Reddit Confessions & Drama Storytime</option>
              <option value="conspiracy_mystery">Dark Mystery & Unsolved Lore</option>
              <option value="what_if">Scientific "What If" Catastrophe</option>
              <option value="motivation_mindset">Alpha Mindset & Motivation</option>
              <option value="tech_future">Future Tech & AI Breakthroughs</option>
            </select>
          </div>

          {/* Target Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Target Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setTargetDuration(dur)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    targetDuration === dur
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {dur}s {dur === 15 ? '(Hook)' : dur === 30 ? '(Standard)' : '(Deep)'}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Personality */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-blue-400" />
              Voice Tone & Persona
            </label>
            <select
              value={voiceStyle}
              onChange={(e) => setVoiceStyle(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="hype_beast">High-Energy Hype Creator (Fast, Dopamine)</option>
              <option value="deep_trailer">Deep Movie Trailer Narrator (Dramatic, Cinematic)</option>
              <option value="warm_storyteller">Warm Podcast Storyteller (Engaging, Clear)</option>
              <option value="eerie_mystery">Chilling Mystery Host (Slow, Suspenseful)</option>
              <option value="cartoon_hero">Goofy Cartoon Hero (Playful, Expressive)</option>
            </select>
          </div>

          {/* Cartoon Style (if cartoon format or requested) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
              Art / Animation Aesthetic
            </label>
            <select
              value={cartoonStyle}
              onChange={(e) => setCartoonStyle(e.target.value as CartoonStyle)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="pixar_3d">Pixar & Disney 3D Animated Still</option>
              <option value="anime_manga">Modern Anime & Shonen Manga Style</option>
              <option value="comic_book">Vintage Comic Book & Pop Art</option>
              <option value="cyberpunk_retro">Cyberpunk Neon & Retro Synthwave</option>
              <option value="chibi_fantasy">Cute Chibi & Fantasy Mascot</option>
            </select>
          </div>
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-bold text-white">
                  {loadingStep === 1 && 'Formulating 3-second scroll-stopping viral hook...'}
                  {loadingStep === 2 && 'Structuring fast-paced 9:16 scene storyboard with camera movements...'}
                  {loadingStep === 3 && 'Injecting viral sound effect triggers (vine boom, sub drops, risers)...'}
                  {loadingStep >= 4 && 'Polishing captions and high-converting TikTok hashtags...'}
                </div>
                <div className="text-[11px] text-zinc-400">Powered by Gemini 3.8 Flash model</div>
              </div>
            </div>
            {/* Visual step indicators */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all ${
                    loadingStep >= step ? 'bg-gradient-to-r from-violet-500 to-rose-500' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-lg shadow-violet-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Video className="w-4 h-4 text-white fill-white/20" />
            <span>{isLoading ? 'Generating Video...' : 'Generate Video'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
