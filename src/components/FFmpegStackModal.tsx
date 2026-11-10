import React, { useState, useEffect } from 'react';
import {
  X,
  Terminal,
  Copy,
  Check,
  Play,
  Download,
  Flame,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Video,
  FileCode,
  Sliders,
  Maximize2,
  Shuffle,
  Code2,
  Cpu
} from 'lucide-react';
import { Project } from '../types/studio';

interface FFmpegStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (updates: Partial<Project>) => void;
}

export const FFmpegStackModal: React.FC<FFmpegStackModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<'fluent' | 'cli'>('fluent');

  // Video stream configuration
  const [topVideoSource, setTopVideoSource] = useState<string>(
    'public/assets/aistudio/432b05e8bf95422a4b41e99d1974ad8e_c99ffe77.mp4'
  );
  const [selectedBRoll, setSelectedBRoll] = useState<string>('random');
  const [bottomVideoSource, setBottomVideoSource] = useState<string>('public/samples/minecraft_parkour.mp4');
  const [bottomPresetType, setBottomPresetType] = useState<string>('minecraft_parkour');
  const [crf, setCrf] = useState<number>(18);
  const [preset, setPreset] = useState<string>('veryfast');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [dividerStyle, setDividerStyle] = useState<'neon_glow' | 'minimal_black' | 'laser_line' | 'none'>('neon_glow');

  // Server Render States
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderResult, setRenderResult] = useState<{
    downloadUrl?: string;
    executionTimeMs?: number;
    fileSizeBytes?: number;
    fullCommand?: string;
    randomBRoll?: string;
    method?: string;
  } | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Available server samples and B-roll clips
  const [availableSamples, setAvailableSamples] = useState<Array<{ name: string; path: string; url: string }>>([]);
  const [brollClips, setBrollClips] = useState<Array<{ filename: string; url: string; name: string }>>([
    { filename: 'minecraft_parkour_01.mp4', url: '/assets/broll/minecraft_parkour_01.mp4', name: 'MINECRAFT PARKOUR 01' },
    { filename: 'subway_surfer_01.mp4', url: '/assets/broll/subway_surfer_01.mp4', name: 'SUBWAY SURFER 01' },
    { filename: 'gta_ramp_01.mp4', url: '/assets/broll/gta_ramp_01.mp4', name: 'GTA MEGA RAMP 01' }
  ]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ffmpeg-samples')
        .then((res) => res.json())
        .then((data) => {
          if (data?.samples) {
            setAvailableSamples(data.samples);
          }
        })
        .catch(() => {});

      fetch('/api/broll-clips')
        .then((res) => res.json())
        .then((data) => {
          if (data?.brollClips && data.brollClips.length > 0) {
            setBrollClips(data.brollClips);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const topFileName = topVideoSource.split('/').pop() || 'cinematic_scene.mp4';
  const bottomFileName = bottomVideoSource.split('/').pop() || 'minecraft_parkour.mp4';
  const outputFileName = `tiktok_${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'video'}_vstack.mp4`;

  // Raw CLI Command
  const cliCommand = includeAudio
    ? `ffmpeg -i ${topFileName} -i ${bottomFileName} -filter_complex \\
"[0:v]scale=1080:960,crop=1080:960[top]; \\
 [1:v]scale=1080:960,crop=1080:960[bottom]; \\
 [top][bottom]vstack=inputs=2[v]" \\
 -map "[v]" -map 0:a? -c:v libx264 -crf ${crf} -c:a aac ${outputFileName}`
    : `ffmpeg -i ${topFileName} -i ${bottomFileName} -filter_complex \\
"[0:v]scale=1080:960,crop=1080:960[top]; \\
 [1:v]scale=1080:960,crop=1080:960[bottom]; \\
 [top][bottom]vstack=inputs=2[v]" \\
 -map "[v]" -c:v libx264 -crf ${crf} ${outputFileName}`;

  // Node.js Fluent-FFmpeg Code Snippet
  const fluentCodeSnippet = `const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // To download the video from your AI API

async function compositeTikTokVideo(aiVideoUrl, outputFileName) {
    return new Promise(async (resolve, reject) => {
        
        // 1. Define paths for processing
        const tempAiVideoPath = path.join(__dirname, 'temp_ai_scene.mp4');
        const outputPath = path.join(__dirname, 'outputs', outputFileName);
        
        // 2. Stream B: Pick a random pre-downloaded Minecraft clip from your assets folder
        const bRollFolder = path.join(__dirname, 'assets', 'broll');
        const bRollFiles = fs.readdirSync(bRollFolder).filter(file => file.endsWith('.mp4'));
        const randomBRoll = bRollFiles[Math.floor(Math.random() * bRollFiles.length)];
        const bRollPath = path.join(bRollFolder, randomBRoll);

        try {
            // 3. Download Stream A (The clean AI video) from your API response url
            const response = await axios({
                method: 'GET',
                url: aiVideoUrl,
                responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(tempAiVideoPath);
            response.data.pipe(writer);
            
            await new Promise((res, rej) => {
                writer.on('finish', res);
                writer.on('error', rej);
            });

            // 4. Run FFmpeg to crop, scale, stack, and sync the lengths perfectly
            ffmpeg()
                .input(tempAiVideoPath) // Input 0: The pristine AI video
                .input(bRollPath)       // Input 1: The local Minecraft gameplay
                .filterComplex([
                    // Scale and crop Stream A to fill the top half (1080x960)
                    '[0:v]scale=1080:1920,crop=1080:960:0:480[top]',
                    // Scale and crop Stream B to fill the bottom half (1080x960)
                    '[1:v]scale=1080:1920,crop=1080:960:0:480[bottom]',
                    // Stack them vertically into one 1080x1920 frame
                    '[top][bottom]vstack=inputs=2[v]'
                ])
                .map('[v]')             // Map the newly stacked video stream
                .map('0:a')             // Map the audio from the AI video (Gemini TTS voiceover)
                .outputOptions([
                    '-shortest',        // CRITICAL: Cuts Minecraft clip the exact second AI video ends
                    '-c:v libx264',     // Standard web-safe video codec
                    '-crf 18',          // High visual quality setting
                    '-pix_fmt yuv420p'  // Ensures perfect playback compatibility on mobile/TikTok
                ])
                .output(outputPath)
                .on('end', () => {
                    fs.unlinkSync(tempAiVideoPath);
                    console.log('Successfully generated split-screen video!');
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error('FFmpeg compilation error: ', err);
                    reject(err);
                })
                .run();

        } catch (error) {
            console.error("Failed to process streams:", error);
            reject(error);
        }
    });
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToStudio = () => {
    onUpdateProject({
      splitScreenMode: true,
      splitRatio: '50_50',
      splitScreenType: bottomPresetType as any,
      splitDividerStyle: dividerStyle,
      splitBottomVideoUrl: bottomVideoSource
    });
    onClose();
  };

  // Run fluent-ffmpeg Composite Pipeline
  const handleRunFluentComposite = async () => {
    setIsRendering(true);
    setRenderError(null);
    setRenderResult(null);

    try {
      const preferred = selectedBRoll === 'random' ? undefined : selectedBRoll;
      const res = await fetch('/api/composite-tiktok-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiVideoUrl: topVideoSource,
          outputFileName,
          preferredBRoll: preferred,
          crf,
          preset
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Fluent-FFmpeg composite execution failed');
      }

      setRenderResult({
        downloadUrl: data.downloadUrl,
        executionTimeMs: data.durationMs,
        fileSizeBytes: data.fileSizeBytes,
        randomBRoll: data.randomBRoll,
        method: 'fluent-ffmpeg'
      });
    } catch (err: any) {
      setRenderError(err.message || 'Failed to composite via fluent-ffmpeg');
    } finally {
      setIsRendering(false);
    }
  };

  // Run Raw FFmpeg CLI Render
  const handleRunCliRender = async () => {
    setIsRendering(true);
    setRenderError(null);
    setRenderResult(null);

    try {
      const res = await fetch('/api/ffmpeg-vstack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topVideo: topVideoSource,
          bottomVideo: bottomVideoSource,
          crf,
          preset,
          includeAudio,
          outputName: outputFileName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server FFmpeg CLI render failed');
      }

      setRenderResult({
        downloadUrl: data.downloadUrl,
        executionTimeMs: data.executionTimeMs,
        fileSizeBytes: data.fileSizeBytes,
        fullCommand: data.fullCommand,
        method: 'cli'
      });
    } catch (err: any) {
      setRenderError(err.message || 'Failed to render via FFmpeg');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col gap-5 text-zinc-100 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  FFmpeg Dual-Video Stack Engine
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  1080x1920 (9:16)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Composite AI / Real-Human video on top with Minecraft / gameplay B-Roll on bottom.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('fluent')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'fluent'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Node.js fluent-ffmpeg Pipeline</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
              Auto B-Roll
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Raw FFmpeg CLI Command</span>
          </button>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Layers className="w-4 h-4" />
              Stack Geometry: 1080x960 Top + 1080x960 Bottom
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">Total: 1080 x 1920</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* Top Stream Box */}
            <div className="bg-zinc-950 border border-zinc-700/60 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 font-mono">[0:v] STREAM A (AI Video)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-cyan-950 text-cyan-300 rounded font-mono">1080x960</span>
              </div>
              <div className="text-xs font-semibold text-white truncate">
                {topFileName}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                scale=1080:1920,crop=1080:960:0:480[top]
              </div>
            </div>

            {/* vstack Operator */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shadow">
                +
              </div>
              <span className="text-[10px] font-mono text-zinc-400 mt-1">vstack=inputs=2</span>
              <span className="text-[9px] text-zinc-500 font-mono">-shortest -c:v libx264</span>
            </div>

            {/* Bottom Stream Box */}
            <div className="bg-zinc-950 border border-zinc-700/60 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 font-mono">[1:v] STREAM B (B-Roll)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-300 rounded font-mono">1080x960</span>
              </div>
              <div className="text-xs font-semibold text-white truncate">
                {activeTab === 'fluent'
                  ? selectedBRoll === 'random'
                    ? '🎲 Random B-Roll (assets/broll/)'
                    : selectedBRoll
                  : bottomFileName}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                scale=1080:1920,crop=1080:960:0:480[bottom]
              </div>
            </div>
          </div>
        </div>

        {/* Code Display Box */}
        {activeTab === 'fluent' ? (
          <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-emerald-300 ml-2 font-semibold">
                  compositeTikTokVideo.js — Node.js fluent-ffmpeg Pipeline
                </span>
              </div>

              <button
                onClick={() => handleCopy(fluentCodeSnippet)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Node.js Script</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre select-all max-h-56 overflow-y-auto">
              {fluentCodeSnippet}
            </pre>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-zinc-400 ml-2">bash — FFmpeg CLI Execution</span>
              </div>

              <button
                onClick={() => handleCopy(cliCommand)}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
              {cliCommand}
            </pre>
          </div>
        )}

        {/* Input Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Video Source */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              Stream A (Top Half — AI / Human Video)
            </label>
            <select
              value={topVideoSource}
              onChange={(e) => setTopVideoSource(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="public/assets/aistudio/432b05e8bf95422a4b41e99d1974ad8e_c99ffe77.mp4">
                👤 Real Human Creator Video (Uploaded MP4)
              </option>
              <option value="public/samples/cinematic_scene.mp4">
                🎬 Cinematic Scene Sample (cinematic_scene.mp4)
              </option>
              {availableSamples
                .filter((s) => s.path !== 'public/assets/aistudio/432b05e8bf95422a4b41e99d1974ad8e_c99ffe77.mp4')
                .map((s) => (
                  <option key={s.path} value={s.path}>
                    {s.name}
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-zinc-400">
              Center-cropped via <code className="text-emerald-400">crop=1080:960:0:480</code> to maintain subject focus.
            </p>
          </div>

          {/* Bottom Stream / B-Roll Controls */}
          {activeTab === 'fluent' ? (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Stream B (Bottom Half B-Roll Clip)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">assets/broll/</span>
              </label>

              <select
                value={selectedBRoll}
                onChange={(e) => setSelectedBRoll(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="random">🎲 Random Pick from assets/broll/ (Automatic)</option>
                {brollClips.map((clip) => (
                  <option key={clip.filename} value={clip.filename}>
                    {clip.filename} ({clip.name})
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <button
                  onClick={() => setSelectedBRoll('random')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedBRoll === 'random'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Randomizer</span>
                </button>
                {brollClips.map((c) => (
                  <button
                    key={c.filename}
                    onClick={() => setSelectedBRoll(c.filename)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      selectedBRoll === c.filename
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {c.filename.replace('_01.mp4', '')}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Stream B (Bottom CLI Video Input)
              </label>
              <select
                value={bottomVideoSource}
                onChange={(e) => {
                  setBottomVideoSource(e.target.value);
                  if (e.target.value.includes('minecraft')) setBottomPresetType('minecraft_parkour');
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="public/samples/minecraft_parkour.mp4">
                  🧱 Minecraft Parkour 3D (minecraft_parkour.mp4)
                </option>
                {availableSamples
                  .filter((s) => s.path !== topVideoSource)
                  .map((s) => (
                    <option key={s.path} value={s.path}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Quality & Audio Settings */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">Quality (CRF): {crf}</span>
              <span className="text-[10px] text-zinc-400">
                {crf <= 18 ? 'Lossless Master (-crf 18)' : 'Compressed'}
              </span>
            </div>
            <input
              type="range"
              min={14}
              max={28}
              value={crf}
              onChange={(e) => setCrf(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Encoding Speed Preset</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-white cursor-pointer"
            >
              <option value="ultrafast">ultrafast (Instant preview)</option>
              <option value="veryfast">veryfast (Recommended balance)</option>
              <option value="fast">fast (Slightly smaller size)</option>
              <option value="medium">medium (Standard master)</option>
            </select>
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span>Keep Story Audio (-map 0:a?)</span>
            </label>
            <p className="text-[10px] text-zinc-400">
              Syncs with AI Gemini TTS voiceover narration.
            </p>
          </div>
        </div>

        {/* Server Render Result / Progress */}
        {isRendering && (
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs text-emerald-300 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>
              {activeTab === 'fluent'
                ? 'Running fluent-ffmpeg composite: downloading AI video stream, selecting B-roll, and vstacking...'
                : 'Executing FFmpeg on server: scaling to 1080:960, cropping, and vstacking to 1080x1920...'}
            </span>
          </div>
        )}

        {renderError && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Execution Error</div>
              <p className="mt-0.5 text-rose-200">{renderError}</p>
            </div>
          </div>
        )}

        {renderResult && renderResult.downloadUrl && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  1080x1920 Video Successfully Rendered!
                  {renderResult.randomBRoll && (
                    <span className="text-zinc-300 ml-1.5 font-mono text-[11px]">
                      (B-Roll: {renderResult.randomBRoll})
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Rendered in {((renderResult.executionTimeMs || 0) / 1000).toFixed(1)}s •{' '}
                {((renderResult.fileSizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-[120px] aspect-[9/16] rounded-xl overflow-hidden border border-zinc-700 bg-black shrink-0 shadow-lg">
                <video
                  src={renderResult.downloadUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <a
                  href={renderResult.downloadUrl}
                  download={outputFileName}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Stacked Video ({outputFileName})</span>
                </a>
                <p className="text-[11px] text-zinc-400">
                  Ready to post directly to TikTok, Instagram Reels, and YouTube Shorts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          <button
            onClick={handleApplyToStudio}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span>Apply 50/50 Split to Studio Player</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            {activeTab === 'fluent' ? (
              <button
                onClick={handleRunFluentComposite}
                disabled={isRendering}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Code2 className="w-4 h-4" />
                <span>Run Fluent-FFmpeg Composite</span>
              </button>
            ) : (
              <button
                onClick={handleRunCliRender}
                disabled={isRendering}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Terminal className="w-4 h-4" />
                <span>Run FFmpeg CLI on Server</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
