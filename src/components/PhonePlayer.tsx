import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize2,
  Gauge,
  Film,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project, Scene } from '../types/studio';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { audioEngine } from '../utils/audioEngine';

interface PhonePlayerProps {
  project: Project;
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
  showTikTokOverlay: boolean;
  onToggleTikTokOverlay: () => void;
  onUpdateProject?: (updated: Partial<Project>) => void;
}

export const PhonePlayer: React.FC<PhonePlayerProps> = ({
  project,
  selectedSceneIndex,
  onSelectScene,
  showTikTokOverlay,
  onToggleTikTokOverlay,
  onUpdateProject
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Calculate total duration
  const totalDuration = project.scenes.reduce((acc, s) => acc + s.durationSec, 0);

  // Tracking animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const activeSceneIndexRef = useRef(selectedSceneIndex);
  const sceneElapsedRef = useRef(0);
  const totalElapsedRef = useRef(0);

  activeSceneIndexRef.current = selectedSceneIndex;

  // Initialize renderer once
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      const rend = new CanvasRenderer(canvasRef.current);
      rend.onImageLoaded = () => {
        renderCurrentState();
      };
      rendererRef.current = rend;
    }
  }, []);

  // Update Volumes when project settings change
  useEffect(() => {
    if (isMuted) {
      audioEngine.setVolumes(0, 0);
    } else {
      audioEngine.setVolumes(project.bgmVolume, project.voiceVolume);
    }
  }, [isMuted, project.bgmVolume, project.voiceVolume]);

  // Play audio / speech for the active scene
  const triggerSceneAudio = useCallback(
    (scene: Scene) => {
      if (isMuted) return;
      audioEngine.init();

      // Play SFX
      audioEngine.playSFX(scene.soundEffectCue);

      // Play voiceover
      if (scene.audioUrl) {
        audioEngine.playVoiceClip(scene.audioUrl);
      } else {
        audioEngine.speakFallback(scene.narration, project.voiceSpeaker);
      }
    },
    [isMuted, project.voiceSpeaker]
  );

  // Render static frame when paused or when scene changes
  const renderCurrentState = useCallback(() => {
    if (!rendererRef.current || !project.scenes[selectedSceneIndex]) return;
    const currentScene = project.scenes[selectedSceneIndex];

    rendererRef.current.render({
      scene: currentScene,
      sceneTime: sceneElapsedRef.current,
      sceneProgress: Math.min(1, sceneElapsedRef.current / currentScene.durationSec),
      project,
      showTikTokOverlay,
      totalTime: totalElapsedRef.current
    });
  }, [project, selectedSceneIndex, showTikTokOverlay]);

  // Initial draw & re-render on project changes
  useEffect(() => {
    if (!isPlaying) {
      renderCurrentState();
    }
  }, [renderCurrentState, isPlaying, project, selectedSceneIndex, showTikTokOverlay]);

  // Preload image for currently selected scene
  useEffect(() => {
    const sc = project.scenes[selectedSceneIndex];
    if (sc?.imageUrl && rendererRef.current) {
      rendererRef.current.preloadImage(sc.imageUrl);
    }
  }, [selectedSceneIndex, project]);

  // Handle Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
      audioEngine.stopBGM();
      audioEngine.stopAllSpeech();
      return;
    }

    // Start BGM on play
    if (!isMuted) {
      audioEngine.startBGM(project.bgmTrack);
    }

    // Trigger audio for current starting scene
    const initialScene = project.scenes[activeSceneIndexRef.current];
    if (initialScene && sceneElapsedRef.current === 0) {
      triggerSceneAudio(initialScene);
    }

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = ((time - lastTimeRef.current) / 1000) * playbackSpeed;
      lastTimeRef.current = time;

      sceneElapsedRef.current += delta;
      totalElapsedRef.current += delta;
      setCurrentTime(totalElapsedRef.current);

      const currentIdx = activeSceneIndexRef.current;
      const currentScene = project.scenes[currentIdx];

      if (!currentScene) {
        setIsPlaying(false);
        return;
      }

      const sceneDuration = currentScene.durationSec;
      const sceneProgress = Math.min(1, sceneElapsedRef.current / sceneDuration);

      if (rendererRef.current) {
        rendererRef.current.render({
          scene: currentScene,
          sceneTime: sceneElapsedRef.current,
          sceneProgress,
          project,
          showTikTokOverlay,
          totalTime: totalElapsedRef.current
        });
      }

      // Check if scene finished
      if (sceneElapsedRef.current >= sceneDuration) {
        if (currentIdx < project.scenes.length - 1) {
          // Advance to next scene
          const nextIdx = currentIdx + 1;
          activeSceneIndexRef.current = nextIdx;
          sceneElapsedRef.current = 0;
          onSelectScene(nextIdx);

          const nextScene = project.scenes[nextIdx];
          triggerSceneAudio(nextScene);
        } else {
          // Reached end of video: loop or stop
          sceneElapsedRef.current = 0;
          totalElapsedRef.current = 0;
          activeSceneIndexRef.current = 0;
          onSelectScene(0);
          const firstScene = project.scenes[0];
          triggerSceneAudio(firstScene);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      audioEngine.stopBGM();
      audioEngine.stopAllSpeech();
    };
  }, [isPlaying, playbackSpeed, project, showTikTokOverlay, triggerSceneAudio, onSelectScene, isMuted]);

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    audioEngine.init();
    setIsPlaying((prev) => !prev);
  };

  // Reset to Beginning
  const handleRestart = () => {
    sceneElapsedRef.current = 0;
    totalElapsedRef.current = 0;
    setCurrentTime(0);
    onSelectScene(0);
    renderCurrentState();
  };

  // Scrub timeline to specific total seconds
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTotalSec = parseFloat(e.target.value);
    totalElapsedRef.current = targetTotalSec;
    setCurrentTime(targetTotalSec);

    let accum = 0;
    for (let i = 0; i < project.scenes.length; i++) {
      const dur = project.scenes[i].durationSec;
      if (targetTotalSec <= accum + dur || i === project.scenes.length - 1) {
        onSelectScene(i);
        sceneElapsedRef.current = Math.max(0, targetTotalSec - accum);
        break;
      }
      accum += dur;
    }

    renderCurrentState();
  };

  // Fullscreen toggle for phone canvas
  const handleToggleFullscreen = () => {
    if (!canvasRef.current) return;
    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 select-none">
      {/* Visual Format Toggle: AI Movie Mode vs Split-Screen B-Roll Mode */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl mb-3 shadow-lg">
        <button
          onClick={() => onUpdateProject?.({ splitScreenMode: false })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !project.splitScreenMode
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Full 9:16 Cinematic AI Movie & Visual Story"
        >
          <Film className="w-3.5 h-3.5" />
          <span>Full Cinema Movie</span>
        </button>

        <button
          onClick={() => onUpdateProject?.({ splitScreenMode: true })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            project.splitScreenMode
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Viral TikTok/Shorts Split-Screen (AI Story on Top, Parkour B-Roll on Bottom)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Split-Screen B-Roll</span>
        </button>

        {project.splitScreenMode && (
          <select
            value={project.splitScreenType || 'minecraft_parkour'}
            onChange={(e) =>
              onUpdateProject?.({
                splitScreenType: e.target.value as any
              })
            }
            className="bg-zinc-950 border border-zinc-700 text-amber-300 rounded-xl px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer"
          >
            <option value="minecraft_parkour">🧱 Minecraft Parkour</option>
            <option value="neon_grid">🌆 Neon Synthwave Grid</option>
            <option value="satisfying_sand">🌀 Kinetic Rainbow Sand</option>
          </select>
        )}
      </div>

      {/* 9:16 Smartphone Mockup Frame */}
      <div className="relative group/phone">
        {/* Glow ambient aura behind phone */}
        <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/15 via-violet-500/15 to-amber-500/15 rounded-[48px] blur-xl -z-10 transition-all group-hover/phone:opacity-100 opacity-75" />

        {/* Smartphone Shell with Realistic Bezel */}
        <div className="relative w-[280px] xs:w-[310px] sm:w-[335px] aspect-[9/16] bg-zinc-950 rounded-[42px] p-2.5 shadow-2xl border-4 border-zinc-800/80 ring-1 ring-white/10 overflow-hidden flex flex-col">
          {/* Top Speaker & Dynamic Island Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2 border border-zinc-800/60 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
          </div>

          {/* Internal 9:16 Canvas Viewport */}
          <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleTogglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Play/Pause Overlay Indicator on Click */}
            {!isPlaying && (
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Click to play"
              >
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </button>
            )}

            {/* Current Scene Badge Indicator */}
            <div className="absolute top-10 left-3 z-20 pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30">
                Scene {selectedSceneIndex + 1}/{project.scenes.length}
              </span>
            </div>

            {/* TikTok Overlay Pill Status */}
            {showTikTokOverlay && (
              <div className="absolute top-10 right-3 z-20 pointer-events-none">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600/70 backdrop-blur-md text-white border border-rose-400/30">
                  TikTok Overlay
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Player Control Toolbar */}
      <div className="w-full max-w-[360px] sm:max-w-[420px] mt-4 flex flex-col gap-2.5 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3 backdrop-blur-md shadow-xl">
        {/* Scrub Slider & Time Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span className="text-zinc-500 font-mono">
              Scene {selectedSceneIndex + 1}: {project.scenes[selectedSceneIndex]?.cameraEffect.replace('_', ' ')}
            </span>
            <span>{formatTime(totalDuration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(1, totalDuration)}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Prev Scene */}
          <button
            onClick={() => {
              if (selectedSceneIndex > 0) {
                onSelectScene(selectedSceneIndex - 1);
                sceneElapsedRef.current = 0;
              }
            }}
            disabled={selectedSceneIndex === 0}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
            title="Previous scene"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play video preview'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>

          {/* Next Scene */}
          <button
            onClick={() => {
              if (selectedSceneIndex < project.scenes.length - 1) {
                onSelectScene(selectedSceneIndex + 1);
                sceneElapsedRef.current = 0;
              }
            }}
            disabled={selectedSceneIndex === project.scenes.length - 1}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
            title="Next scene"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Toggle (1x, 1.25x, 1.5x) */}
          <button
            onClick={() => {
              const speeds = [1.0, 1.25, 1.5];
              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              setPlaybackSpeed(speeds[nextIdx]);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-zinc-800/80 hover:bg-zinc-800 text-[11px] font-bold text-zinc-300 hover:text-white rounded-md transition-colors cursor-pointer"
            title="Change Playback Speed"
          >
            <Gauge className="w-3 h-3 text-rose-400" />
            <span>{playbackSpeed}x</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Safe Zone / TikTok Overlay Toggle */}
          <button
            onClick={onToggleTikTokOverlay}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showTikTokOverlay
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Toggle TikTok Safe Zone Guides"
          >
            {showTikTokOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Fullscreen Canvas"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* TikTok Viral Enhancements Bar */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs gap-1.5 flex-wrap">
          {/* Split Screen Toggle & Type */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (onUpdateProject) {
                  const nextSplit = !project.splitScreenMode;
                  onUpdateProject({
                    splitScreenMode: nextSplit,
                    splitScreenType: project.splitScreenType || 'minecraft_parkour',
                    captionYPercent: nextSplit ? 52 : 68
                  });
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                project.splitScreenMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50'
              }`}
              title="Toggle TikTok viral split-screen with satisfying gameplay"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Split-Screen B-Roll</span>
            </button>

            {project.splitScreenMode && onUpdateProject && (
              <select
                value={project.splitScreenType || 'minecraft_parkour'}
                onChange={(e) => {
                  onUpdateProject({ splitScreenType: e.target.value as any });
                }}
                className="bg-zinc-800 text-[10px] font-bold text-amber-200 border border-amber-500/30 rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                <option value="minecraft_parkour">⛏️ Parkour</option>
                <option value="subway_surfer">🛹 Subway Surfer</option>
                <option value="gta_ramp">🏎️ GTA Ramp</option>
                <option value="satisfying_soap">🧼 Soap Cutting</option>
              </select>
            )}
          </div>

          {/* Reaction Avatar Toggle */}
          <button
            onClick={() => {
              if (onUpdateProject) {
                const nextAvatar = project.characterAvatar ? undefined : 'sir_reginald';
                onUpdateProject({
                  characterAvatar: nextAvatar,
                  cartoonStyle: nextAvatar ? (project.cartoonStyle || 'pixar_3d') : project.cartoonStyle
                });
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              project.characterAvatar
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/10'
                : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50'
            }`}
            title="Toggle talking cartoon character reaction overlay"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>{project.characterAvatar ? 'Avatar: ON' : 'Avatar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
