import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Camera,
  Film,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Eye,
  Video
} from 'lucide-react';
import {
  ImageGenModelType,
  MotionControlConfig,
  MotionControlType,
  Project,
  Scene,
  VideoGenModelType
} from '../types/studio';

interface CinematicPipelineSectionProps {
  scene: Scene;
  project: Project;
  onUpdateScene: (updatedFields: Partial<Scene>) => void;
  onOpenFullPipelineModal?: () => void;
}

export const CinematicPipelineSection: React.FC<CinematicPipelineSectionProps> = ({
  scene,
  project,
  onUpdateScene,
  onOpenFullPipelineModal
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpandingPrompt, setIsExpandingPrompt] = useState(false);
  const [isGeneratingFrame, setIsGeneratingFrame] = useState(false);
  const [isSynthesizingMotion, setIsSynthesizingMotion] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(
    scene.motionVideoUrl || scene.motionControl ? 4 : scene.keyframeImageUrl || scene.imageUrl ? 3 : scene.expandedPrompt ? 2 : 1
  );

  // 1. Trigger Hidden Prompt-Expansion Layer (LLM)
  const handleExpandPrompt = async () => {
    setIsExpandingPrompt(true);
    try {
      const response = await fetch('/api/expand-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narration: scene.narration,
          topic: project.title,
          visualDescription: scene.visualDescription,
          format: project.format,
          tone: project.tone,
          actorPersona: project.actorPersona,
          characterName: project.characterName
        })
      });

      const data = await response.json();
      if (data.expandedPrompt) {
        onUpdateScene({
          expandedPrompt: data.expandedPrompt,
          promptExpansionDetails: data.promptExpansionDetails,
          motionControl: data.motionControl || {
            type: (scene.cameraEffect as MotionControlType) || 'zoom_in',
            strength: 6,
            cameraPath: 'Smooth cinematic push-in (1.18x) with subtle vertical stabilization',
            fps: 60
          },
          pipelineStatus: 'ready'
        });
        setActiveStep(2);
      }
    } catch (err) {
      console.error('Prompt expansion error:', err);
    } finally {
      setIsExpandingPrompt(false);
    }
  };

  // 2. Trigger Image Gen Model (Flux / Midjourney)
  const handleGenerateFrame = async (model: ImageGenModelType = 'flux_1') => {
    setIsGeneratingFrame(true);
    try {
      const promptToUse = scene.expandedPrompt || scene.visualDescription || scene.narration;
      const response = await fetch('/api/generate-flawless-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.visualDescription,
          expandedPrompt: promptToUse,
          model,
          format: project.format,
          seed: Math.floor(Math.random() * 999999)
        })
      });

      const data = await response.json();
      if (data.imageUrl) {
        onUpdateScene({
          imageUrl: data.imageUrl,
          keyframeImageUrl: data.imageUrl,
          imageGenModel: model,
          pipelineStatus: 'ready'
        });
        setActiveStep(3);
      }
    } catch (err) {
      console.error('Frame generation error:', err);
    } finally {
      setIsGeneratingFrame(false);
    }
  };

  // 3. Trigger Video Gen API (Kling 4.0 / Runway Gen-3 Motion Control)
  const handleSynthesizeMotion = async (videoModel: VideoGenModelType = 'kling_4') => {
    setIsSynthesizingMotion(true);
    try {
      const motionConfig = scene.motionControl || {
        type: (scene.cameraEffect as MotionControlType) || 'zoom_in',
        strength: 6,
        cameraPath: 'Smooth cinematic push-in (1.18x) with Kling 4.0 motion interpolation',
        fps: 60
      };

      const response = await fetch('/api/synthesize-video-motion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyframeImageUrl: scene.keyframeImageUrl || scene.imageUrl,
          motionControl: motionConfig,
          durationSec: scene.durationSec,
          model: videoModel
        })
      });

      const data = await response.json();
      if (data.success) {
        onUpdateScene({
          videoGenModel: videoModel,
          motionControl: motionConfig,
          cameraEffect: (motionConfig.type === 'push_in' ? 'zoom_in' : motionConfig.type === 'handheld' ? 'shake' : motionConfig.type) as any,
          pipelineStatus: 'ready'
        });
        setActiveStep(4);
      }
    } catch (err) {
      console.error('Motion synthesis error:', err);
    } finally {
      setIsSynthesizingMotion(false);
    }
  };

  // 4. One-Click Full Pipeline Run (Voiceover ➔ LLM ➔ Flux ➔ Kling 4.0)
  const handleRunFullPipeline = async () => {
    setIsExpandingPrompt(true);
    try {
      // Step 2: Expand Prompt via LLM
      const expRes = await fetch('/api/expand-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narration: scene.narration,
          topic: project.title,
          visualDescription: scene.visualDescription,
          format: project.format,
          tone: project.tone,
          actorPersona: project.actorPersona,
          characterName: project.characterName
        })
      });
      const expData = await expRes.json();
      const expandedPrompt = expData.expandedPrompt || scene.visualDescription || scene.narration;

      setIsExpandingPrompt(false);
      setIsGeneratingFrame(true);

      // Step 3: Generate Flawless Frame with Flux.1
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

      setIsGeneratingFrame(false);
      setIsSynthesizingMotion(true);

      // Step 4: Synthesize Motion with Kling 4.0
      const motionConfig = expData.motionControl || {
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
          durationSec: scene.durationSec,
          model: 'kling_4'
        })
      });

      onUpdateScene({
        expandedPrompt,
        promptExpansionDetails: expData.promptExpansionDetails,
        imageUrl: frameData.imageUrl,
        keyframeImageUrl: frameData.imageUrl,
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: motionConfig,
        cameraEffect: 'zoom_in',
        pipelineStatus: 'ready'
      });
      setActiveStep(4);
    } catch (err) {
      console.error('Full pipeline error:', err);
    } finally {
      setIsExpandingPrompt(false);
      setIsGeneratingFrame(false);
      setIsSynthesizingMotion(false);
    }
  };

  const currentMotion = scene.motionControl || {
    type: (scene.cameraEffect as MotionControlType) || 'zoom_in',
    strength: 6,
    cameraPath: 'Smooth cinematic push-in (1.18x) with Kling 4.0 motion interpolation',
    fps: 60
  };

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-violet-500/30 rounded-2xl p-3.5 shadow-xl flex flex-col gap-3">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Cinematic Video Pipeline
              </h4>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Flux + Kling 4.0
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Voiceover ➔ Hidden LLM Expansion ➔ Flux Static Frame ➔ Kling Motion Video
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRunFullPipeline}
            disabled={isExpandingPrompt || isGeneratingFrame || isSynthesizingMotion}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            title="Execute entire 4-stage pipeline automatically"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span className="hidden sm:inline">
              {isExpandingPrompt
                ? 'Expanding...'
                : isGeneratingFrame
                ? 'Flux Frame...'
                : isSynthesizingMotion
                ? 'Kling Motion...'
                : '1-Click Pipeline'}
            </span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Flowchart Pills */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 border border-zinc-800/80 rounded-xl text-[10px] font-bold">
        <button
          onClick={() => setActiveStep(1)}
          className={`py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeStep === 1
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500/30 text-rose-300 text-[9px] flex items-center justify-center font-mono">1</span>
          <span className="truncate">Voiceover</span>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeStep === 2
              ? 'bg-violet-950/70 text-violet-300 shadow-sm border border-violet-700/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-violet-500/30 text-violet-300 text-[9px] flex items-center justify-center font-mono">2</span>
          <span className="truncate">LLM Expand</span>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeStep === 3
              ? 'bg-cyan-950/70 text-cyan-300 shadow-sm border border-cyan-700/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-cyan-500/30 text-cyan-300 text-[9px] flex items-center justify-center font-mono">3</span>
          <span className="truncate">Flux Frame</span>
        </button>

        <button
          onClick={() => setActiveStep(4)}
          className={`py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeStep === 4
              ? 'bg-amber-950/70 text-amber-300 shadow-sm border border-amber-700/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500/30 text-amber-300 text-[9px] flex items-center justify-center font-mono">4</span>
          <span className="truncate">Kling Motion</span>
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3 pt-1">
          {/* STAGE 1: Spoken Voiceover Script */}
          {activeStep === 1 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span>🎙️</span> [Stage 1] Spoken Voiceover Script
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {scene.narration.trim().split(/\s+/).length} words • {scene.durationSec.toFixed(1)}s
                </span>
              </div>
              <p className="text-xs text-white bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed font-sans">
                "{scene.narration || 'No spoken text specified for this scene.'}"
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-zinc-400">Next: Feed to Hollywood Prompt-Expansion LLM</span>
                <button
                  onClick={handleExpandPrompt}
                  disabled={isExpandingPrompt}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{isExpandingPrompt ? 'Expanding...' : 'Expand Prompt (LLM)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: Hidden Prompt-Expansion Layer (LLM) */}
          {activeStep === 2 && (
            <div className="bg-zinc-950 border border-violet-500/30 rounded-xl p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-violet-400">
                  <Sparkles className="w-3.5 h-3.5" /> [Stage 2] Hidden Prompt-Expansion Layer (Gemini LLM)
                </span>
                <button
                  onClick={handleExpandPrompt}
                  disabled={isExpandingPrompt}
                  className="text-[10px] text-violet-300 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-expand</span>
                </button>
              </div>

              {scene.expandedPrompt ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 text-[11px] text-zinc-200 leading-relaxed font-mono select-all">
                    {scene.expandedPrompt}
                  </div>

                  {scene.promptExpansionDetails && (
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                        <span className="text-zinc-500 font-bold block">CAMERA & LENS:</span>
                        <span className="text-zinc-300 font-mono">{scene.promptExpansionDetails.cinematography}</span>
                      </div>
                      <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                        <span className="text-zinc-500 font-bold block">LIGHTING:</span>
                        <span className="text-zinc-300">{scene.promptExpansionDetails.lighting}</span>
                      </div>
                      <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                        <span className="text-zinc-500 font-bold block">COLOR SCIENCE:</span>
                        <span className="text-zinc-300">{scene.promptExpansionDetails.colorGrading}</span>
                      </div>
                      <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                        <span className="text-zinc-500 font-bold block">ATMOSPHERE:</span>
                        <span className="text-zinc-300">{scene.promptExpansionDetails.atmosphere}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-400">Next: Feed to Flux.1 / Midjourney Model</span>
                    <button
                      onClick={() => handleGenerateFrame(scene.imageGenModel || 'flux_1')}
                      disabled={isGeneratingFrame}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>{isGeneratingFrame ? 'Generating Frame...' : 'Generate Flux Keyframe'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 flex flex-col items-center gap-2">
                  <p className="text-xs text-zinc-400">
                    No expanded cinematography prompt yet. Run the LLM expansion engine to transform spoken script into a Hollywood director's prompt.
                  </p>
                  <button
                    onClick={handleExpandPrompt}
                    disabled={isExpandingPrompt}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer shadow-md shadow-violet-600/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isExpandingPrompt ? 'Expanding Prompt...' : 'Run LLM Prompt-Expansion'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: Image Gen Model (Flux / Midjourney) */}
          {activeStep === 3 && (
            <div className="bg-zinc-950 border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Camera className="w-3.5 h-3.5" /> [Stage 3] Image Gen Model (Flux.1 / Midjourney v6)
                </span>
                <div className="flex items-center gap-1 text-[10px]">
                  {(['flux_1', 'midjourney_v6'] as ImageGenModelType[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleGenerateFrame(m)}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        (scene.imageGenModel || 'flux_1') === m
                          ? 'bg-cyan-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m === 'flux_1' ? 'Flux.1' : 'Midjourney v6'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Static Frame Preview Container */}
              <div className="flex items-center gap-3 p-2 bg-zinc-900/90 border border-zinc-800 rounded-xl">
                <div className="w-16 h-28 rounded-lg overflow-hidden border border-zinc-700 bg-black shrink-0 relative group">
                  <img
                    src={scene.keyframeImageUrl || scene.imageUrl || ''}
                    alt="Static Frame"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[9px] text-white font-bold bg-black/80 px-1.5 py-0.5 rounded">
                      9:16 Frame
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Flawless Static Keyframe Ready</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2">
                    {scene.expandedPrompt || scene.visualDescription}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                      Model: {scene.imageGenModel === 'midjourney_v6' ? 'Midjourney v6.1' : 'Flux.1 Pro'}
                    </span>
                    <button
                      onClick={() => handleGenerateFrame(scene.imageGenModel || 'flux_1')}
                      disabled={isGeneratingFrame}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {isGeneratingFrame ? 'Generating...' : 'Regenerate Frame'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-zinc-400">Next: Merge with Kling 4.0 UI Motion Control</span>
                <button
                  onClick={() => handleSynthesizeMotion(scene.videoGenModel || 'kling_4')}
                  disabled={isSynthesizingMotion}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer"
                >
                  <Video className="w-3 h-3" />
                  <span>{isSynthesizingMotion ? 'Synthesizing...' : 'Apply Kling 4.0 Motion'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: Video Gen API (Kling 4.0 / Runway Gen-3 Motion Control) */}
          {activeStep === 4 && (
            <div className="bg-zinc-950 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Film className="w-3.5 h-3.5" /> [Stage 4] Video Gen API (Kling 4.0 / Runway Gen-3)
                </span>
                <div className="flex items-center gap-1 text-[10px]">
                  {(['kling_4', 'runway_gen3'] as VideoGenModelType[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleSynthesizeMotion(m)}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        (scene.videoGenModel || 'kling_4') === m
                          ? 'bg-amber-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m === 'kling_4' ? 'Kling 4.0' : 'Runway Gen-3'}
                    </button>
                  ))}
                </div>
              </div>

              {/* UI Motion Controls Grid */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-zinc-300 flex items-center justify-between">
                  <span>UI Motion Control Trajectory</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Mode: {currentMotion.type.replace('_', ' ').toUpperCase()}
                  </span>
                </label>

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
                        const updatedMotion: MotionControlConfig = {
                          ...currentMotion,
                          type: ctrl.id as MotionControlType,
                          cameraPath: `Cinematic ${ctrl.label} with Kling 4.0 motion interpolation`
                        };
                        onUpdateScene({
                          motionControl: updatedMotion,
                          cameraEffect: (ctrl.id === 'push_in' ? 'zoom_in' : ctrl.id) as any
                        });
                      }}
                      className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                        currentMotion.type === ctrl.id
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-sm">{ctrl.icon}</span>
                      <span className="text-[9px] truncate w-full">{ctrl.label}</span>
                    </button>
                  ))}
                </div>

                {/* Motion Strength Slider */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Motion Control Strength
                    </span>
                    <span className="text-xs font-black text-amber-400">{currentMotion.strength} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={currentMotion.strength}
                    onChange={(e) => {
                      const strength = parseInt(e.target.value, 10);
                      onUpdateScene({
                        motionControl: {
                          ...currentMotion,
                          strength
                        }
                      });
                    }}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex items-center justify-between text-[9px] text-zinc-500">
                    <span>Subtle Micro-Movement</span>
                    <span>Standard Cinematic</span>
                    <span>Aggressive Kinetic</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Merged Keyframe + UI Motion Control Ready</span>
                  </div>
                  <button
                    onClick={() => handleSynthesizeMotion(scene.videoGenModel || 'kling_4')}
                    disabled={isSynthesizingMotion}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{isSynthesizingMotion ? 'Simulating...' : 'Test Motion Preview'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
