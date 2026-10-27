import React, { useState } from 'react';
import {
  Camera,
  Music,
  Sliders,
  Sparkles,
  Upload,
  Volume2,
  Clock,
  Tag,
  Smile,
  MessageSquare,
  Wand2,
  AlertCircle,
  Check
} from 'lucide-react';
import { CameraEffect, CharacterEmotion, Scene, SoundEffectCue } from '../types/studio';
import { audioEngine } from '../utils/audioEngine';

interface SceneInspectorProps {
  scene: Scene;
  isCartoonMode: boolean;
  onUpdateScene: (updatedFields: Partial<Scene>) => void;
  onGenerateSingleVoice: (scene: Scene) => Promise<void>;
}

const CAMERA_EFFECTS: { id: CameraEffect; label: string; desc: string }[] = [
  { id: 'zoom_in', label: 'Zoom In', desc: 'Slow cinematic push' },
  { id: 'zoom_out', label: 'Zoom Out', desc: 'Grand scale reveal' },
  { id: 'pan_left', label: 'Pan Left', desc: 'Horizontal motion' },
  { id: 'pan_right', label: 'Pan Right', desc: 'Tracking sweep' },
  { id: 'shake', label: 'Screen Shake', desc: 'High-impact vibration' },
  { id: 'flash_cut', label: 'Flash Cut', desc: 'Impact white flash' },
];

const SOUND_EFFECTS: { id: SoundEffectCue; label: string; icon: string }[] = [
  { id: 'vine_boom', label: 'Vine Boom', icon: '💥' },
  { id: 'whoosh', label: 'Air Whoosh', icon: '💨' },
  { id: 'sub_drop', label: '808 Sub Drop', icon: '🔊' },
  { id: 'cash_register', label: 'Cash Register', icon: '💰' },
  { id: 'chime', label: 'Bell Chime', icon: '🔔' },
  { id: 'record_scratch', label: 'Vinyl Scratch', icon: '💿' },
  { id: 'alert_stinger', label: 'Alert Stinger', icon: '🚨' },
  { id: 'none', label: 'None', icon: '🚫' },
];

const QUICK_BADGES = [
  'WAIT FOR IT...',
  'SECRET EXPOSED',
  'DID YOU KNOW?',
  'MIND BLOWN',
  'WARNING ⚠️',
  'PLOT TWIST',
  'DON\'T SKIP',
  'POV'
];

const EMOTIONS: { id: CharacterEmotion; label: string; emoji: string }[] = [
  { id: 'shocked', label: 'Shocked', emoji: '😱' },
  { id: 'heroic', label: 'Heroic', emoji: '🔥' },
  { id: 'laughing', label: 'Laughing', emoji: '😂' },
  { id: 'scheming', label: 'Scheming', emoji: '😏' },
  { id: 'thinking', label: 'Thinking', emoji: '🤔' },
  { id: 'angry', label: 'Angry', emoji: '😡' },
  { id: 'crying', label: 'Crying', emoji: '😭' },
  { id: 'confident', label: 'Confident', emoji: '😎' },
];

