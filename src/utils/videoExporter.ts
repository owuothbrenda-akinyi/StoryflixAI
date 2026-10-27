import { Project } from '../types/studio';
import { CanvasRenderer } from './canvasRenderer';
import { audioEngine } from './audioEngine';

export interface ExportProgress {
  status: 'idle' | 'rendering' | 'completed' | 'error';
  progressPercent: number;
  currentScene: number;
  totalScenes: number;
  exportedBlobUrl?: string;
  errorMessage?: string;
}

export class VideoExporter {
  private canvas: HTMLCanvasElement;
  private renderer: CanvasRenderer;

  constructor(canvas: HTMLCanvasElement, renderer: CanvasRenderer) {
    this.canvas = canvas;
    this.renderer = renderer;
  }

  public async recordProjectVideo(
    project: Project,
    onProgress: (progress: ExportProgress) => void
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        const totalDuration = project.scenes.reduce((acc, s) => acc + s.durationSec, 0);
        if (totalDuration <= 0) {
          throw new Error('Total project duration is 0 seconds.');
        }

        audioEngine.init();
        audioEngine.setVolumes(project.bgmVolume, project.voiceVolume);
        audioEngine.startBGM(project.bgmTrack);

        const canvasStream = this.canvas.captureStream(30);
        const audioStream = audioEngine.getRecordStream();

        const combinedStream = new MediaStream();
        canvasStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));
        if (audioStream && audioStream.getAudioTracks().length > 0) {
          audioStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
        }

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

        const recorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: 6000000 // 6 Mbps high quality
        });

        const recordedChunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        recorder.onerror = (err) => {
          audioEngine.stopBGM();
          onProgress({
            status: 'error',
            progressPercent: 0,
            currentScene: 0,
            totalScenes: project.scenes.length,
            errorMessage: 'MediaRecorder encountered an error.'
          });
          reject(err);
        };

        recorder.onstop = () => {
          audioEngine.stopBGM();
          const blob = new Blob(recordedChunks, { type: mimeType });
          const blobUrl = URL.createObjectURL(blob);
          onProgress({
            status: 'completed',
            progressPercent: 100,
            currentScene: project.scenes.length,
            totalScenes: project.scenes.length,
            exportedBlobUrl: blobUrl
          });
          resolve(blob);
        };

        recorder.start(100);

        // Frame rendering loop synchronized with scene timings
        const fps = 30;
        const totalFrames = Math.round(totalDuration * fps);
        let currentSceneIndex = 0;
        let sceneElapsed = 0;
        let totalElapsed = 0;

        // Play initial scene SFX
        if (project.scenes[0]) {
          audioEngine.playSFX(project.scenes[0].soundEffectCue);
          if (project.scenes[0].audioUrl) {
            audioEngine.playVoiceClip(project.scenes[0].audioUrl);
          } else {
            audioEngine.speakFallback(project.scenes[0].narration, project.voiceSpeaker);
          }
        }

        const frameInterval = 1000 / fps;
        let frameCount = 0;

        const intervalId = window.setInterval(() => {
          if (frameCount >= totalFrames) {
            clearInterval(intervalId);
            setTimeout(() => {
              recorder.stop();
            }, 300);
            return;
          }

          const currentScene = project.scenes[currentSceneIndex];
          const sceneDuration = currentScene.durationSec;
          const progressInScene = Math.min(1, sceneElapsed / sceneDuration);

          // Render canvas frame
          this.renderer.render({
            scene: currentScene,
            sceneTime: sceneElapsed,
            sceneProgress: progressInScene,
            project,
            showTikTokOverlay: false, // Don't burn UI into final video file!
            totalTime: totalElapsed
          });

          // Step time
          const dt = frameInterval / 1000;
          sceneElapsed += dt;
          totalElapsed += dt;
          frameCount++;

          // Check for scene transition
          if (sceneElapsed >= sceneDuration && currentSceneIndex < project.scenes.length - 1) {
            currentSceneIndex++;
            sceneElapsed = 0;
            const nextScene = project.scenes[currentSceneIndex];

            // Trigger sound effect & voice for new scene
            audioEngine.playSFX(nextScene.soundEffectCue);
            if (nextScene.audioUrl) {
              audioEngine.playVoiceClip(nextScene.audioUrl);
            } else {
              audioEngine.speakFallback(nextScene.narration, project.voiceSpeaker);
            }
          }

          onProgress({
            status: 'rendering',
            progressPercent: Math.min(99, Math.round((frameCount / totalFrames) * 100)),
            currentScene: currentSceneIndex + 1,
            totalScenes: project.scenes.length
          });
        }, frameInterval);
      } catch (err: any) {
        audioEngine.stopBGM();
        onProgress({
          status: 'error',
          progressPercent: 0,
          currentScene: 0,
          totalScenes: project.scenes.length,
          errorMessage: err.message || 'Export failed'
        });
        reject(err);
      }
    });
  }

  // Generate SRT Subtitle File
  public static generateSRT(project: Project): string {
    let srt = '';
    let currentTime = 0;

    project.scenes.forEach((scene, index) => {
      const startTime = currentTime;
      const endTime = currentTime + scene.durationSec;

      const formatSRTTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
      };

      srt += `${index + 1}\n`;
      srt += `${formatSRTTime(startTime)} --> ${formatSRTTime(endTime)}\n`;
      srt += `${scene.narration}\n\n`;

      currentTime = endTime;
    });

    return srt;
  }
}
