import { Project, Scene, VideoFormat, VideoTone } from '../types/studio';
import { generateAutoCaptions } from './autoCaptionGenerator';
import { generateCinematicSceneVisual, getAIImageUrl } from './cinematicArtEngine';

/**
 * Universal Text-to-Video Engine
 * Takes ANY prompt text (from a single sentence to a multi-paragraph script)
 * and transforms it into a complete, high-retention 9:16 vertical video project
 * with real AI scene visuals, animated TikTok split-screen, sound cues, and timed subtitles.
 */
export function parseAnyPromptToVideo(
  promptText: string,
  options: {
    format?: VideoFormat;
    tone?: VideoTone;
    targetDurationSec?: number;
  } = {}
): Partial<Project> {
  const cleanText = promptText.trim();
  const lower = cleanText.toLowerCase();

  // Smart Format Detection
  let format: VideoFormat = options.format || 'viral_facts';
  if (!options.format) {
    if (lower.includes('cartoon') || lower.includes('animation') || lower.includes('dragon') || lower.includes('fairy') || lower.includes('kid')) {
      format = 'cartoon_story';
    } else if (lower.includes('horror') || lower.includes('ghost') || lower.includes('scary') || lower.includes('haunt') || lower.includes('mystery')) {
      format = 'conspiracy_mystery';
    } else if (lower.includes('reddit') || lower.includes('confess') || lower.includes('aita') || lower.includes('my boss') || lower.includes('storytime')) {
      format = 'reddit_story';
    }
  }

  const tone: VideoTone = options.tone || (format === 'conspiracy_mystery' ? 'dark_mystery' : 'fast_viral');
  const isCartoon = format === 'cartoon_story';

  // 1. Break text into sentences or meaningful chunks
  const sentences = cleanText
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  // If text has no sentence delimiters, break by commas or character chunks
  let sceneTexts: string[] = [];
  if (sentences.length >= 2) {
    sceneTexts = sentences;
  } else if (cleanText.length > 100) {
    const words = cleanText.split(/\s+/);
    const chunkSize = Math.max(8, Math.ceil(words.length / 4));
    for (let i = 0; i < words.length; i += chunkSize) {
      sceneTexts.push(words.slice(i, i + chunkSize).join(' '));
    }
  } else {
    // Short one-liner prompt: expand into a 3-part viral mini-story
    sceneTexts = [
      `Here is the untold truth about ${cleanText.toLowerCase()} that almost nobody knows.`,
      `Most people believe the exact opposite, but here is what actually happens behind the scenes.`,
      `Save this video right now before you forget, and share it with someone who needs to see this!`
    ];
  }

  // Cap scenes to maximum 8 for optimal TikTok 9:16 retention
  const finalSceneTexts = sceneTexts.slice(0, 8);

  const cameraEffects: ('zoom_in' | 'zoom_out' | 'pan_left' | 'pan_right' | 'shake' | 'flash_cut')[] = [
    'zoom_in',
    'pan_left',
    'shake',
    'pan_right',
    'zoom_out',
    'flash_cut'
  ];

  const soundCues: ('whoosh' | 'vine_boom' | 'sub_drop' | 'cash_register' | 'chime' | 'record_scratch' | 'alert_stinger')[] = [
    'whoosh',
    'vine_boom',
    'sub_drop',
    'alert_stinger',
    'cash_register',
    'chime'
  ];

  const badges = [
    'WAIT FOR IT...',
    'SECRET EXPOSED',
    'PLOT TWIST',
    'DID YOU KNOW?',
    'MIND BLOWN 🤯',
    'DON’T SKIP',
    'PART 1'
  ];

  const emojis = ['🤯🔥', '💀👀', '⚡🚀', '👑💎', '🎯✨', '😱🚨'];

  // 2. Generate Scenes with High-Res AI Art + Instant Procedural SVG Fallback
  const scenes: Scene[] = finalSceneTexts.map((text, idx) => {
    const wordCount = text.split(/\s+/).length;
    const duration = Math.min(6.0, Math.max(3.2, Number((wordCount / 2.8).toFixed(1))));
    const emotion = idx === 0 ? 'shocked' : idx % 2 === 0 ? 'heroic' : 'confident';
    const visualPrompt = `${text}, vertical 9:16 cinematic framing, vibrant lighting, highly detailed subject`;

    return {
      id: `sc_${Date.now()}_${idx}`,
      sceneNumber: idx + 1,
      durationSec: duration,
      narration: text,
      visualDescription: visualPrompt,
      visualStyleKeywords: isCartoon
        ? 'Pixar 3D animated character, rich volumetric studio light'
        : 'Cinematic 9:16 vertical, dramatic lighting, photorealistic atmosphere',
      imageUrl: getAIImageUrl(visualPrompt, isCartoon, idx),
      fallbackSvg: generateCinematicSceneVisual(text, {
        format,
        isCartoon,
        emotion,
        sceneNumber: idx + 1
      }),
      cameraEffect: cameraEffects[idx % cameraEffects.length],
      soundEffectCue: soundCues[idx % soundCues.length],
      overlayBadge: badges[idx % badges.length],
      emojiAccent: emojis[idx % emojis.length],
      characterEmotion: emotion
    };
  });

  // 3. Generate Auto-Captions
  const subtitleBlocks = generateAutoCaptions(scenes);

  // 4. Derive catchy title & hashtags
  const firstSentence = finalSceneTexts[0] || 'Viral Video';
  const shortTitle = firstSentence.length > 45 ? `${firstSentence.slice(0, 42)}...` : firstSentence;
  const hashtags = ['#fyp', '#viral', '#tiktok', '#storytime', '#trending', '#shorts'];

  return {
    title: shortTitle,
    viralHook: firstSentence,
    tiktokCaption: `Wait until the end... 🤯\n\nDrop your thoughts in the comments! 👇`,
    hashtags,
    format,
    tone,
    cartoonStyle: isCartoon ? 'pixar_3d' : undefined,
    characterAvatar: isCartoon ? 'sir_reginald' : undefined,
    // Enable TikTok Split-Screen (Minecraft parkour / subway surfer) for viral formats
    splitScreenMode: !isCartoon,
    splitScreenType: 'minecraft_parkour',
    captionPreset: isCartoon ? 'cartoon_comic' : 'hormozi_yellow',
    captionYPercent: !isCartoon ? 52 : 68,
    captionFontSize: 34,
    autoEmojis: true,
    bgmTrack: isCartoon ? 'cartoon_quirky' : 'phonk_drift',
    scenes,
    autoCaptionsEnabled: true,
    subtitleBlocks
  };
}
