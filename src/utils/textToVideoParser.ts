import { Project, Scene, VideoFormat, VideoTone } from '../types/studio';
import { generateAutoCaptions } from './autoCaptionGenerator';

/**
 * Universal Text-to-Video Engine
 * Takes ANY prompt text (from a single sentence to a multi-paragraph script)
 * and transforms it into a complete, high-retention 9:16 vertical video project.
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
  const format = options.format || (cleanText.toLowerCase().includes('cartoon') ? 'cartoon_story' : 'viral_facts');
  const tone = options.tone || 'fast_viral';

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
    // Split into 3-4 chunks
    const words = cleanText.split(/\s+/);
    const chunkSize = Math.max(8, Math.ceil(words.length / 4));
    for (let i = 0; i < words.length; i += chunkSize) {
      sceneTexts.push(words.slice(i, i + chunkSize).join(' '));
    }
  } else {
    // Short one-liner prompt: expand into a 3-part viral mini-story
    const titleCore = cleanText.replace(/^[a-z]/, (c) => c.toUpperCase());
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

  // 2. Generate Scenes
  const scenes: Scene[] = finalSceneTexts.map((text, idx) => {
    const wordCount = text.split(/\s+/).length;
    // Calculate realistic reading duration (approx 2.8 words per second, min 3s, max 6s)
    const duration = Math.min(6.0, Math.max(3.2, Number((wordCount / 2.8).toFixed(1))));

    return {
      id: `sc_${Date.now()}_${idx}`,
      sceneNumber: idx + 1,
      durationSec: duration,
      narration: text,
      visualDescription: `Cinematic 9:16 vertical shot illustrating: ${text}. Hyper-detailed, rich volumetric lighting, high dynamic range.`,
      visualStyleKeywords: 'Cinematic 9:16, 8k resolution, dramatic rim lighting, vibrant atmosphere',
      cameraEffect: cameraEffects[idx % cameraEffects.length],
      soundEffectCue: soundCues[idx % soundCues.length],
      overlayBadge: badges[idx % badges.length],
      emojiAccent: emojis[idx % emojis.length],
      characterEmotion: idx === 0 ? 'shocked' : idx % 2 === 0 ? 'heroic' : 'confident'
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
    scenes,
    autoCaptionsEnabled: true,
    subtitleBlocks
  };
}
