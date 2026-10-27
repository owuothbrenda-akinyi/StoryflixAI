import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  FileText,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project } from '../types/studio';
import { VideoExporter, ExportProgress } from '../utils/videoExporter';
import { CanvasRenderer } from '../utils/canvasRenderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [exportState, setExportState] = useState<ExportProgress>({
    status: 'idle',
    progressPercent: 0,
    currentScene: 0,
    totalScenes: project.scenes.length
  });

  const [copiedCaption, setCopiedCaption] = useState(false);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && exportState.status === 'idle') {
      startExport();
    }
  }, [isOpen]);

  const startExport = async () => {
    if (!hiddenCanvasRef.current) return;
    const canvas = hiddenCanvasRef.current;
    const renderer = new CanvasRenderer(canvas);
    const exporter = new VideoExporter(canvas, renderer);

    setExportState({
      status: 'rendering',
      progressPercent: 0,
      currentScene: 1,
      totalScenes: project.scenes.length
    });

    try {
      await exporter.recordProjectVideo(project, (prog) => {
        setExportState(prog);
        if (prog.status === 'completed') {
          // Trigger confetti burst on completion
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {
            // Ignore if blocked
          }
        }
      });
    } catch (err: any) {
      setExportState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: err.message || 'Export failed'
      }));
    }
  };

  const handleDownloadVideo = () => {
    if (!exportState.exportedBlobUrl) return;
    const a = document.createElement('a');
    a.href = exportState.exportedBlobUrl;
    const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${safeTitle}_storyflixAI.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSRT = () => {
    const srtContent = VideoExporter.generateSRT(project);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${safeTitle}_subtitles.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyCaption = () => {
    const fullCaption = `${project.tiktokCaption}\n\n${project.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullCaption).then(() => {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Hidden high-res canvas used for rendering export stream */}
      <canvas
        ref={hiddenCanvasRef}
        className="hidden"
        width={CanvasRenderer.WIDTH}
        height={CanvasRenderer.HEIGHT}
      />

      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-zinc-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {exportState.status === 'completed'
                  ? 'Video Ready for TikTok & Reels!'
                  : exportState.status === 'error'
                  ? 'Export Error'
                  : 'Rendering 9:16 Video...'}
              </h2>
              <p className="text-xs text-zinc-400">
                {exportState.status === 'completed'
                  ? 'Download your high-res vertical video with synced viral audio & captions.'
                  : 'Encoding canvas frames, dynamic subtitles, and stereo audio stream.'}
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

        {/* Rendering Progress View */}
        {exportState.status === 'rendering' && (
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-300">
                Rendering Scene {exportState.currentScene} of {exportState.totalScenes}
              </span>
              <span className="text-rose-400 font-mono text-sm">{exportState.progressPercent}%</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-full transition-all duration-200"
                style={{ width: `${exportState.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Mixing voiceover, background beat, and viral sound effects...</span>
            </div>
          </div>
        )}

        {/* Export Completed View */}
        {exportState.status === 'completed' && (
          <div className="flex flex-col gap-5">
            {/* Video Player Preview */}
            {exportState.exportedBlobUrl && (
              <div className="flex justify-center">
                <div className="w-[180px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-zinc-700 bg-black shadow-xl">
                  <video
                    src={exportState.exportedBlobUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadVideo}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Video (9:16 .webm)</span>
              </button>

              <button
                onClick={handleDownloadSRT}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Download Subtitles (.srt)</span>
              </button>
            </div>

            {/* TikTok / Reels Caption & Hashtag Box */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Viral TikTok Caption & Hashtags</span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-300 bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 leading-relaxed font-sans">
                {project.tiktokCaption}
                <br />
                <span className="text-rose-400 font-semibold mt-2 inline-block">
                  {project.hashtags.join(' ')}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {exportState.status === 'error' && (
          <div className="flex flex-col gap-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Export Failed</div>
              <p className="text-xs text-zinc-400 mt-1">{exportState.errorMessage}</p>
            </div>
            <button
              onClick={startExport}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl mx-auto flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Export</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
