export type VideoFormat =
  | 'real_human'
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
  | 'authentic_ugc'
  | 'cinematic_documentary'
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
  | 'real_human'
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
  | 'cyber_violet'
  | 'bold_white_glow';

export type ImageGenModelType = 'flux_1' | 'midjourney_v6' | 'imagen_3';
export type VideoGenModelType = 'kling_4' | 'runway_gen3' | 'luma_dream' | 'sora';
export type MotionControlType =
  | 'zoom_in'
  | 'zoom_out'
  | 'pan_left'
  | 'pan_right'
  | 'push_in'
  | 'orbit'
  | 'dolly_zoom'
  | 'drone_rise'
  | 'handheld';

export interface PromptExpansionDetails {
  cinematography: string;
  lighting: string;
  atmosphere: string;
  colorGrading: string;
  motionGuidance: string;
}

export interface MotionControlConfig {
  type: MotionControlType;
  strength: number; // 1 to 10
  cameraPath: string;
  motionPrompt?: string;
  fps: number; // 30 | 60
}

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
  videoUrl?: string; // Real full-motion video clip (e.g. uploaded MP4 or rendered video)
  dialogueSpeaker?: string;
  audioUrl?: string; // Generated TTS audio
  words?: { word: string; start: number; end: number }[];
  // 4-Stage Cinematic Video Pipeline fields
  expandedPrompt?: string;
  promptExpansionDetails?: PromptExpansionDetails;
  imageGenModel?: ImageGenModelType;
  keyframeImageUrl?: string;
  videoGenModel?: VideoGenModelType;
  motionControl?: MotionControlConfig;
  motionVideoUrl?: string;
  pipelineStatus?: 'idle' | 'expanding_prompt' | 'generating_frame' | 'synthesizing_motion' | 'ready';
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
  showCartoonAvatar?: boolean; // When false, suppresses cartoon character drawing on screen
  activeVideoUrl?: string; // Real full-motion MP4 video playing on preview screen
  realHumanMode?: boolean;
  actorPersona?: string;
  autoCaptionsEnabled?: boolean;
  subtitleBlocks?: SubtitleBlock[];
  captionTimingOffsetSec?: number; // micro-timing adjustments
  splitScreenMode?: boolean; // TikTok/Shorts Split-screen with viral B-Roll at bottom
  splitScreenType?: 'minecraft_parkour' | 'subway_surfer' | 'gta_ramp' | 'satisfying_sand' | 'neon_grid' | 'custom_video';
  splitBottomVideoUrl?: string; // Optional custom video or mp4 path (e.g. /samples/minecraft_parkour.mp4)
  splitTopVideoUrl?: string; // Optional custom top video (e.g. /samples/cinematic_scene.mp4)
  splitRatio?: '50_50' | '55_45' | '60_40'; // 50_50 = 1080x960 each (exact ffmpeg vstack)
  splitDividerStyle?: 'neon_glow' | 'minimal_black' | 'laser_line' | 'none';
}

export interface CharacterPreset {
  id: string;
  name: string;
  tagline: string;
  style: CartoonStyle;
  avatarSvg: string;
  isRealHuman?: boolean;
  photoUrl?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
