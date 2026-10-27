import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Camera,
  Sparkles,
  CheckCircle2,
  Music,
  Zap
} from 'lucide-react';
import { Scene, Project } from '../types/studio';

interface SceneTimelineProps {
  project: Project;
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
  onUpdateProject: (updated: Partial<Project>) => void;
  onGenerateAllVoices: () => Promise<void>;
  isGeneratingVoices: boolean;
}

export const SceneTimeline: React.FC<SceneTimelineProps> = ({
  project,
  selectedSceneIndex,
  onSelectScene,
  onUpdateProject,
  onGenerateAllVoices,
  isGeneratingVoices
}) => {
  const scenes = project.scenes;

  // Add new scene
  const handleAddScene = () => {
    const newSceneNumber = scenes.length + 1;
    const newScene: Scene = {
      id: `sc_${Date.now()}`,
      sceneNumber: newSceneNumber,
      durationSec: 4.0,
      narration: 'And here is what nobody ever tells you about this...',
      visualDescription: 'Dramatic high-contrast visual portrait with volumetric cinematic studio lighting.',
      cameraEffect: 'zoom_in',
      soundEffectCue: 'whoosh',
      overlayBadge: 'PLOT TWIST',
      emojiAccent: '🤯⚡',
      characterEmotion: 'shocked'
    };

    const updatedScenes = [...scenes, newScene];
    onUpdateProject({ scenes: updatedScenes });
    onSelectScene(updatedScenes.length - 1);
  };

  // Duplicate scene
  const handleDuplicateScene = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = scenes[index];
    const cloned: Scene = {
      ...target,
      id: `sc_${Date.now()}`,
      sceneNumber: index + 2,
    };
    const updated = [...scenes.slice(0, index + 1), cloned, ...scenes.slice(index + 1)].map(
      (sc, idx) => ({ ...sc, sceneNumber: idx + 1 })
    );
    onUpdateProject({ scenes: updated });
    onSelectScene(index + 1);
  };

  // Delete scene
  const handleDeleteScene = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (scenes.length <= 1) return; // Keep at least one scene
    const updated = scenes.filter((_, idx) => idx !== index).map((sc, idx) => ({
      ...sc,
      sceneNumber: idx + 1
    }));
    onUpdateProject({ scenes: updated });
    onSelectScene(Math.min(selectedSceneIndex, updated.length - 1));
  };

  // Move scene left/earlier
  const handleMoveLeft = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const nextScenes = [...scenes];
    const temp = nextScenes[index - 1];
    nextScenes[index - 1] = nextScenes[index];
    nextScenes[index] = temp;
    const reindexed = nextScenes.map((sc, idx) => ({ ...sc, sceneNumber: idx + 1 }));
    onUpdateProject({ scenes: reindexed });
    onSelectScene(index - 1);
  };

  // Move scene right/later
  const handleMoveRight = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === scenes.length - 1) return;
    const nextScenes = [...scenes];
    const temp = nextScenes[index + 1];
    nextScenes[index + 1] = nextScenes[index];
    nextScenes[index] = temp;
    const reindexed = nextScenes.map((sc, idx) => ({ ...sc, sceneNumber: idx + 1 }));
    onUpdateProject({ scenes: reindexed });
    onSelectScene(index + 1);
  };

  return (
    <div className="w-full bg-zinc-950/80 border-t border-zinc-800 p-3 sm:p-4 flex flex-col gap-2.5">
      {/* Timeline Controls Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Scene Timeline ({scenes.length} Scenes •{' '}
            {scenes.reduce((acc, s) => acc + s.durationSec, 0).toFixed(1)}s Total)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateAllVoices}
            disabled={isGeneratingVoices}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Generate AI Voiceover for each scene with Gemini TTS"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>{isGeneratingVoices ? 'Synthesizing Voices...' : 'Batch TTS Voices'}</span>
          </button>

          <button
            onClick={handleAddScene}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scene</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Scene Cards */}
      <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {scenes.map((scene, idx) => {
          const isSelected = idx === selectedSceneIndex;

          return (
            <div
              key={scene.id || idx}
              onClick={() => onSelectScene(idx)}
              className={`relative shrink-0 w-52 sm:w-60 p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-zinc-900 border-rose-500/80 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              {/* Scene Number & Duration Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-md text-[11px] font-black flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {scene.sceneNumber}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                    {scene.durationSec.toFixed(1)}s
                  </span>
                </div>

                {/* Badges / indicators */}
                <div className="flex items-center gap-1">
                  {scene.audioUrl && (
                    <span
                      title="AI TTS Voice Generated"
                      className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {scene.overlayBadge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate max-w-[85px]">
                      {scene.overlayBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Narration Preview */}
              <p className="text-xs text-zinc-200 line-clamp-2 font-medium leading-relaxed">
                "{scene.narration}"
              </p>

              {/* Action tags footer */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 capitalize">
                    <Camera className="w-2.5 h-2.5 text-zinc-500" />
                    {scene.cameraEffect.replace('_', ' ')}
                  </span>
                  {scene.soundEffectCue !== 'none' && (
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <Music className="w-2.5 h-2.5" />
                      {scene.soundEffectCue.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Card mini actions */}
                <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleMoveLeft(idx, e)}
                    disabled={idx === 0}
                    className="p-1 hover:text-white disabled:opacity-20"
                    title="Move left"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleMoveRight(idx, e)}
                    disabled={idx === scenes.length - 1}
                    className="p-1 hover:text-white disabled:opacity-20"
                    title="Move right"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDuplicateScene(idx, e)}
                    className="p-1 hover:text-amber-400"
                    title="Duplicate scene"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteScene(idx, e)}
                    disabled={scenes.length <= 1}
                    className="p-1 hover:text-rose-400 disabled:opacity-20"
                    title="Delete scene"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Scene Card Button at End of list */}
        <button
          onClick={handleAddScene}
          className="shrink-0 w-28 rounded-2xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/60 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 text-rose-400" />
          <span className="text-[11px] font-bold">New Scene</span>
        </button>
      </div>
    </div>
  );
};
