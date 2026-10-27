/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  Sliders,
  Type,
  Music,
  Palette,
  Sparkles,
  Layers,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Video
} from 'lucide-react';
import { CartoonStyle, Project, Scene, VideoFormat, VideoTone } from './types/studio';
import { PRESET_PROJECTS, CHARACTER_PRESETS } from './data/presetTemplates';
import { Header } from './components/Header';
import { PhonePlayer } from './components/PhonePlayer';
import { SceneTimeline } from './components/SceneTimeline';
import { SceneInspector } from './components/SceneInspector';
import { CaptionSettings } from './components/CaptionSettings';
import { AudioSoundboard } from './components/AudioSoundboard';
import { CartoonStudio } from './components/CartoonStudio';
import { ScriptGeneratorModal } from './components/ScriptGeneratorModal';
import { HookOptimizerModal } from './components/HookOptimizerModal';
import { ExportModal } from './components/ExportModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [project, setProject] = useState<Project>(PRESET_PROJECTS[0]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'scene' | 'captions' | 'audio' | 'cartoon'>('scene');
  const [showTikTokOverlay, setShowTikTokOverlay] = useState<boolean>(false);

  // Modals state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isHookOptimizerOpen, setIsHookOptimizerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Batch TTS generation state
  const [isGeneratingVoices, setIsGeneratingVoices] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateProject = useCallback((updated: Partial<Project>) => {
    setProject((prev) => ({ ...prev, ...updated }));
  }, []);

  const updateSelectedScene = useCallback(
    (updatedFields: Partial<Scene>) => {
      setProject((prev) => {
        const nextScenes = [...prev.scenes];
        if (nextScenes[selectedSceneIndex]) {
          nextScenes[selectedSceneIndex] = {
            ...nextScenes[selectedSceneIndex],
            ...updatedFields
          };
        }
        return { ...prev, scenes: nextScenes };
      });
    },
    [selectedSceneIndex]
  );

  // Handle Preset selection
  const handleSelectPreset = (preset: Project) => {
    setProject({ ...preset, id: `proj_${Date.now()}` });
    setSelectedSceneIndex(0);
    showToast(`Loaded "${preset.title}"`);
  };

  // Handle Mode Change (Viral Shorts vs Cartoon Story)
  const handleChangeFormat = (format: VideoFormat) => {
    if (format === 'cartoon_story') {
      const cartoonPreset = PRESET_PROJECTS.find((p) => p.format === 'cartoon_story') || PRESET_PROJECTS[1];
      setProject({
        ...cartoonPreset,
        id: `proj_${Date.now()}`
      });
      setActiveTab('cartoon');
      showToast('Switched to Cartoon Story Studio');
    } else {
      const viralPreset = PRESET_PROJECTS[0];
      setProject({
        ...viralPreset,
        id: `proj_${Date.now()}`
      });
      setActiveTab('scene');
      showToast('Switched to Viral Shorts & Reels Studio');
    }
    setSelectedSceneIndex(0);
  };

  // Apply Generated Script from Gemini
  const handleApplyScript = (
    data: any,
    chosenFormat: VideoFormat,
    chosenTone: VideoTone,
    chosenCartoonStyle: CartoonStyle
  ) => {
    if (!data.scenes || data.scenes.length === 0) return;

    const newScenes: Scene[] = data.scenes.map((sc: any, idx: number) => ({
      id: `sc_${Date.now()}_${idx}`,
      sceneNumber: idx + 1,
      durationSec: sc.durationSec || 4.0,
      narration: sc.narration || '',
      visualDescription: sc.visualDescription || '',
      visualStyleKeywords: sc.visualStyleKeywords || '',
      cameraEffect: sc.cameraEffect || 'zoom_in',
      soundEffectCue: sc.soundEffectCue || 'whoosh',
      overlayBadge: sc.overlayBadge || 'VIRAL HOOK',
      emojiAccent: sc.emojiAccent || '🔥',
      characterEmotion: sc.characterEmotion || 'shocked',
      dialogueSpeaker: sc.dialogueSpeaker || (chosenFormat === 'cartoon_story' ? 'Hero' : undefined)
    }));

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: data.title || 'Untitled Viral Video',
      viralHook: data.viralHook || '',
      tiktokCaption: data.tiktokCaption || '',
      hashtags: data.hashtags || ['#fyp', '#viral', '#storyflixAI'],
      format: chosenFormat,
      tone: chosenTone,
      cartoonStyle: chosenCartoonStyle,
      captionPreset: chosenFormat === 'cartoon_story' ? 'cartoon_comic' : 'hormozi_yellow',
      captionYPercent: 68,
      captionFontSize: 34,
      autoEmojis: true,
      bgmTrack: data.bgmSuggestion || (chosenFormat === 'cartoon_story' ? 'cartoon_quirky' : 'phonk_drift'),
      bgmVolume: 0.35,
      voiceVolume: 0.95,
      voiceSpeaker: chosenFormat === 'cartoon_story' ? 'Puck' : 'Fenrir',
      characterAvatar: chosenFormat === 'cartoon_story' ? 'sir_reginald' : undefined,
      scenes: newScenes
    };

    setProject(newProject);
    setSelectedSceneIndex(0);
    showToast(`Generated: "${newProject.title}" with ${newScenes.length} scenes!`);
  };

  // Generate single scene TTS voice
  const handleGenerateSingleVoice = async (scene: Scene) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scene.narration,
          voice: project.voiceSpeaker
        })
      });

      const data = await response.json();
      if (data.audioUrl) {
        updateSelectedScene({ audioUrl: data.audioUrl });
        showToast(`Synthesized voice for Scene ${scene.sceneNumber}!`);
      } else {
        showToast('TTS voice fallback enabled.');
      }
    } catch {
      showToast('TTS synthesized via browser voice.');
    }
  };

  // Batch TTS generation for all scenes
  const handleGenerateAllVoices = async () => {
    setIsGeneratingVoices(true);
    let successCount = 0;
    try {
      const updatedScenes = [...project.scenes];
      for (let i = 0; i < updatedScenes.length; i++) {
        const sc = updatedScenes[i];
        try {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: sc.narration,
              voice: project.voiceSpeaker
            })
          });
          const data = await response.json();
          if (data.audioUrl) {
            updatedScenes[i] = { ...sc, audioUrl: data.audioUrl };
            successCount++;
          }
        } catch {
          // Continue to next scene
        }
      }
      setProject((prev) => ({ ...prev, scenes: updatedScenes }));
      showToast(`Generated ${successCount}/${updatedScenes.length} scene voiceovers!`);
    } finally {
      setIsGeneratingVoices(false);
    }
  };

  const activeScene = project.scenes[selectedSceneIndex] || project.scenes[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Studio Header */}
      <Header
        project={project}
        onSelectPreset={handleSelectPreset}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenHookOptimizer={() => setIsHookOptimizerOpen(true)}
        onChangeFormat={handleChangeFormat}
      />

      {/* Main Studio Body: Player + Inspector */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center Area: 9:16 Phone Canvas Player */}
        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950/60 p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-zinc-850">
          {/* Quick Prompt Bar with Generate Video Icon */}
          <div className="w-full max-w-[360px] sm:max-w-[420px] mb-3 flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-1.5 shadow-xl backdrop-blur-md">
            <input
              type="text"
              placeholder="Prompt a story, idea, or viral hook..."
              onClick={() => setIsGeneratorOpen(true)}
              onFocus={() => setIsGeneratorOpen(true)}
              readOnly
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Generate Video</span>
            </button>
          </div>

          <PhonePlayer
            project={project}
            selectedSceneIndex={selectedSceneIndex}
            onSelectScene={setSelectedSceneIndex}
            showTikTokOverlay={showTikTokOverlay}
            onToggleTikTokOverlay={() => setShowTikTokOverlay(!showTikTokOverlay)}
          />
        </div>

        {/* Right Area: Studio Inspector & Tools */}
        <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col bg-zinc-900/50 border-zinc-800 shrink-0">
          {/* Tabs Bar */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-950/80 px-2 pt-2 gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('scene')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                activeTab === 'scene'
                  ? 'bg-zinc-900 text-white border-t border-x border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <Sliders className="w-4 h-4 text-rose-500" />
              <span className="text-[11px]">Scene {selectedSceneIndex + 1}</span>
            </button>

            <button
              onClick={() => setActiveTab('captions')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                activeTab === 'captions'
                  ? 'bg-zinc-900 text-white border-t border-x border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <Type className="w-4 h-4 text-amber-400" />
              <span className="text-[11px]">Captions</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-zinc-900 text-white border-t border-x border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <Music className="w-4 h-4 text-blue-400" />
              <span className="text-[11px]">Audio & SFX</span>
            </button>

            <button
              onClick={() => setActiveTab('cartoon')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                activeTab === 'cartoon'
                  ? 'bg-zinc-900 text-white border-t border-x border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <Palette className="w-4 h-4 text-fuchsia-400" />
              <span className="text-[11px]">Cartoon</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {activeTab === 'scene' && activeScene && (
              <SceneInspector
                scene={activeScene}
                isCartoonMode={project.format === 'cartoon_story'}
                onUpdateScene={updateSelectedScene}
                onGenerateSingleVoice={handleGenerateSingleVoice}
              />
            )}

            {activeTab === 'captions' && (
              <CaptionSettings project={project} onUpdateProject={updateProject} />
            )}

            {activeTab === 'audio' && (
              <AudioSoundboard project={project} onUpdateProject={updateProject} />
            )}

            {activeTab === 'cartoon' && (
              <CartoonStudio project={project} onUpdateProject={updateProject} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Scene Timeline */}
      <SceneTimeline
        project={project}
        selectedSceneIndex={selectedSceneIndex}
        onSelectScene={setSelectedSceneIndex}
        onUpdateProject={updateProject}
        onGenerateAllVoices={handleGenerateAllVoices}
        isGeneratingVoices={isGeneratingVoices}
      />

      {/* Modals */}
      <ScriptGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onApplyScript={handleApplyScript}
      />

      <HookOptimizerModal
        isOpen={isHookOptimizerOpen}
        onClose={() => setIsHookOptimizerOpen(false)}
        project={project}
        onApplyHook={(newHook) => updateProject({ viralHook: newHook, title: newHook })}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />
    </div>
  );
}
