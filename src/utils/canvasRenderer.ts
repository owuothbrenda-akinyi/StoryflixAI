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
    this.ctx = canvas.getContext('2d', { alpha: false })!;
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

    // 1. Calculate Camera Transform (Zoom, Pan, Shake, Flash)
    let scale = 1.0;
    let offsetX = 0;
    let offsetY = 0;

    switch (scene.cameraEffect) {
      case 'zoom_in':
        scale = 1.0 + sceneProgress * 0.16;
        break;
      case 'zoom_out':
        scale = 1.16 - sceneProgress * 0.16;
        break;
      case 'pan_left':
        offsetX = (sceneProgress - 0.5) * 50;
        scale = 1.08;
        break;
      case 'pan_right':
        offsetX = (0.5 - sceneProgress) * 50;
        scale = 1.08;
        break;
      case 'shake':
        // High frequency shake for first 0.6 seconds or periodic
        if (sceneProgress < 0.35) {
          const intensity = (1 - sceneProgress / 0.35) * 16;
          offsetX = (Math.sin(totalTime * 45) + Math.cos(totalTime * 30)) * intensity * 0.5;
          offsetY = (Math.cos(totalTime * 50) + Math.sin(totalTime * 25)) * intensity * 0.5;
        }
        scale = 1.05;
        break;
      case 'flash_cut':
        scale = 1.0 + Math.sin(sceneProgress * Math.PI) * 0.08;
        break;
    }

    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2 + offsetX, -H / 2 + offsetY);

    // 2. Draw Background
    this.drawBackground(scene, totalTime, sceneProgress, project);

    ctx.restore(); // Restore camera transform for stable UI overlays

    // 3. Draw Cartoon Character (if cartoon format or avatar enabled)
    if (project.format === 'cartoon_story' || project.characterAvatar) {
      this.drawCartoonCharacter(scene, sceneProgress, totalTime, project);
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
    const splitY = isSplit ? Math.round(H * 0.54) : H;
    const topH = splitY;

    // Draw Main Scene (Image or Generative Procedural) in upper/full viewport
    ctx.save();
    if (isSplit) {
      ctx.beginPath();
      ctx.rect(0, 0, W, topH);
      ctx.clip();
    }

    this.drawSceneArt(scene, totalTime, progress, project, W, topH);
    ctx.restore();

    // If split-screen, draw dynamic satisfying B-roll on bottom half
    if (isSplit) {
      const bottomH = H - splitY;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, splitY, W, bottomH);
      ctx.clip();
      this.drawSplitScreenBRoll(splitY, bottomH, totalTime, project.splitScreenType || 'minecraft_parkour');
      ctx.restore();

      // Sleek Split Divider
      ctx.save();
      const divGrad = ctx.createLinearGradient(0, splitY, W, splitY);
      divGrad.addColorStop(0, '#f43f5e');
      divGrad.addColorStop(0.5, '#fbbf24');
      divGrad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = divGrad;
      ctx.fillRect(0, splitY - 3, W, 6);

      // Divider pill badge
      const pillW = 280;
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
      ctx.fillText('⚡ AI MOVIE STORY • PARKOUR B-ROLL ⚡', W / 2, splitY);
      ctx.restore();
    }
  }

  private drawSceneArt(scene: Scene, totalTime: number, progress: number, project: Project, W: number, H: number) {
    const ctx = this.ctx;

    // 1. Draw Scene Image Artwork (AI photoreal image or instant SVG scene) with Kinetic Ken Burns Motion
    let img: HTMLImageElement | null = null;
    if (scene.imageUrl) {
      const candidate = this.getImage(scene.imageUrl);
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

  private drawSplitScreenBRoll(startY: number, height: number, totalTime: number, type: string) {
    const ctx = this.ctx;
    const W = CanvasRenderer.WIDTH;

    if (type === 'neon_grid') {
      // 80s Synthwave Outrun Highway
      const bgGrad = ctx.createLinearGradient(0, startY, 0, startY + height);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.4, '#2e1065');
      bgGrad.addColorStop(1, '#4c0519');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, startY, W, height);

      // Retro Neon Sun
      const sunY = startY + 90;
      const sunGrad = ctx.createLinearGradient(0, sunY - 60, 0, sunY + 60);
      sunGrad.addColorStop(0, '#fde047');
      sunGrad.addColorStop(1, '#f43f5e');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(W / 2, sunY, 65, 0, Math.PI * 2);
      ctx.fill();

      // Sun horizontal stripes
      ctx.fillStyle = '#2e1065';
      for (let s = 0; s < 5; s++) {
        ctx.fillRect(W / 2 - 70, sunY + s * 12 + 6, 140, 4 + s);
      }

      // Perspective Grid Floor
      const horizonY = startY + 110;
      const floorH = height - 110;
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
      ctx.lineWidth = 2;

      // Vertical perspective vanishing rays
      for (let vx = -W; vx <= W * 2; vx += 70) {
        ctx.beginPath();
        ctx.moveTo(W / 2, horizonY);
        ctx.lineTo(vx, startY + height);
        ctx.stroke();
      }

      // Horizontal speed lines moving downwards
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
    } else {
      // Default: Minecraft-style Isometric Parkour Runner
      const bgGrad = ctx.createLinearGradient(0, startY, 0, startY + height);
      bgGrad.addColorStop(0, '#1c1917');
      bgGrad.addColorStop(0.65, '#451a03');
      bgGrad.addColorStop(1, '#9a3412');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, startY, W, height);

      // Bubbling lava lake at the bottom
      const lavaY = startY + height - 70;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, lavaY, W, 70);
      for (let i = 0; i < 12; i++) {
        const lx = ((i * 65 + totalTime * 40) % (W + 60)) - 30;
        const ly = lavaY + 20 + Math.sin(totalTime * 3 + i) * 15;
        const lr = 8 + (i % 4) * 4;
        ctx.beginPath();
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
      }

      // Floating 3D Isometric Minecraft Parkour Blocks scrolling down
      const blockSpeed = 160;
      const numBlocks = 6;
      for (let i = 0; i < numBlocks; i++) {
        const offset = (totalTime * blockSpeed + i * 140) % (height + 160);
        const by = startY - 60 + offset;
        const bx = W / 2 + Math.sin(i * 2.2 + totalTime * 0.8) * 160;
        const bw = 100;
        const bh = 50;

        // Block Shadow on lava
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(bx, lavaY - 10, bw * 0.5, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Isometric Grass Block Top
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + bw / 2, by + 20);
        ctx.lineTo(bx, by + 40);
        ctx.lineTo(bx - bw / 2, by + 20);
        ctx.closePath();
        ctx.fill();

        // Dirt Left Face
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2, by + 20);
        ctx.lineTo(bx, by + 40);
        ctx.lineTo(bx, by + 40 + bh);
        ctx.lineTo(bx - bw / 2, by + 20 + bh);
        ctx.closePath();
        ctx.fill();

        // Dirt Right Face (shaded)
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(bx, by + 40);
        ctx.lineTo(bx + bw / 2, by + 20);
        ctx.lineTo(bx + bw / 2, by + 20 + bh);
        ctx.lineTo(bx, by + 40 + bh);
        ctx.closePath();
        ctx.fill();

        // Pixel Grass Dripping overhang
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(bx - 20, by + 32, 10, 12);
        ctx.fillRect(bx + 8, by + 28, 12, 14);

        // Floating Gold Coin / XP Orb on top of block
        const coinBob = Math.sin(totalTime * 6 + i) * 8;
        ctx.save();
        ctx.translate(bx, by + 10 + coinBob);
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Parkour Player Jumping Cursor
      const jumpY = startY + height * 0.45 + Math.abs(Math.sin(totalTime * 8)) * -40;
      ctx.save();
      ctx.translate(W / 2, jumpY);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      this.roundRect(-16, -20, 32, 28, 6);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-12, 8, 8, 16);
      ctx.fillRect(4, 8, 8, 16);
      ctx.restore();
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
    const defaultYPercent = isSplit ? 60 : 68;
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
