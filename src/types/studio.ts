export type VideoFormat =
  | 'viral_facts'
  | 'cartoon_story'
  | 'fruit_drama'
  | 'reddit_story'
  | 'conspiracy_mystery'
  | 'motivation_mindset'
  | 'what_if'
  | 'comedy_skit'
  | 'tech_future';

export type VideoTone =
  | 'fast_viral'
  | 'dramatic_suspense'
  | 'funny_cartoon'
  | 'dark_mystery'
  | 'motivational'
  | 'absurd_meme'
  | 'dramatic_telenovela';

export type CameraEffect =
  | 'zoom_in'
  | 'zoom_out'
  | 'pan_left'
  | 'pan_right'
  | 'shake'
  | 'flash_cut';

export type SoundEffectCue =
  | 'vine_boom'
  | 'whoosh'
  | 'sub_drop'
  | 'cash_register'
  | 'chime'
  | 'record_scratch'
  | 'alert_stinger'
  | 'dramatic_slap'
  | 'water_splash'
  | 'gasp'
  | 'villain_laugh'
  | 'none';

export type CharacterEmotion =
  | 'neutral'
  | 'shocked'
  | 'heroic'
  | 'laughing'
  | 'scheming'
  | 'thinking'
  | 'angry'
  | 'crying'
  | 'confident';

export type CartoonStyle =
  | 'pixar_3d'
  | 'fruit_3d'
  | 'anime_manga'
  | 'comic_book'
  | 'chibi_fantasy'
  | 'cyberpunk_retro'
  | 'claymation';

export type CaptionPreset =
  | 'hormozi_yellow'
  | 'neon_beast'
  | 'cartoon_comic'
  | 'minimal_glass'
  | 'danger_red'
  | 'cyber_violet';

export interface Scene {
  id: string;
  sceneNumber: number;
  durationSec: number;
  narration: string;
  visualDescription: string;
  visualStyleKeywords?: string;
  imageUrl?: string;
  fallbackSvg?: string;
  bgTheme?: string;
  cameraEffect: CameraEffect;
  soundEffectCue: SoundEffectCue;
  overlayBadge: string;
  emojiAccent: string;
  characterEmotion?: CharacterEmotion;
  dialogueSpeaker?: string;
  audioUrl?: string; // Generated TTS audio
  words?: { word: string; start: number; end: number }[];
}

export interface SubtitleBlock {
  id: string;
  sceneIndex: number;
  text: string;
  startSec: number;
  endSec: number;
  words?: { word: string; start: number; end: number }[];
}

export interface Project {
  id: string;
  title: string;
  viralHook: string;
  tiktokCaption: string;
  hashtags: string[];
  format: VideoFormat;
  tone: VideoTone;
  cartoonStyle: CartoonStyle;
  captionPreset: CaptionPreset;
  captionYPercent: number; // Vertical position in % from top (e.g. 70%)
  captionFontSize: number;
  autoEmojis: boolean;
  bgmTrack: string; // 'phonk_drift' | 'lo_fi_chill' | 'suspense_dark' | 'upbeat_pop' | 'cartoon_quirky' | 'cyber_synth' | 'none'
  bgmVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1
  voiceSpeaker: string; // 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon'
  scenes: Scene[];
  characterName?: string;
  characterAvatar?: string;
  autoCaptionsEnabled?: boolean;
  subtitleBlocks?: SubtitleBlock[];
  captionTimingOffsetSec?: number; // micro-timing adjustments
  splitScreenMode?: boolean; // TikTok/Shorts Split-screen with viral B-Roll at bottom
  splitScreenType?: 'minecraft_parkour' | 'neon_grid' | 'satisfying_sand';
}

export interface CharacterPreset {
  id: string;
  name: string;
  tagline: string;
  style: CartoonStyle;
  avatarSvg: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
