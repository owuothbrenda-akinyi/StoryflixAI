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
    if (
      lower.includes('real human') ||
      lower.includes('real person') ||
      lower.includes('human video') ||
      lower.includes('real actor') ||
      lower.includes('actress') ||
      lower.includes('ugc') ||
      lower.includes('influencer') ||
      lower.includes('talking head') ||
      lower.includes('podcast host') ||
      lower.includes('vlog')
    ) {
      format = 'real_human';
    } else if (
      lower.includes('pineapple') ||
      lower.includes('grape') ||
      lower.includes('fruit') ||
      lower.includes('vegetable') ||
      lower.includes('halastory') ||
      lower.includes('telenovela') ||
      lower.includes('pepper') ||
      lower.includes('carrot') ||
      lower.includes('soap opera')
    ) {
      format = 'fruit_drama';
    } else if (lower.includes('cartoon') || lower.includes('animation') || lower.includes('dragon') || lower.includes('fairy') || lower.includes('kid')) {
      format = 'cartoon_story';
    } else if (lower.includes('horror') || lower.includes('ghost') || lower.includes('scary') || lower.includes('haunt') || lower.includes('mystery')) {
      format = 'conspiracy_mystery';
    } else if (lower.includes('reddit') || lower.includes('confess') || lower.includes('aita') || lower.includes('my boss') || lower.includes('storytime')) {
      format = 'reddit_story';
    }
  }

  const isFruitDrama = format === 'fruit_drama';
  const isRealHuman = format === 'real_human';
  const isCartoon = format === 'cartoon_story' || isFruitDrama;
  const tone: VideoTone =
    options.tone ||
    (isFruitDrama
      ? 'dramatic_telenovela'
      : isRealHuman
      ? 'authentic_ugc'
      : format === 'conspiracy_mystery'
      ? 'dark_mystery'
      : 'fast_viral');

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
    const visualPrompt = isRealHuman
      ? `authentic 4k vertical 9:16 video frame of real human creator talking into camera, natural skin texture, real expressions, ${text}`
      : `${text}, vertical 9:16 cinematic framing, vibrant lighting, highly detailed subject`;

    return {
      id: `sc_${Date.now()}_${idx}`,
      sceneNumber: idx + 1,
      durationSec: duration,
      narration: text,
      visualDescription: visualPrompt,
      visualStyleKeywords: isRealHuman
        ? 'Shot on iPhone 16 Pro 4k video 35mm lens, authentic living human creator, real skin texture, natural studio light'
        : isCartoon
        ? 'Pixar 3D animated character, rich volumetric studio light'
        : 'Cinematic 9:16 vertical, dramatic lighting, photorealistic atmosphere',
      imageUrl: getAIImageUrl(visualPrompt, isRealHuman ? 'real_human' : isCartoon, idx),
      keyframeImageUrl: getAIImageUrl(visualPrompt, isRealHuman ? 'real_human' : isCartoon, idx),
      expandedPrompt: visualPrompt,
      imageGenModel: 'flux_1',
      videoGenModel: 'kling_4',
      motionControl: {
        type: cameraEffects[idx % cameraEffects.length] as any,
        strength: 6,
        cameraPath: `Cinematic ${cameraEffects[idx % cameraEffects.length].replace('_', ' ')} with Kling 4.0 motion interpolation`,
        fps: 60
      },
      pipelineStatus: 'ready',
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
  const hashtags = isRealHuman
    ? ['#realhuman', '#ugc', '#creator', '#storytime', '#fyp', '#viral']
    : ['#fyp', '#viral', '#tiktok', '#storytime', '#trending', '#shorts'];

  return {
    title: shortTitle,
    viralHook: firstSentence,
    tiktokCaption: isRealHuman
      ? `Real talk... this changed everything. Drop your thoughts below! 👇📱`
      : `Wait until the end... 🤯\n\nDrop your thoughts in the comments! 👇`,
    hashtags,
    format,
    tone,
    cartoonStyle: isFruitDrama ? 'fruit_3d' : isCartoon ? 'pixar_3d' : isRealHuman ? 'real_human' : undefined,
    characterName: isFruitDrama ? 'Miss Pineapple' : isCartoon ? 'Sir Reginald' : isRealHuman ? 'Sarah Jenkins' : undefined,
    characterAvatar: isFruitDrama ? 'pineapple_bride' : isCartoon ? 'sir_reginald' : isRealHuman ? 'sarah_creator' : undefined,
    realHumanMode: isRealHuman,
    actorPersona: isRealHuman ? 'Sarah Jenkins (UGC Creator)' : undefined,
    // Real human and fruit drama videos fill the full 9:16 frame; split-screen for facts
    splitScreenMode: !isCartoon && !isRealHuman,
    splitScreenType: 'minecraft_parkour',
    captionPreset: isRealHuman ? 'bold_white_glow' : isCartoon ? 'cartoon_comic' : 'hormozi_yellow',
    captionYPercent: isRealHuman ? 74 : (!isCartoon ? 52 : 68),
    captionFontSize: 34,
    autoEmojis: true,
    bgmTrack: isFruitDrama ? 'soap_opera_drama' : isRealHuman ? 'lofi_chill' : isCartoon ? 'cartoon_quirky' : 'phonk_drift',
    bgmVolume: 0.35,
    voiceSpeaker: isFruitDrama ? 'Kore' : isRealHuman ? 'Kore' : isCartoon ? 'Puck' : 'Fenrir',
    scenes,
    autoCaptionsEnabled: true,
    subtitleBlocks
  };
}
