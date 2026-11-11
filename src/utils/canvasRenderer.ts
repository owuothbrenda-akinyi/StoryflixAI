import { CaptionPreset, Project, Scene } from '../types/studio';
import { CHARACTER_PRESETS } from '../data/presetTemplates';

export interface RenderFrameOptions {
  scene: Scene;
  sceneTime: number; // seconds into current scene
  sceneProgress: number; // 0 to 1
  project: Project;
  showTikTokOverlay: boolean;
  totalTime: number; // elapsed total seconds
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imgCache: Map<string, HTMLImageElement> = new Map();
  private characterImgCache: Map<string, HTMLImageElement> = new Map();
  public onImageLoaded?: () => void;

  // Reference 9:16 resolution (standard 720 x 1280 or 1080 x 1920)
  public static readonly WIDTH = 720;
  public static readonly HEIGHT = 1280;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.canvas.width = CanvasRenderer.WIDTH;
    this.canvas.height = CanvasRenderer.HEIGHT;
  }

  private roundRect(x: number, y: number, w: number, h: number, radius: number) {
    const ctx = this.ctx;
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(x, y, w, h, radius);
      return;
    }
    const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  public async preloadImage(url?: string): Promise<void> {
    if (!url) return;
    const existing = this.imgCache.get(url);
    if (existing && existing.complete && existing.naturalWidth > 0) return;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imgCache.set(url, img);
        this.onImageLoaded?.();
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
      img.src = url;
    });
  }

  public async preloadAll(project: Project): Promise<void> {
    const urls: string[] = [];
    project.scenes.forEach((s) => {
      if (s.keyframeImageUrl) urls.push(s.keyframeImageUrl);
      if (s.imageUrl) urls.push(s.imageUrl);
      if (s.fallbackSvg) urls.push(s.fallbackSvg);
    });
    await Promise.all(urls.map((u) => this.preloadImage(u)));
  }

  public render(options: RenderFrameOptions) {
    const { scene, sceneTime, sceneProgress, project, showTikTokOverlay, totalTime } = options;
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;
    const H = CanvasRenderer.HEIGHT;

    ctx.save();

    // 1. Calculate Camera Transform & Video Motion (Kling 4.0 / Runway Gen-3 Engine)
    let scale = 1.0;
    let offsetX = 0;
    let offsetY = 0;
    let rotation = 0;

    const motionType = scene.motionControl?.type || scene.cameraEffect || 'zoom_in';
    const strengthFactor = (scene.motionControl?.strength ?? 6) / 5; // normalized around 1.0 - 2.0

    switch (motionType) {
      case 'zoom_in':
      case 'push_in': {
        // Smooth easing push-in
        const ease = sceneProgress * sceneProgress * (3 - 2 * sceneProgress);
        scale = 1.0 + ease * 0.18 * strengthFactor;
        offsetY = (sceneProgress - 0.5) * 12 * strengthFactor;
        break;
      }
      case 'zoom_out': {
        const ease = sceneProgress * sceneProgress * (3 - 2 * sceneProgress);
        scale = (1.0 + 0.18 * strengthFactor) - ease * 0.18 * strengthFactor;
        break;
      }
      case 'pan_left':
        offsetX = (sceneProgress - 0.5) * 55 * strengthFactor;
        scale = 1.1;
        break;
      case 'pan_right':
        offsetX = (0.5 - sceneProgress) * 55 * strengthFactor;
        scale = 1.1;
        break;
      case 'orbit': {
        // Dynamic 3D orbital camera arc with subtle roll
        rotation = Math.sin(sceneProgress * Math.PI) * 0.025 * strengthFactor;
        offsetX = Math.sin(sceneProgress * Math.PI * 2) * 18 * strengthFactor;
        offsetY = Math.cos(sceneProgress * Math.PI * 2) * 10 * strengthFactor;
        scale = 1.12;
        break;
      }
      case 'dolly_zoom': {
        // Vertigo effect (optical push-in + FOV shift)
        scale = 1.0 + Math.pow(sceneProgress, 1.4) * 0.26 * strengthFactor;
        offsetY = -sceneProgress * 25 * strengthFactor;
        break;
      }
      case 'drone_rise':
        offsetY = (0.5 - sceneProgress) * 65 * strengthFactor;
        scale = 1.08;
        break;
      case 'handheld':
      case 'shake': {
        // Organic handheld camera breathing & natural jitter
        const jitter = scene.cameraEffect === 'shake' && sceneProgress < 0.35
          ? (1 - sceneProgress / 0.35) * 16
          : 4;
        offsetX = (Math.sin(totalTime * 18) * 4 + Math.cos(totalTime * 32) * 2) * (strengthFactor * 0.7);
        offsetY = (Math.cos(totalTime * 22) * 3 + Math.sin(totalTime * 15) * 2) * (strengthFactor * 0.7);
        scale = 1.06;
        break;
      }
      case 'flash_cut':
        scale = 1.0 + Math.sin(sceneProgress * Math.PI) * 0.08;
        break;
      default:
        scale = 1.0 + sceneProgress * 0.14;
        break;
    }

    ctx.translate(W / 2, H / 2);
    if (rotation !== 0) {
      ctx.rotate(rotation);
    }
    ctx.scale(scale, scale);
    ctx.translate(-W / 2 + offsetX, -H / 2 + offsetY);

    // 2. Draw Background
    this.drawBackground(scene, totalTime, sceneProgress, project);

    ctx.restore(); // Restore camera transform for stable UI overlays

    // 3. Draw Cartoon Character ONLY when explicitly in cartoon/fruit drama format and not suppressed
    const shouldDrawCartoon =
      (project.format === 'cartoon_story' || project.format === 'fruit_drama') &&
      project.showCartoonAvatar !== false &&
      !project.realHumanMode;

    if (shouldDrawCartoon) {
      this.drawCartoonCharacter(scene, sceneProgress, totalTime, project);
    } else if (project.format === 'real_human' || project.realHumanMode) {
      this.drawRealHumanCreatorHUD(project, totalTime);
    }

    // 4. Draw Viral Overlay Badge (Top Hook Badge)
    this.drawOverlayBadge(scene, sceneProgress);

    // 5. Draw Dynamic Animated Captions (Hormozi / Beast style)
    this.drawDynamicCaptions(scene, sceneProgress, project);

    // 6. Draw Flash Cut White Overlay if applicable
    if (scene.cameraEffect === 'flash_cut' && sceneProgress < 0.12) {
      const flashAlpha = (1 - sceneProgress / 0.12) * 0.85;
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    // 7. Draw TikTok / Reels UI Overlay Safe Zones if enabled
    if (showTikTokOverlay) {
      this.drawTikTokMockUI(project, totalTime);
    }
  }

  private drawBackground(scene: Scene, totalTime: number, progress: number, project: Project) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;
    const H = CanvasRenderer.HEIGHT;

    const isSplit = Boolean(project.splitScreenMode);
    // Exact FFmpeg vstack standard: 1080x960 top, 1080x960 bottom (50% = 960px on 1920p, or 640px on 1280p)
    let splitRatioPercent = 0.50;
    if (project.splitRatio === '55_45') splitRatioPercent = 0.55;
    if (project.splitRatio === '60_40') splitRatioPercent = 0.60;
    const splitY = isSplit ? Math.round(H * splitRatioPercent) : H;
    const topH = splitY;

    // Draw Main Scene (Image or Generative Procedural) in upper/full viewport
    ctx.save();
    if (isSplit) {
      ctx.beginPath();
      ctx.rect(0, 0, W, topH);
      ctx.clip();
    }

    if (project.activeVideoUrl) {
      // Clear the viewport area so the active real video plays cleanly underneath
      ctx.clearRect(0, 0, W, topH);
    } else {
      this.drawSceneArt(scene, totalTime, progress, project, W, topH);
    }
    ctx.restore();

    // If split-screen, draw dynamic satisfying B-roll on bottom half
    if (isSplit) {
      const bottomH = H - splitY;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, splitY, W, bottomH);
      ctx.clip();
      this.drawSplitScreenBRoll(splitY, bottomH, totalTime, project.splitScreenType || 'minecraft_parkour', project);
      ctx.restore();

      const dividerStyle = project.splitDividerStyle || 'neon_glow';
      if (dividerStyle !== 'none') {
        ctx.save();
        if (dividerStyle === 'minimal_black') {
          // Clean 2px dark boundary like standard FFmpeg stitch
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, splitY - 1, W, 2);
        } else if (dividerStyle === 'laser_line') {
          // Sharp cyberpunk laser line
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#00f2fe';
          ctx.fillRect(0, splitY - 2, W, 4);
        } else {
          // Sleek Split Divider with badge
          const divGrad = ctx.createLinearGradient(0, splitY, W, splitY);
          divGrad.addColorStop(0, '#f43f5e');
          divGrad.addColorStop(0.5, '#fbbf24');
          divGrad.addColorStop(1, '#8b5cf6');
          ctx.fillStyle = divGrad;
          ctx.fillRect(0, splitY - 3, W, 6);

          // Divider pill badge
          const pillW = 320;
          const pillH = 26;
          const pillX = W / 2 - pillW / 2;
          const pillY = splitY - pillH / 2;
          ctx.fillStyle = '#09090b';
          ctx.beginPath();
          this.roundRect(pillX, pillY, pillW, pillH, 13);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = '900 11px "Outfit", "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#fef08a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const label = project.splitScreenType === 'subway_surfer'
            ? '⚡ 1080:960 VSTACK • SUBWAY SURFER ⚡'
            : project.splitScreenType === 'gta_ramp'
            ? '⚡ 1080:960 VSTACK • GTA MEGA RAMP ⚡'
            : project.splitScreenType === 'satisfying_sand'
            ? '⚡ 1080:960 VSTACK • ASMR SATISFYING ⚡'
            : '⚡ 1080:960 VSTACK • MINECRAFT PARKOUR ⚡';
          ctx.fillText(label, W / 2, splitY);
        }
        ctx.restore();
      }
    }
  }

  private drawSceneArt(scene: Scene, totalTime: number, progress: number, project: Project, W: number, H: number) {
    const ctx = this.ctx;

    // 1. Draw Scene Image Artwork (AI photoreal image or instant SVG scene) with Kinetic Ken Burns Motion
    let img: HTMLImageElement | null = null;
    const targetImgUrl = scene.keyframeImageUrl || scene.imageUrl;
    if (targetImgUrl) {
      const candidate = this.getImage(targetImgUrl);
      if (candidate && candidate.complete && candidate.naturalWidth > 0) {
        img = candidate;
      }
    }
    if (!img && scene.fallbackSvg) {
      const fallback = this.getImage(scene.fallbackSvg);
      if (fallback && fallback.complete && fallback.naturalWidth > 0) {
        img = fallback;
      }
    }

    if (img) {
      ctx.save();

        // Ken Burns smooth cinematic zoom & parallax
        const kenBurnsScale = 1.05 + progress * 0.08;
        const kenBurnsPanY = (progress - 0.5) * 20;

        ctx.translate(W / 2, H / 2);
        ctx.scale(kenBurnsScale, kenBurnsScale);
        ctx.translate(-W / 2, -H / 2 + kenBurnsPanY);

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = W / H;
        let dw = W;
        let dh = H;
        let dx = 0;
        let dy = 0;

        if (imgRatio > canvasRatio) {
          dh = H;
          dw = H * imgRatio;
          dx = (W - dw) / 2;
        } else {
          dw = W;
          dh = W / imgRatio;
          dy = (H - dh) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        // Atmospheric Cinematic Lighting Sweep
        const sweepX = (Math.sin(totalTime * 0.8) * 0.5 + 0.5) * W;
        const sweepGrad = ctx.createRadialGradient(sweepX, H * 0.35, 20, sweepX, H * 0.35, 450);
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        sweepGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, W, H);

        // Floating Cinematic Embers / Dust Particles
        ctx.save();
        for (let i = 0; i < 24; i++) {
          const px = ((i * 127.3 + Math.sin(totalTime * 1.5 + i) * 30) % W);
          const py = ((H + 20 - ((totalTime * 45 + i * 55) % (H + 40))));
          const size = 1.5 + (i % 3);
          const alpha = 0.2 + (Math.sin(totalTime * 3 + i) * 0.5 + 0.5) * 0.5;

          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? `rgba(251, 191, 36, ${alpha})` : `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.fill();
        }
        ctx.restore();

        // Cinematic Vignette
        const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.72);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        return;
      }

    // Generative Animated Procedural Backgrounds based on style & tone
    const format = project.format;
    const tone = project.tone;

    if (format === 'cartoon_story' || project.cartoonStyle === 'pixar_3d') {
      // Whimsical vibrant cartoon scene with floating bubbles and warm gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#38bdf8');
      bgGrad.addColorStop(0.5, '#818cf8');
      bgGrad.addColorStop(1, '#c084fc');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Cartoon Halftone / floating bubbles
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(totalTime * 0.8 + i * 1.5) * 0.4 + 0.5) * W;
        const y = ((totalTime * 35 + i * 90) % (H + 100)) - 50;
        const radius = 25 + (i % 5) * 12;

        ctx.beginPath();
        ctx.arc(x, H - y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.stroke();
      }

      // Fun cartoon hill in background
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.quadraticCurveTo(W * 0.4, H - 240, W, H - 180);
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = '#4ade80';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.quadraticCurveTo(W * 0.7, H - 160, W, H);
      ctx.closePath();
      ctx.fillStyle = '#22c55e';
      ctx.fill();
    } else if (tone === 'dark_mystery' || format === 'conspiracy_mystery') {
      // Dark Noir Mystery with moody spotlight, scanlines, and floating embers
      const bgGrad = ctx.createRadialGradient(
        W * 0.5 + Math.sin(totalTime) * 80,
        H * 0.35,
        50,
        W * 0.5,
        H * 0.5,
        H * 0.75
      );
      bgGrad.addColorStop(0, '#2d1b4e');
      bgGrad.addColorStop(0.5, '#130d24');
      bgGrad.addColorStop(1, '#05020a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Red ominous pulse
      const pulse = Math.sin(totalTime * 2.5) * 0.5 + 0.5;
      const spotGrad = ctx.createRadialGradient(W / 2, H * 0.3, 10, W / 2, H * 0.3, 350);
      spotGrad.addColorStop(0, `rgba(239, 68, 68, ${0.12 * pulse})`);
      spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, W, H);

      // Cyber scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let y = 0; y < H; y += 6) {
        ctx.fillRect(0, y, W, 2);
      }
    } else if (format === 'what_if' || tone === 'dramatic_suspense') {
      // Cosmic Nebula with deep space stars and rotating galactic core
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.4, '#1e1b4b');
      bgGrad.addColorStop(0.8, '#311042');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Glowing cosmic core
      const coreGrad = ctx.createRadialGradient(
        W * 0.5,
        H * 0.4,
        20,
        W * 0.5,
        H * 0.4,
        420
      );
      coreGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      coreGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.25)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, W, H);

      // Twinkling stars
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % W);
        const sy = ((i * 229.3 + totalTime * 8) % H);
        const starBrightness = (Math.sin(totalTime * 3 + i) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5 + (i % 3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.7 * starBrightness})`;
        ctx.fill();
      }
    } else {
      // Ultra Modern High-Energy Viral Gradient (Obsidian to Electric Violet / Cyan)
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.35, '#180e29');
      grad.addColorStop(0.7, '#241038');
      grad.addColorStop(1, '#0c0714');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Dynamic animated neon geometric light rays
      const angle = totalTime * 0.4;
      ctx.save();
      ctx.translate(W / 2, H * 0.4);
      ctx.rotate(angle);
      for (let i = 0; i < 6; i++) {
        ctx.rotate((Math.PI * 2) / 6);
        const rayGrad = ctx.createLinearGradient(0, 0, 400, 0);
        rayGrad.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
        rayGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(500, -60);
        ctx.lineTo(500, 60);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Cyber Grid floor
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.18)';
      ctx.lineWidth = 1.5;
      for (let y = H * 0.7; y < H; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }
  }

  private drawSplitScreenBRoll(startY: number, height: number, totalTime: number, type: string, project: Project) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;

    if (type === 'subway_surfer') {
      // 3D Subway Surfer Tracks with 3 lanes, coins, and speed lines
      const bgGrad = ctx.createLinearGradient(0, startY, 0, startY + height);
      bgGrad.addColorStop(0, '#0c1a2e');
      bgGrad.addColorStop(0.5, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, startY, W, height);

      const horizonY = startY + 60;
      const trackH = height - 60;
      const laneWidth = 140;

      // 3 Train track perspective rails
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      const rails = [-laneWidth * 1.5, -laneWidth * 0.5, laneWidth * 0.5, laneWidth * 1.5];
      rails.forEach((rx) => {
        ctx.beginPath();
        ctx.moveTo(W / 2 + rx * 0.15, horizonY);
        ctx.lineTo(W / 2 + rx, startY + height);
        ctx.stroke();
      });

      // Wooden Railroad Sleepers moving towards camera
      const sleeperOffset = (totalTime * 280) % 60;
      for (let sy = 0; sy < trackH; sy += 35) {
        const yPos = horizonY + Math.pow((sy + sleeperOffset) / trackH, 1.7) * trackH;
        if (yPos < startY + height) {
          const spread = ((yPos - horizonY) / trackH) * (laneWidth * 3);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(W / 2 - spread / 2, yPos, spread, 6);
        }
      }

      // Golden Subway Coins rotating and moving along track
      for (let i = 0; i < 4; i++) {
        const coinProgress = ((totalTime * 1.5 + i * 0.35) % 1);
        const cy = horizonY + Math.pow(coinProgress, 1.6) * trackH;
        const laneIdx = (i % 3) - 1; // -1, 0, 1
        const cx = W / 2 + laneIdx * (laneWidth * ((cy - horizonY) / trackH));
        const coinSize = 14 + coinProgress * 22;

        if (cy < startY + height - 40) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(Math.cos(totalTime * 8 + i), 1);
          ctx.beginPath();
          ctx.arc(0, 0, coinSize, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${Math.round(coinSize)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('¢', 0, 1);
          ctx.restore();
        }
      }

      // Dynamic Runner Character jumping
      const runnerLane = Math.sin(totalTime * 2.5) > 0.3 ? 1 : Math.sin(totalTime * 2.5) < -0.3 ? -1 : 0;
      const runnerX = W / 2 + runnerLane * 100;
      const runnerJumpY = startY + height - 85 - Math.abs(Math.sin(totalTime * 7)) * 55;

      ctx.save();
      ctx.translate(runnerX, runnerJumpY);
      // Hoodie character
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      this.roundRect(-20, -32, 40, 40, 10);
      ctx.fill();
      // Cap
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-18, -42, 36, 12);
      ctx.fillRect(-24, -36, 16, 6);
      // Hoverboard
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      this.roundRect(-30, 12, 60, 10, 4);
      ctx.fill();
      ctx.restore();

      // Subway Score HUD
      ctx.font = '900 14px "Outfit", monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE: ${Math.floor(totalTime * 1420 + 8540)}`, W - 25, startY + 30);

    } else if (type === 'gta_ramp') {
      // High-Octane GTA Mega Ramp in Sunset Sky
      const bgGrad = ctx.createLinearGradient(0, startY, 0, startY + height);
      bgGrad.addColorStop(0, '#f97316');
      bgGrad.addColorStop(0.4, '#a855f7');
      bgGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, startY, W, height);

      // Mega Ramp Neon Track
      const horizonY = startY + 50;
      const rampW = 220;
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(W / 2 - 20, horizonY);
      ctx.lineTo(W / 2 + 20, horizonY);
      ctx.lineTo(W / 2 + rampW, startY + height);
      ctx.lineTo(W / 2 - rampW, startY + height);
      ctx.closePath();
      ctx.fill();

      // Neon Track Borders
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 20, horizonY);
      ctx.lineTo(W / 2 - rampW, startY + height);
      ctx.moveTo(W / 2 + 20, horizonY);
      ctx.lineTo(W / 2 + rampW, startY + height);
      ctx.stroke();

      // Neon speed booster arrows
      const arrowOffset = (totalTime * 350) % 90;
      for (let ay = 0; ay < height - 60; ay += 70) {
        const yPos = horizonY + Math.pow((ay + arrowOffset) / (height - 60), 1.6) * (height - 60);
        if (yPos < startY + height) {
          ctx.fillStyle = '#f43f5e';
          ctx.font = '900 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▲ ▲ ▲', W / 2, yPos);
        }
      }

      // Sports Car Leaping
      const carY = startY + height - 90 - Math.abs(Math.sin(totalTime * 5)) * 60;
      ctx.save();
      ctx.translate(W / 2, carY);
      ctx.rotate((Math.sin(totalTime * 5) * 0.15));
      ctx.fillStyle = '#fbbf24';
      this.roundRect(-45, -18, 90, 36, 8);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-25, -12, 50, 24);
      // Nitro flames
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(-45, -6);
      ctx.lineTo(-75 - Math.random() * 20, 0);
      ctx.lineTo(-45, 6);
      ctx.fill();
      ctx.restore();

      ctx.font = '900 13px "Outfit", monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.textAlign = 'left';
      ctx.fillText('SPEED: 248 MPH', 25, startY + 30);

    } else if (type === 'satisfying_sand') {
      // Satisfying kinetic rainbow sand spirals
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, startY, W, height);
      const cx = W / 2;
      const cy = startY + height / 2;
      for (let r = 20; r < 240; r += 24) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${(r * 2 + totalTime * 60) % 360}, 85%, 60%)`;
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // ASMR Slicing blade animation
      const bladeX = cx + Math.sin(totalTime * 4) * 160;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bladeX, cy - 120);
      ctx.lineTo(bladeX, cy + 120);
      ctx.stroke();

    } else if (type === 'neon_grid') {
      // 80s Synthwave Outrun Highway
      const bgGrad = ctx.createLinearGradient(0, startY, 0, startY + height);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.4, '#2e1065');
      bgGrad.addColorStop(1, '#4c0519');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, startY, W, height);

      const sunY = startY + 90;
      const sunGrad = ctx.createLinearGradient(0, sunY - 60, 0, sunY + 60);
      sunGrad.addColorStop(0, '#fde047');
      sunGrad.addColorStop(1, '#f43f5e');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(W / 2, sunY, 65, 0, Math.PI * 2);
      ctx.fill();

      for (let s = 0; s < 5; s++) {
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(W / 2 - 70, sunY + s * 12 + 6, 140, 4 + s);
      }

      const horizonY = startY + 110;
      const floorH = height - 110;
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
      ctx.lineWidth = 2;

      for (let vx = -W; vx <= W * 2; vx += 70) {
        ctx.beginPath();
        ctx.moveTo(W / 2, horizonY);
        ctx.lineTo(vx, startY + height);
        ctx.stroke();
      }

      const gridOffset = (totalTime * 140) % 50;
      for (let gy = 0; gy < floorH; gy += 30) {
        const yPos = horizonY + Math.pow((gy + gridOffset) / floorH, 1.8) * floorH;
        if (yPos < startY + height) {
          ctx.beginPath();
          ctx.moveTo(0, yPos);
          ctx.lineTo(W, yPos);
          ctx.stroke();
        }
      }
    } else {
      // Default: Ultra-Realistic Minecraft Parkour 3D with Full HUD & First-Person Crosshair
      const bgGrad = ctx.createLinearGradient(0, startY, 0, startY + height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.6, '#451a03');
      bgGrad.addColorStop(1, '#9a3412');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, startY, W, height);

      // Bubbling lava lake at the bottom
      const lavaY = startY + height - 85;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, lavaY, W, 85);
      for (let i = 0; i < 14; i++) {
        const lx = ((i * 55 + totalTime * 35) % (W + 60)) - 30;
        const ly = lavaY + 25 + Math.sin(totalTime * 3 + i) * 16;
        const lr = 7 + (i % 4) * 4;
        ctx.beginPath();
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
      }

      // Floating 3D Isometric Minecraft Parkour Blocks
      const blockSpeed = 175;
      const numBlocks = 6;
      for (let i = 0; i < numBlocks; i++) {
        const offset = (totalTime * blockSpeed + i * 145) % (height + 170);
        const by = startY - 70 + offset;
        const bx = W / 2 + Math.sin(i * 2.3 + totalTime * 0.85) * 170;
        const bw = 110;
        const bh = 55;

        // Block Shadow on lava
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(bx, lavaY - 12, bw * 0.52, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Isometric Grass Block Top
        ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#64748b'; // alternate grass and stone
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + bw / 2, by + 22);
        ctx.lineTo(bx, by + 44);
        ctx.lineTo(bx - bw / 2, by + 22);
        ctx.closePath();
        ctx.fill();

        // Left Face
        ctx.fillStyle = i % 2 === 0 ? '#78350f' : '#475569';
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2, by + 22);
        ctx.lineTo(bx, by + 44);
        ctx.lineTo(bx, by + 44 + bh);
        ctx.lineTo(bx - bw / 2, by + 22 + bh);
        ctx.closePath();
        ctx.fill();

        // Right Face (shaded)
        ctx.fillStyle = i % 2 === 0 ? '#451a03' : '#334155';
        ctx.beginPath();
        ctx.moveTo(bx, by + 44);
        ctx.lineTo(bx + bw / 2, by + 22);
        ctx.lineTo(bx + bw / 2, by + 22 + bh);
        ctx.lineTo(bx, by + 44 + bh);
        ctx.closePath();
        ctx.fill();

        // Pixel Grass Dripping overhang
        if (i % 2 === 0) {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(bx - 25, by + 34, 12, 14);
          ctx.fillRect(bx + 10, by + 30, 14, 16);
        }

        // Floating Gold / Diamond XP Orb on top of block
        const coinBob = Math.sin(totalTime * 6 + i) * 8;
        ctx.save();
        ctx.translate(bx, by + 12 + coinBob);
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : '#facc15';
        ctx.fill();
        ctx.strokeStyle = i % 3 === 0 ? '#0284c7' : '#ca8a04';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // First-person Crosshair '+' in center of parkour viewport
      const crosshairY = startY + height * 0.45;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 12, crosshairY);
      ctx.lineTo(W / 2 + 12, crosshairY);
      ctx.moveTo(W / 2, crosshairY - 12);
      ctx.lineTo(W / 2, crosshairY + 12);
      ctx.stroke();

      // Minecraft Player Jumping Cursor / Character
      const jumpY = startY + height * 0.45 + Math.abs(Math.sin(totalTime * 8)) * -45;
      ctx.save();
      ctx.translate(W / 2, jumpY);
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      this.roundRect(-16, -22, 32, 30, 6);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-12, 8, 8, 18);
      ctx.fillRect(4, 8, 8, 18);
      ctx.restore();

      // Minecraft UI HUD: Hearts & Hunger Bar
      const hudY = startY + height - 58;
      // 10 Red Hearts
      for (let h = 0; h < 10; h++) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px sans-serif';
        ctx.fillText('❤️', W / 2 - 165 + h * 16, hudY);
      }
      // 10 Hunger drumsticks
      for (let f = 0; f < 10; f++) {
        ctx.fillStyle = '#f97316';
        ctx.font = '12px sans-serif';
        ctx.fillText('🍗', W / 2 + 20 + f * 15, hudY);
      }

      // Minecraft XP Green Bar
      const xpBarW = 340;
      const xpBarH = 6;
      const xpBarX = W / 2 - xpBarW / 2;
      const xpBarY = hudY + 16;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(xpBarX, xpBarY, xpBarW, xpBarH);
      ctx.fillStyle = '#22c55e';
      const xpFill = ((totalTime * 0.35) % 1) * xpBarW;
      ctx.fillRect(xpBarX, xpBarY, xpFill, xpBarH);

      // Level number in green pixel font
      ctx.font = '900 13px monospace';
      ctx.fillStyle = '#86efac';
      ctx.textAlign = 'center';
      ctx.fillText('99', W / 2, xpBarY - 2);

      // Minecraft Hotbar (9 inventory slots)
      const slotSize = 28;
      const hotbarW = slotSize * 9 + 8;
      const hotbarX = W / 2 - hotbarW / 2;
      const hotbarY = xpBarY + 10;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(hotbarX, hotbarY, hotbarW, slotSize + 4);
      for (let s = 0; s < 9; s++) {
        const sx = hotbarX + 4 + s * slotSize;
        ctx.strokeStyle = s === 2 ? '#ffffff' : '#52525b';
        ctx.lineWidth = s === 2 ? 2 : 1;
        ctx.strokeRect(sx, hotbarY + 2, slotSize - 2, slotSize);
      }
      // Icons in hotbar slots
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗡️', hotbarX + 4 + 0 * slotSize + 13, hotbarY + 22);
      ctx.fillText('⛏️', hotbarX + 4 + 1 * slotSize + 13, hotbarY + 22);
      ctx.fillText('🪓', hotbarX + 4 + 2 * slotSize + 13, hotbarY + 22);
      ctx.fillText('🧱', hotbarX + 4 + 3 * slotSize + 13, hotbarY + 22);
      ctx.fillText('🍎', hotbarX + 4 + 4 * slotSize + 13, hotbarY + 22);
      ctx.fillText('🏹', hotbarX + 4 + 5 * slotSize + 13, hotbarY + 22);
      ctx.fillText('🥩', hotbarX + 4 + 6 * slotSize + 13, hotbarY + 22);
    }
  }

  private drawCartoonCharacter(scene: Scene, progress: number, totalTime: number, project: Project) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;
    const H = CanvasRenderer.HEIGHT;

    const isSplit = Boolean(project.splitScreenMode);
    const charW = isSplit ? 230 : 280;
    const charH = isSplit ? 230 : 280;
    const charX = W / 2 - charW / 2;

    // Subtle breathing / bobbing animation
    const bob = Math.sin(totalTime * 4.5) * 8;
    const targetY = isSplit ? (H * 0.54) * 0.48 : H * 0.42;
    const charY = targetY - charH / 2 + bob;

    const charPresetId = project.characterAvatar || 'sir_reginald';
    const preset = CHARACTER_PRESETS.find((p) => p.id === charPresetId) || CHARACTER_PRESETS[0];

    // Cache SVG as image
    const charImg = this.getCharacterImage(preset.id, preset.avatarSvg);
    if (charImg && charImg.complete) {
      // Glow under character
      const glowGrad = ctx.createRadialGradient(W / 2, charY + charH * 0.8, 20, W / 2, charY + charH * 0.8, 140);
      glowGrad.addColorStop(0, `${preset.colorScheme.primary}88`);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      // Comic Action Speed Lines when shocked or screen shake
      if (scene.characterEmotion === 'shocked' || scene.cameraEffect === 'shake') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 3.5;
        for (let a = 0; a < 16; a++) {
          const ang = (a * Math.PI * 2) / 16 + Math.sin(totalTime * 10) * 0.1;
          const r1 = 170 + (a % 3) * 25;
          const r2 = 360;
          ctx.beginPath();
          ctx.moveTo(W / 2 + Math.cos(ang) * r1, charY + charH * 0.5 + Math.sin(ang) * r1);
          ctx.lineTo(W / 2 + Math.cos(ang) * r2, charY + charH * 0.5 + Math.sin(ang) * r2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw character
      ctx.drawImage(charImg, charX, charY, charW, charH);

      // Talking Lip-sync Mouth Animation
      const isTalking = progress < 0.94;
      const mouthOpen = isTalking ? (Math.sin(totalTime * 16) * 0.5 + 0.5) : 0;
      const mouthY = charY + charH * 0.68;

      ctx.save();
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = preset.colorScheme.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(W / 2, mouthY, 13 + mouthOpen * 6, 5 + mouthOpen * 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (mouthOpen > 0.4) {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(W / 2, mouthY + mouthOpen * 3, 7, 0, Math.PI);
        ctx.fill();
      }
      ctx.restore();

      // Blinking Eyes Animation every 3.2 seconds
      const isBlinking = (Math.sin(totalTime * 1.9) > 0.96);
      if (isBlinking) {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(W / 2 - 32, charY + charH * 0.50, 20, 5);
        ctx.fillRect(W / 2 + 12, charY + charH * 0.50, 20, 5);
      }

      // Emotion reaction badge above character
      const emotion = scene.characterEmotion || 'shocked';
      const emotionEmoji =
        emotion === 'shocked'
          ? '😱'
          : emotion === 'laughing'
          ? '😂'
          : emotion === 'heroic'
          ? '🔥'
          : emotion === 'thinking'
          ? '🤔'
          : emotion === 'scheming'
          ? '😏'
          : '✨';

      const badgeY = charY - 20 + Math.sin(totalTime * 6) * 4;
      ctx.font = '38px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(emotionEmoji, W / 2 + 85, badgeY);

      // If dialogue speaker is present, draw comic speech bubble
      if (scene.dialogueSpeaker) {
        this.drawSpeechBubble(scene.dialogueSpeaker, W / 2 - 80, charY - 25);
      }
    }
  }

  private drawSpeechBubble(speaker: string, x: number, y: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;

    const bw = 170;
    const bh = 42;
    const r = 12;

    // Bubble box
    ctx.beginPath();
    this.roundRect(x - bw / 2, y - bh / 2, bw, bh, r);
    ctx.fill();
    ctx.stroke();

    // Bubble pointer
    ctx.beginPath();
    ctx.moveTo(x + 25, y + bh / 2 - 2);
    ctx.lineTo(x + 40, y + bh / 2 + 16);
    ctx.lineTo(x + 10, y + bh / 2 - 2);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // Speaker text
    ctx.font = 'bold 20px "Bangers", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(speaker.toUpperCase(), x, y);
    ctx.restore();
  }

  private drawRealHumanCreatorHUD(project: Project, totalTime: number) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;

    ctx.save();
    // 1. Subtle 4K REC indicator top-right
    const isBlink = Math.floor(totalTime * 2) % 2 === 0;
    const rx = W - 165;
    const ry = 48;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    this.roundRect(rx - 8, ry - 14, 150, 28, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (isBlink) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(rx + 6, ry, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.beginPath();
      ctx.arc(rx + 6, ry, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = '800 12px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('4K REC • 60fps', rx + 18, ry);

    // 2. Subtle Verified Creator Tag top-left
    const creatorName = project.actorPersona || project.characterName || 'Verified Creator';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    this.roundRect(24, 40, 230, 36, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Small avatar / icon ring
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(42, 58, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', 42, 58);

    ctx.font = '800 12px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(creatorName.slice(0, 18), 58, 52);

    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('✓ Real Human Creator', 58, 66);

    ctx.restore();
  }

  private drawOverlayBadge(scene: Scene, progress: number) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;

    if (!scene.overlayBadge) return;

    ctx.save();
    const badgeText = `${scene.overlayBadge} ${scene.emojiAccent || ''}`.trim();
    const y = 140;

    ctx.font = '900 24px "Outfit", "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(badgeText).width;
    const padX = 24;
    const bw = textWidth + padX * 2;
    const bh = 48;
    const bx = W / 2 - bw / 2;

    // Glowing badge background
    const bgGrad = ctx.createLinearGradient(bx, y, bx + bw, y);
    bgGrad.addColorStop(0, '#f59e0b');
    bgGrad.addColorStop(1, '#ef4444');

    // Subtle badge bounce
    const scale = 1.0 + Math.sin(progress * Math.PI) * 0.04;
    ctx.translate(W / 2, y + bh / 2);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2, -(y + bh / 2));

    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    this.roundRect(bx, y, bw, bh, 24);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.fillText(badgeText, W / 2, y + bh / 2);

    ctx.restore();
  }

  // Viral Hormozi / MrBeast dynamic word-by-word bouncing captions
  private drawDynamicCaptions(scene: Scene, progress: number, project: Project) {
    if (project.autoCaptionsEnabled === false) return;

    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;
    const H = CanvasRenderer.HEIGHT;

    const text = scene.narration.trim();
    if (!text) return;

    const words = text.split(/\s+/);
    if (words.length === 0) return;

    // Determine current active word index based on scene progress
    const activeWordIndex = Math.min(words.length - 1, Math.floor(progress * words.length));

    // Show 3-5 words at a time in a chunk around activeWordIndex for high readability!
    const chunkSize = 4;
    const chunkStart = Math.floor(activeWordIndex / chunkSize) * chunkSize;
    const chunkWords = words.slice(chunkStart, chunkStart + chunkSize);

    const preset = project.captionPreset || 'hormozi_yellow';
    const isSplit = Boolean(project.splitScreenMode);
    // In split-screen (top 50%), keep captions in top story frame right above the divider
    const defaultYPercent = isSplit ? 46 : 68;
    const yPercent = (project.captionYPercent || defaultYPercent) / 100;
    const baseFontSize = project.captionFontSize || 34;

    ctx.save();

    const lineY = H * yPercent;
    let fontName = '"Outfit", "Plus Jakarta Sans", sans-serif';
    if (preset === 'cartoon_comic') {
      fontName = '"Bangers", cursive, sans-serif';
    } else if (preset === 'hormozi_yellow') {
      fontName = '"Outfit", "Plus Jakarta Sans", sans-serif';
    }

    ctx.font = `900 ${baseFontSize}px ${fontName}`;

    // Measure total line width to center
    const spaceWidth = ctx.measureText(' ').width;
    const wordWidths = chunkWords.map((w) => ctx.measureText(w.toUpperCase()).width);
    const totalLineWidth = wordWidths.reduce((a, b) => a + b, 0) + (chunkWords.length - 1) * spaceWidth;

    let currentX = W / 2 - totalLineWidth / 2;

    // Optional background pill for minimal glass preset
    if (preset === 'minimal_glass') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      this.roundRect(currentX - 25, lineY - baseFontSize * 1.1, totalLineWidth + 50, baseFontSize * 1.8, 20);
      ctx.fill();
    }

    chunkWords.forEach((word, idx) => {
      const globalIndex = chunkStart + idx;
      const isActive = globalIndex === activeWordIndex;
      const wordText = word.toUpperCase();
      const wWidth = wordWidths[idx];

      ctx.save();

      if (isActive) {
        // Hormozi pop scale
        const popScale = 1.18;
        const wordCenterX = currentX + wWidth / 2;
        const wordCenterY = lineY - baseFontSize * 0.3;

        ctx.translate(wordCenterX, wordCenterY);
        ctx.scale(popScale, popScale);
        ctx.translate(-wordCenterX, -wordCenterY);

        // Highlight colors
        if (preset === 'hormozi_yellow') {
          ctx.fillStyle = '#FFE500'; // Viral Yellow
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 8;
        } else if (preset === 'neon_beast') {
          ctx.fillStyle = '#00F0FF';
          ctx.strokeStyle = '#FF007F';
          ctx.lineWidth = 7;
          ctx.shadowColor = '#FF007F';
          ctx.shadowBlur = 15;
        } else if (preset === 'cartoon_comic') {
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 10;
        } else if (preset === 'danger_red') {
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 6;
        } else if (preset === 'cyber_violet') {
          ctx.fillStyle = '#e879f9';
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 7;
        } else if (preset === 'bold_white_glow') {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 9;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowBlur = 14;
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 6;
        }
      } else {
        // Inactive words in the chunk
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 7;
        if (preset === 'cartoon_comic') {
          ctx.lineWidth = 8;
        }
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.strokeText(wordText, currentX, lineY);
      ctx.fillText(wordText, currentX, lineY);

      // If active word and autoEmojis is on, draw emoji bump
      if (isActive && project.autoEmojis && scene.emojiAccent) {
        ctx.font = `28px sans-serif`;
        ctx.fillText(scene.emojiAccent, currentX + wWidth + 4, lineY);
        // revert font
        ctx.font = `900 ${baseFontSize}px ${fontName}`;
      }

      ctx.restore();
      currentX += wWidth + spaceWidth;
    });

    ctx.restore();
  }

  // Draw TikTok / Reels UI overlays to test safe areas
  private drawTikTokMockUI(project: Project, totalTime: number) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;
    const H = CanvasRenderer.HEIGHT;

    ctx.save();

    // Right action buttons (Like, Comment, Save, Share, Sound Disc)
    const rightX = W - 60;
    const actions = [
      { icon: '❤️', count: '142.6K', y: H * 0.52 },
      { icon: '💬', count: '2,890', y: H * 0.61 },
      { icon: '🔖', count: '18.4K', y: H * 0.70 },
      { icon: '↗️', count: 'Share', y: H * 0.79 },
    ];

    actions.forEach((act) => {
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(act.icon, rightX, act.y);

      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(act.count, rightX, act.y + 24);
    });

    // Spinning Vinyl Sound Disc at bottom right
    const discY = H * 0.88;
    ctx.save();
    ctx.translate(rightX, discY);
    ctx.rotate(totalTime * 3);
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.restore();

    // Bottom left account info & caption safe zone
    ctx.textAlign = 'left';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText('@storyflix.ai', 30, H * 0.88);

    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    const captionPreview = `${project.title} • ${project.hashtags.slice(0, 3).join(' ')}`;
    ctx.fillText(captionPreview.slice(0, 42) + '...', 30, H * 0.91);

    // Audio song ticker
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`🎵 Original Sound - storyflixAI Viral Studio`, 30, H * 0.94);

    // Safe area guides (Subtle semi-transparent red dashed line at top & bottom)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    // Top safe margin (100px)
    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.lineTo(W - 20, 100);
    ctx.stroke();

    // Bottom safe margin (H - 180px)
    ctx.beginPath();
    ctx.moveTo(20, H - 180);
    ctx.lineTo(W - 20, H - 180);
    ctx.stroke();

    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.fillText('TIKTOK SAFE ZONE TOP', 25, 92);
    ctx.fillText('TIKTOK SAFE ZONE BOTTOM', 25, H - 188);

    ctx.restore();
  }

  private getImage(url: string): HTMLImageElement | null {
    if (!this.imgCache.has(url)) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.onImageLoaded?.();
      };
      img.src = url;
      this.imgCache.set(url, img);
    }
    return this.imgCache.get(url) || null;
  }

  private getCharacterImage(id: string, svg: string): HTMLImageElement | null {
    if (!this.characterImgCache.has(id)) {
      const img = new Image();
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      img.onload = () => {
        this.onImageLoaded?.();
      };
      img.src = URL.createObjectURL(blob);
      this.characterImgCache.set(id, img);
    }
    return this.characterImgCache.get(id) || null;
  }
}
