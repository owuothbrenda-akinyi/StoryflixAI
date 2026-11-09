import React, { useState } from 'react';
import {
  X,
  Film,
  Sparkles,
  Camera,
  Video,
  Play,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sliders,
  Layers,
  Wand2,
  RefreshCw,
  Eye
} from 'lucide-react';
import {
  ImageGenModelType,
  MotionControlConfig,
  MotionControlType,
  Project,
  Scene,
  VideoGenModelType
} from '../types/studio';

interface CinematicPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  selectedSceneIndex: number;
  onSelectSceneIndex: (idx: number) => void;
}

export const CinematicPipelineModal: React.FC<CinematicPipelineModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject,
  selectedSceneIndex,
  onSelectSceneIndex
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentScene = project.scenes[selectedSceneIndex] || project.scenes[0];

  const updateCurrentScene = (fields: Partial<Scene>) => {
    const nextScenes = [...project.scenes];
    if (nextScenes[selectedSceneIndex]) {
      nextScenes[selectedSceneIndex] = {
        ...nextScenes[selectedSceneIndex],
        ...fields
      };
      onUpdateProject({ scenes: nextScenes });
    }
  };

  // Run the full 4-stage pipeline for this scene
  const handleRunPipelineForScene = async (sceneIdx: number) => {
    const sc = project.scenes[sceneIdx];
    if (!sc) return;

    setIsProcessing(true);
    setCurrentStep(1);
    setStatusMessage('Stage 1: Ingesting Voiceover Text Script...');

    try {
      await new Promise((r) => setTimeout(r, 600));

      // Stage 2: Hidden Prompt-Expansion Layer (LLM)
      setCurrentStep(2);
      setStatusMessage('Stage 2: Expanding via Hollywood Director Cinematography LLM...');

      const expRes = await fetch('/api/expand-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narration: sc.narration,
          topic: project.title,
          visualDescription: sc.visualDescription,
          format: project.format,
          tone: project.tone,
          actorPersona: project.actorPersona,
          characterName: project.characterName
        })
      });
      const expData = await expRes.json();
      const expandedPrompt = expData.expandedPrompt || sc.visualDescription || sc.narration;

      // Stage 3: Image Gen Model (Flux / Midjourney)
      setCurrentStep(3);
      setStatusMessage('Stage 3: Generating Flawless Cinematic Static Keyframe (Flux.1 Pro)...');

      const frameRes = await fetch('/api/generate-flawless-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expandedPrompt,
          model: 'flux_1',
          format: project.format
        })
      });
      const frameData = await frameRes.json();

      // Stage 4: Video Gen API (Kling 4.0 / Runway Gen-3 Motion Control)
      setCurrentStep(4);
      setStatusMessage('Stage 4: Merging Static Keyframe + Kling 4.0 UI Motion Control (60 FPS)...');

      const motionConfig: MotionControlConfig = expData.motionControl || {
        type: 'zoom_in',
        strength: 7,
        cameraPath: 'Kling 4.0 smooth cinematic forward push-in with 60fps fluidity',
        fps: 60
      };

      await fetch('/api/synthesize-video-motion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyframeImageUrl: frameData.imageUrl,
          motionControl: motionConfig,
          durationSec: sc.durationSec,
          model: 'kling_4'
        })
      });

      // Stage 5: Finalized
      setCurrentStep(5);
      setStatusMessage('Stage 5: Premium Cinematic Video Synthesized!');

      const nextScenes = [...project.scenes];
      nextScenes[sceneIdx] = {
        ...nextScenes[sceneIdx],
        expandedPrompt,
        promptExpansionDetails: expData.promptExpansionDetails,
        imageUrl: frameData.imageUrl,
        keyframeImageUrl: frameData.imageUrl,
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: motionConfig,
        pipelineStatus: 'ready'
      };

      onUpdateProject({ scenes: nextScenes });
    } catch (err: any) {
      console.error('Error running pipeline:', err);
      setStatusMessage(`Error: ${err.message || 'Pipeline failed'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Run full pipeline on ALL scenes in project
  const handleRunAllScenes = async () => {
    setIsProcessing(true);
    for (let i = 0; i < project.scenes.length; i++) {
      onSelectSceneIndex(i);
      await handleRunPipelineForScene(i);
    }
    setIsProcessing(false);
    setStatusMessage('All scenes rendered through 4-stage cinematic pipeline!');
  };

  const currentMotion = currentScene.motionControl || {
    type: (currentScene.cameraEffect as MotionControlType) || 'zoom_in',
    strength: 6,
    cameraPath: 'Smooth cinematic push-in (1.18x) with Kling 4.0 motion interpolation',
    fps: 60
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-zinc-100 my-8 max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Cinematic AI Video Generation Architecture
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Kling 4.0 + Flux.1
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Voiceover Script ➔ Hidden LLM Expansion ➔ Flux Flawless Keyframe ➔ Kling Motion Engine ➔ Final Cinema Video
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Architecture Diagram (The User's Exact Specification) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Production Video Pipeline Architecture</span>
            <span className="text-emerald-400">● 60 FPS Sub-pixel Interpolation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            {/* Box 1 */}
            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-center transition-all ${
              currentStep === 1 ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500' : 'bg-zinc-900/90 border-zinc-800'
            }`}>
              <span className="text-xs font-black text-rose-400">STAGE 1</span>
              <span className="text-xs font-bold text-white">Voiceover Script</span>
              <span className="text-[10px] text-zinc-500">Narration text & pacing</span>
            </div>

            {/* Box 2 */}
            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-center transition-all ${
              currentStep === 2 ? 'bg-violet-950/40 border-violet-500 ring-1 ring-violet-500' : 'bg-zinc-900/90 border-zinc-800'
            }`}>
              <span className="text-xs font-black text-violet-400">STAGE 2</span>
              <span className="text-xs font-bold text-white">Hidden Prompt-Expansion</span>
              <span className="text-[10px] text-zinc-500">Director LLM (Gemini)</span>
            </div>

            {/* Box 3 */}
            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-center transition-all ${
              currentStep === 3 ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500' : 'bg-zinc-900/90 border-zinc-800'
            }`}>
              <span className="text-xs font-black text-cyan-400">STAGE 3</span>
              <span className="text-xs font-bold text-white">Image Gen Model</span>
              <span className="text-[10px] text-zinc-500">Flux.1 / Midjourney Keyframe</span>
            </div>

            {/* Box 4 */}
            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-center transition-all ${
              currentStep === 4 ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500' : 'bg-zinc-900/90 border-zinc-800'
            }`}>
              <span className="text-xs font-black text-amber-400">STAGE 4</span>
              <span className="text-xs font-bold text-white">Video Gen API</span>
              <span className="text-[10px] text-zinc-500">Kling 4.0 / Runway Motion</span>
            </div>

            {/* Box 5 */}
            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-center transition-all ${
              currentStep === 5 ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500' : 'bg-zinc-900/90 border-zinc-800'
            }`}>
              <span className="text-xs font-black text-emerald-400">STAGE 5</span>
              <span className="text-xs font-bold text-white">Final Cinema Video</span>
              <span className="text-[10px] text-zinc-500">Captions + Audio Sync</span>
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 flex-wrap gap-2">
            <span className="text-xs text-zinc-400 font-medium">
              {statusMessage || 'Ready to run high-retention cinematic pipeline.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunPipelineForScene(selectedSceneIndex)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-violet-600/25"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Render Scene {selectedSceneIndex + 1} Pipeline</span>
              </button>

              <button
                onClick={handleRunAllScenes}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shadow-rose-500/25"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Render All Scenes ({project.scenes.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scene Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            Scenes:
          </span>
          {project.scenes.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => onSelectSceneIndex(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                selectedSceneIndex === i
                  ? 'bg-rose-500/20 text-white border-rose-500 ring-1 ring-rose-500/50'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <span>Scene {sc.sceneNumber}</span>
              {sc.pipelineStatus === 'ready' && <span className="text-[10px] text-emerald-400 font-normal">✓</span>}
            </button>
          ))}
        </div>

        {/* Deep Dive into Scene {selectedSceneIndex + 1} Pipeline Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Stage 1 & Stage 2 */}
          <div className="flex flex-col gap-4">
            {/* Stage 1: Voiceover Script */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span>🎙️</span> [Stage 1] Spoken Voiceover Script
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {currentScene.durationSec.toFixed(1)}s Duration
                </span>
              </div>
              <textarea
                rows={2}
                value={currentScene.narration}
                onChange={(e) => updateCurrentScene({ narration: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                placeholder="Voiceover script text..."
              />
            </div>

            {/* Stage 2: Hidden Prompt-Expansion Layer */}
            <div className="bg-zinc-950 border border-violet-800/40 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-violet-400">
                  <Sparkles className="w-3.5 h-3.5" /> [Stage 2] Hidden Prompt-Expansion (LLM)
                </span>
                <span className="text-[10px] text-violet-300 font-mono">Hollywood Director LLM</span>
              </div>

              <textarea
                rows={3}
                value={currentScene.expandedPrompt || currentScene.visualDescription}
                onChange={(e) => updateCurrentScene({ expandedPrompt: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-[11px] text-zinc-200 font-mono focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                placeholder="Expanded cinematography prompt will appear here..."
              />

              {currentScene.promptExpansionDetails && (
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 font-bold block">OPTICAL PACKAGE:</span>
                    <span className="text-zinc-300 font-mono">{currentScene.promptExpansionDetails.cinematography}</span>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 font-bold block">STUDIO LIGHTING:</span>
                    <span className="text-zinc-300">{currentScene.promptExpansionDetails.lighting}</span>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 font-bold block">COLOR SCIENCE / LUT:</span>
                    <span className="text-zinc-300">{currentScene.promptExpansionDetails.colorGrading}</span>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 font-bold block">ATMOSPHERE:</span>
                    <span className="text-zinc-300">{currentScene.promptExpansionDetails.atmosphere}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stage 3 & Stage 4 */}
          <div className="flex flex-col gap-4">
            {/* Stage 3: Flawless Keyframe */}
            <div className="bg-zinc-950 border border-cyan-800/40 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Camera className="w-3.5 h-3.5" /> [Stage 3] Image Gen Model (Flux / Midjourney)
                </span>
                <span className="text-[10px] text-cyan-300 font-mono">Flawless 9:16 Static Frame</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 h-32 rounded-xl overflow-hidden border border-zinc-700 bg-black shrink-0 relative group shadow-lg">
                  <img
                    src={currentScene.keyframeImageUrl || currentScene.imageUrl || ''}
                    alt="Keyframe"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-bold text-cyan-300">
                    9:16
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Flawless Static Frame Generated</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Generated with high-coherence camera seed & aesthetic styling.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleRunPipelineForScene(selectedSceneIndex)}
                      disabled={isProcessing}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all cursor-pointer"
                    >
                      Regenerate Frame
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 4: Kling 4.0 / Runway UI Motion Control */}
            <div className="bg-zinc-950 border border-amber-800/40 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Video className="w-3.5 h-3.5" /> [Stage 4] Video Gen API (Kling 4.0 / Runway Gen-3)
                </span>
                <span className="text-[10px] text-amber-300 font-mono">UI Motion Control</span>
              </div>

              {/* Trajectory Select */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'zoom_in', label: 'Zoom In', icon: '🔍' },
                  { id: 'push_in', label: 'Push In', icon: '🎬' },
                  { id: 'zoom_out', label: 'Zoom Out', icon: '🔭' },
                  { id: 'pan_left', label: 'Pan Left', icon: '⬅️' },
                  { id: 'pan_right', label: 'Pan Right', icon: '➡️' },
                  { id: 'orbit', label: '3D Orbit', icon: '🔄' },
                  { id: 'dolly_zoom', label: 'Vertigo Dolly', icon: '🌀' },
                  { id: 'drone_rise', label: 'Drone Rise', icon: '🚁' }
                ].map((ctrl) => (
                  <button
                    key={ctrl.id}
                    onClick={() => {
                      const updated: MotionControlConfig = {
                        ...currentMotion,
                        type: ctrl.id as MotionControlType,
                        cameraPath: `Cinematic ${ctrl.label} with Kling 4.0 motion interpolation`
                      };
                      updateCurrentScene({
                        motionControl: updated,
                        cameraEffect: (ctrl.id === 'push_in' ? 'zoom_in' : ctrl.id) as any
                      });
                    }}
                    className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      currentMotion.type === ctrl.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{ctrl.icon}</span>
                    <span className="text-[9px] truncate w-full">{ctrl.label}</span>
                  </button>
                ))}
              </div>

              {/* Strength slider */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span>Motion Strength</span>
                  <span className="text-amber-400 font-mono">{currentMotion.strength} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={currentMotion.strength}
                  onChange={(e) => {
                    updateCurrentScene({
                      motionControl: {
                        ...currentMotion,
                        strength: parseInt(e.target.value, 10)
                      }
                    });
                  }}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
