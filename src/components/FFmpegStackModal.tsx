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
  Maximize2
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
  const [topVideoSource, setTopVideoSource] = useState<string>('public/samples/cinematic_scene.mp4');
  const [bottomVideoSource, setBottomVideoSource] = useState<string>('public/samples/minecraft_parkour.mp4');
  const [bottomPresetType, setBottomPresetType] = useState<string>('minecraft_parkour');
  const [crf, setCrf] = useState<number>(18);
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
  } | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Available server samples
  const [availableSamples, setAvailableSamples] = useState<Array<{ name: string; path: string; url: string }>>([]);

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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const topFileName = topVideoSource.split('/').pop() || 'cinematic_scene.mp4';
  const bottomFileName = bottomVideoSource.split('/').pop() || 'minecraft_parkour.mp4';
  const outputFileName = `tiktok_${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'video'}_vstack.mp4`;

  // Exact CLI command
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

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(cliCommand);
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

  const handleRunServerRender = async () => {
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
          preset: 'veryfast',
          includeAudio,
          outputName: outputFileName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server FFmpeg render failed');
      }

      setRenderResult({
        downloadUrl: data.downloadUrl,
        executionTimeMs: data.executionTimeMs,
        fileSizeBytes: data.fileSizeBytes,
        fullCommand: data.fullCommand
      });
    } catch (err: any) {
      setRenderError(err.message || 'Failed to render via FFmpeg');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col gap-6 text-zinc-100 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  FFmpeg 1080:960 Dual-Video Stack
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  vstack=inputs=2
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generate 1080x1920 (9:16) viral videos by vertically stacking cinematic story with Minecraft Parkour gameplay.
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

        {/* Visual Architecture Diagram */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Layers className="w-4 h-4" />
              Vertical Dual-Stack Architecture
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">1080 x 1920 Total Resolution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* Top Stream Box */}
            <div className="bg-zinc-950 border border-zinc-700/60 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 font-mono">[0:v] TOP STREAM</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-cyan-950 text-cyan-300 rounded font-mono">1080 x 960</span>
              </div>
              <div className="text-xs font-semibold text-white truncate">
                {topFileName}
              </div>
              <div className="text-[11px] text-zinc-400">
                scale=1080:960,crop=1080:960
              </div>
            </div>

            {/* vstack Operator */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shadow">
                +
              </div>
              <span className="text-[10px] font-mono text-zinc-400 mt-1">vstack=inputs=2</span>
            </div>

            {/* Bottom Stream Box */}
            <div className="bg-zinc-950 border border-zinc-700/60 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 font-mono">[1:v] BOTTOM STREAM</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-300 rounded font-mono">1080 x 960</span>
              </div>
              <div className="text-xs font-semibold text-white truncate">
                {bottomFileName}
              </div>
              <div className="text-[11px] text-zinc-400">
                scale=1080:960,crop=1080:960
              </div>
            </div>
          </div>
        </div>

        {/* FFmpeg Command Terminal Display */}
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
              onClick={handleCopyCommand}
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

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Video Input */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              Top Video Input ([0:v] 1080x960)
            </label>
            <select
              value={topVideoSource}
              onChange={(e) => setTopVideoSource(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="public/samples/cinematic_scene.mp4">
                🎬 Cinematic Scene Sample (cinematic_scene.mp4)
              </option>
              {availableSamples.map((s) => (
                <option key={s.path} value={s.path}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-400">
              The AI cinematic scene or real-human video cropped & scaled to top half.
            </p>
          </div>

          {/* Bottom Video Input */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Bottom Video Input ([1:v] 1080x960)
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

            {/* Quick Live Gameplay Presets */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                { id: 'minecraft_parkour', label: '🧱 Minecraft' },
                { id: 'subway_surfer', label: '🛹 Subway' },
                { id: 'gta_ramp', label: '🏎️ GTA Ramp' },
                { id: 'satisfying_sand', label: '🧼 ASMR Sand' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBottomPresetType(b.id);
                    if (b.id === 'minecraft_parkour') {
                      setBottomVideoSource('public/samples/minecraft_parkour.mp4');
                    }
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    bottomPresetType === b.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Encoding Settings & Divider Options */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* CRF Quality Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">Quality (CRF): {crf}</span>
              <span className="text-[10px] text-zinc-400">
                {crf <= 18 ? 'Lossless Master' : 'Compressed'}
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

          {/* Divider Style */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Divider Cut Style</label>
            <select
              value={dividerStyle}
              onChange={(e) => setDividerStyle(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-white cursor-pointer"
            >
              <option value="neon_glow">🌈 Neon Glow Badge</option>
              <option value="minimal_black">⬛ Minimal Stitch (Raw vstack)</option>
              <option value="laser_line">⚡ Cyan Laser Beam</option>
              <option value="none">Seamless (No Border)</option>
            </select>
          </div>

          {/* Audio Mapping Option */}
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
              Preserves narration voiceover and sound effects from top video.
            </p>
          </div>
        </div>

        {/* Server Render Result / Progress */}
        {isRendering && (
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs text-emerald-300 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>
              Executing FFmpeg on server: scaling to 1080:960, cropping, and vstacking to 1080x1920...
            </span>
          </div>
        )}

        {renderError && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold text-white">FFmpeg Execution Error</div>
              <p className="mt-0.5 text-rose-200">{renderError}</p>
            </div>
          </div>
        )}

        {renderResult && renderResult.downloadUrl && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>1080x1920 Video Successfully Rendered via FFmpeg!</span>
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

            <button
              onClick={handleRunServerRender}
              disabled={isRendering}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Terminal className="w-4 h-4" />
              <span>Run FFmpeg on Server</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