export const SceneInspector: React.FC<SceneInspectorProps> = ({
  scene,
  isCartoonMode,
  onUpdateScene,
  onGenerateSingleVoice
}) => {
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [visualError, setVisualError] = useState<string | null>(null);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);

  // Play SFX test
  const handleTestSFX = (cue: SoundEffectCue) => {
    audioEngine.init();
    audioEngine.playSFX(cue);
  };

  // Generate Image with Gemini Image endpoint
  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    setVisualError(null);
    try {
      const response = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.visualDescription,
          isCartoon: isCartoonMode
        })
      });

      const data = await response.json();
      if (data.imageUrl) {
        onUpdateScene({ imageUrl: data.imageUrl });
      } else {
        throw new Error(data.error || 'Could not generate visual');
      }
    } catch (err: any) {
      setVisualError('AI visual generation requires a paid image key or fallback image.');
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  // Custom Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateScene({ imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger TTS voice generation for this scene
  const handleSynthesizeVoice = async () => {
    setIsGeneratingTTS(true);
    try {
      await onGenerateSingleVoice(scene);
    } finally {
      setIsGeneratingTTS(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-zinc-100 p-1">
      {/* Scene Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-xs font-black">
            {scene.sceneNumber}
          </span>
          <h3 className="font-bold text-sm text-white">Scene {scene.sceneNumber} Editor</h3>
        </div>

        {/* Duration slider */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-zinc-300">{scene.durationSec.toFixed(1)}s</span>
          <input
            type="range"
            min={2.0}
            max={8.0}
            step={0.5}
            value={scene.durationSec}
            onChange={(e) => onUpdateScene({ durationSec: parseFloat(e.target.value) })}
            className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>

      {/* Voiceover Narration Script Text */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
            Spoken Voiceover Script
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSynthesizeVoice}
              disabled={isGeneratingTTS}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isGeneratingTTS ? 'Synthesizing...' : 'Generate Voice (Gemini TTS)'}</span>
            </button>
            <span className="text-[10px] text-zinc-500 font-mono">
              {scene.narration.trim().split(/\s+/).length} words
            </span>
          </div>
        </div>
        <textarea
          rows={3}
          value={scene.narration}
          onChange={(e) => onUpdateScene({ narration: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-all resize-none leading-relaxed"
          placeholder="What is spoken in this scene..."
        />
      </div>

      {/* Camera Action Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          Camera Movement & Motion
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CAMERA_EFFECTS.map((cam) => (
            <button
              key={cam.id}
              onClick={() => onUpdateScene({ cameraEffect: cam.id })}
              className={`p-2 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                scene.cameraEffect === cam.id
                  ? 'bg-blue-500/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <span className="text-xs font-bold capitalize">{cam.label}</span>
              <span className="text-[10px] text-zinc-500 leading-tight">{cam.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Viral Sound Effect Trigger */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-rose-400" />
            Sound Effect Impact Cue
          </label>
          {scene.soundEffectCue !== 'none' && (
            <button
              onClick={() => handleTestSFX(scene.soundEffectCue)}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Play Test SFX</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {SOUND_EFFECTS.map((sfx) => (
            <button
              key={sfx.id}
              onClick={() => {
                onUpdateScene({ soundEffectCue: sfx.id });
                handleTestSFX(sfx.id);
              }}
              className={`p-1.5 rounded-xl border text-center flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                scene.soundEffectCue === sfx.id
                  ? 'bg-rose-500/20 border-rose-500 text-white font-bold ring-1 ring-rose-500/50'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-sm">{sfx.icon}</span>
              <span className="text-[10px] leading-tight truncate w-full">{sfx.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Viral Overlay Badge & Emoji Accent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            Hook Overlay Badge
          </label>
          <input
            type="text"
            value={scene.overlayBadge}
            onChange={(e) => onUpdateScene({ overlayBadge: e.target.value })}
            placeholder="e.g. WAIT FOR IT..."
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
          {/* Quick Badges */}
          <div className="flex flex-wrap gap-1 mt-0.5">
            {QUICK_BADGES.slice(0, 4).map((badge) => (
              <button
                key={badge}
                onClick={() => onUpdateScene({ overlayBadge: badge })}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
              >
                {badge}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            Emoji Accents
          </label>
          <input
            type="text"
            value={scene.emojiAccent}
            onChange={(e) => onUpdateScene({ emojiAccent: e.target.value })}
            placeholder="e.g. 🤯🔥"
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
          />
          <div className="flex gap-1.5 mt-0.5">
            {['🤯🔥', '😱💀', '💰⚡', '👁️🤫', '🚀✨', '🍕🤤'].map((emo) => (
              <button
                key={emo}
                onClick={() => onUpdateScene({ emojiAccent: emo })}
                className="text-xs p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
              >
                {emo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cartoon Mode Specifics: Emotion Reaction & Speaker */}
      {isCartoonMode && (
        <div className="bg-violet-950/20 border border-violet-800/40 rounded-2xl p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5" />
              Cartoon Character Emotion & Dialogue
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {EMOTIONS.map((emo) => (
              <button
                key={emo.id}
                onClick={() => onUpdateScene({ characterEmotion: emo.id })}
                className={`p-1.5 rounded-xl border text-center flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  scene.characterEmotion === emo.id
                    ? 'bg-violet-600/30 border-violet-400 text-white font-bold ring-1 ring-violet-400'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-base">{emo.emoji}</span>
                <span className="text-[10px] truncate w-full">{emo.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <input
              type="text"
              value={scene.dialogueSpeaker || ''}
              onChange={(e) => onUpdateScene({ dialogueSpeaker: e.target.value })}
              placeholder="Speaker Name (shows comic speech bubble, e.g. Sir Reginald)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-400"
            />
          </div>
        </div>
      )}

      {/* Visual Artwork & Scene Imagery */}
      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            Scene Visual Artwork & B-Roll
          </span>
          {scene.imageUrl && (
            <button
              onClick={() => onUpdateScene({ imageUrl: undefined })}
              className="text-[10px] text-zinc-400 hover:text-rose-400"
            >
              Revert to Generative Canvas
            </button>
          )}
        </label>

        <textarea
          rows={2}
          value={scene.visualDescription}
          onChange={(e) => onUpdateScene({ visualDescription: e.target.value })}
          placeholder="Visual description for AI image generation..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-fuchsia-400 resize-none"
        />

        {/* Visual action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateVisual}
            disabled={isGeneratingVisual}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isGeneratingVisual ? 'Generating AI Image...' : 'Generate AI Image'}</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {visualError && (
          <div className="text-[11px] text-zinc-400 bg-zinc-900/80 border border-zinc-800 rounded-lg p-2 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{visualError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
