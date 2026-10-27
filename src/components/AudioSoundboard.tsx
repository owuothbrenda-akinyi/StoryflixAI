import React from 'react';
import { Music, Volume2, Mic, Play, Disc, Sliders, Radio } from 'lucide-react';
import { Project, SoundEffectCue } from '../types/studio';
import { audioEngine } from '../utils/audioEngine';

interface AudioSoundboardProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
}

const BGM_TRACKS = [
  { id: 'phonk_drift', name: 'Phonk Drift 808', mood: 'Aggressive & Viral', bpm: 140 },
  { id: 'lo_fi_chill', name: 'Lo-Fi Chill Hop', mood: 'Aesthetic / Cozy Story', bpm: 84 },
  { id: 'suspense_dark', name: 'Dark Tension Pulse', mood: 'Mystery / Conspiracy', bpm: 110 },
  { id: 'upbeat_pop', name: 'Upbeat Funk Groove', mood: 'High Energy / Lifehacks', bpm: 125 },
  { id: 'cartoon_quirky', name: 'Cartoon Pizzicato Bounce', mood: 'Comedy & Whimsical', bpm: 130 },
  { id: 'none', name: 'Mute Background Music', mood: 'Voice Only', bpm: 0 },
];

const VOICE_SPEAKERS = [
  { id: 'Fenrir', name: 'Fenrir (Deep Hype & Authority)', style: 'MrBeast / Fast viral retention' },
  { id: 'Kore', name: 'Kore (Clear & Natural)', style: 'Engaging podcast storyteller' },
  { id: 'Puck', name: 'Puck (Playful & Animated)', style: 'Cartoon comedy & fun dialogues' },
  { id: 'Zephyr', name: 'Zephyr (Smooth & Confident)', style: 'Tech breakdown & sci-fi' },
  { id: 'Charon', name: 'Charon (Low Movie Trailer)', style: 'Horror, mystery & deep lore' },
];

const SFX_PADS: { id: SoundEffectCue; name: string; emoji: string; color: string }[] = [
  { id: 'vine_boom', name: 'Vine Boom', emoji: '💥', color: 'from-amber-500 to-rose-600' },
  { id: 'whoosh', name: 'Air Whoosh', emoji: '💨', color: 'from-blue-500 to-cyan-500' },
  { id: 'sub_drop', name: '808 Sub Drop', emoji: '🔊', color: 'from-violet-600 to-indigo-600' },
  { id: 'cash_register', name: 'Cash Register', emoji: '💰', color: 'from-emerald-500 to-teal-600' },
  { id: 'chime', name: 'Bell Chime', emoji: '🔔', color: 'from-yellow-400 to-amber-500' },
  { id: 'record_scratch', name: 'Vinyl Scratch', emoji: '💿', color: 'from-pink-500 to-rose-500' },
  { id: 'alert_stinger', name: 'Alert Stinger', emoji: '🚨', color: 'from-red-600 to-rose-700' },
];

export const AudioSoundboard: React.FC<AudioSoundboardProps> = ({
  project,
  onUpdateProject
}) => {
  const handlePlaySFX = (cue: SoundEffectCue) => {
    audioEngine.init();
    audioEngine.playSFX(cue);
  };

  const handleTestBGM = (trackId: string) => {
    audioEngine.init();
    onUpdateProject({ bgmTrack: trackId });
    audioEngine.startBGM(trackId);
  };

  return (
    <div className="flex flex-col gap-4 text-zinc-100 p-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-rose-500" />
          <h3 className="font-bold text-sm text-white">Audio Studio & Viral Soundboard</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          Stereo Mix
        </span>
      </div>

      {/* Voice Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-rose-400" />
          AI Voice Persona (Gemini TTS)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VOICE_SPEAKERS.map((voice) => {
            const isSelected = project.voiceSpeaker === voice.id;
            return (
              <button
                key={voice.id}
                onClick={() => onUpdateProject({ voiceSpeaker: voice.id })}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 text-white ring-1 ring-rose-500/50 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-bold text-white">{voice.name}</span>
                <span className="text-[10px] text-zinc-400">{voice.style}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Music Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-amber-400" />
          Background Music Beat
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BGM_TRACKS.map((track) => {
            const isSelected = project.bgmTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleTestBGM(track.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{track.name}</span>
                  {isSelected && <Radio className="w-3 h-3 text-amber-400 shrink-0" />}
                </div>
                <span className="text-[10px] text-zinc-400">{track.mood}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Volume Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5">
        {/* Voiceover Volume */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-300 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" /> Voice Volume
            </span>
            <span className="font-mono text-rose-400">
              {Math.round(project.voiceVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={project.voiceVolume}
            onChange={(e) => onUpdateProject({ voiceVolume: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* BGM Volume */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-300 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-amber-400" /> BGM Ducking Volume
            </span>
            <span className="font-mono text-amber-400">
              {Math.round(project.bgmVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={project.bgmVolume}
            onChange={(e) => onUpdateProject({ bgmVolume: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Live Viral SFX Soundboard Pads */}
      <div className="flex flex-col gap-2 pt-1">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
          <span>Live Viral SFX Soundboard</span>
          <span className="text-[10px] text-zinc-500 font-normal">Click to trigger instant sound</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SFX_PADS.map((pad) => (
            <button
              key={pad.id}
              onClick={() => handlePlaySFX(pad.id)}
              className="group p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center gap-1.5 text-center transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${pad.color} flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform`}>
                {pad.emoji}
              </div>
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white truncate w-full">
                {pad.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
