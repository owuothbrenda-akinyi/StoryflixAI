import { CharacterPreset, Project } from '../types/studio';
import { generateCinematicSceneVisual } from '../utils/cinematicArtEngine';

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    id: 'detective_barnaby',
    name: 'Detective Barnaby',
    tagline: 'Gruff but witty private investigator with a magnifying glass',
    style: 'pixar_3d',
    colorScheme: { primary: '#f59e0b', secondary: '#1e293b', accent: '#ef4444' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#fde68a"/>
      <path d="M20 38 Q50 20 80 38 L85 45 Q50 30 15 45 Z" fill="#78350f"/>
      <rect x="25" y="24" width="50" height="15" rx="6" fill="#92400e"/>
      <circle cx="38" cy="52" r="6" fill="#1e293b"/>
      <circle cx="62" cy="52" r="6" fill="#1e293b"/>
      <circle cx="40" cy="50" r="2" fill="#ffffff"/>
      <circle cx="64" cy="50" r="2" fill="#ffffff"/>
      <path d="M35 68 Q50 80 65 68" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <path d="M32 44 Q40 40 46 44" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <path d="M54 44 Q60 40 68 44" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <circle cx="68" cy="66" r="10" stroke="#f59e0b" stroke-width="3" fill="#60a5fa" fill-opacity="0.3"/>
      <line x1="75" y1="73" x2="86" y2="84" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'ninja_kai',
    name: 'Cyber Ninja Kai',
    tagline: 'Neon katana wielder jumping across Neo-Tokyo rooftops',
    style: 'anime_manga',
    colorScheme: { primary: '#06b6d4', secondary: '#3b82f6', accent: '#ec4899' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#0f172a"/>
      <path d="M22 36 L78 36 L82 52 L18 52 Z" fill="#06b6d4"/>
      <line x1="28" y1="44" x2="44" y2="44" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <line x1="56" y1="44" x2="72" y2="44" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <circle cx="36" cy="44" r="3" fill="#ec4899"/>
      <circle cx="64" cy="44" r="3" fill="#ec4899"/>
      <path d="M20 54 Q50 68 80 54 L85 75 Q50 92 15 75 Z" fill="#1e293b"/>
      <path d="M42 66 Q50 72 58 66" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
      <path d="M82 30 L95 18 M84 40 L98 35" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'robo_bit',
    name: 'Byte the Bot',
    tagline: 'Hyperactive mini robot with glitchy holographic emotions',
    style: 'chibi_fantasy',
    colorScheme: { primary: '#10b981', secondary: '#059669', accent: '#fbbf24' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="24" width="60" height="52" rx="14" fill="#334155"/>
      <rect x="26" y="32" width="48" height="36" rx="8" fill="#022c22"/>
      <circle cx="50" cy="14" r="6" fill="#10b981"/>
      <line x1="50" y1="20" x2="50" y2="24" stroke="#64748b" stroke-width="4"/>
      <rect x="33" y="42" width="10" height="14" rx="3" fill="#34d399"/>
      <rect x="57" y="42" width="10" height="14" rx="3" fill="#34d399"/>
      <line x1="40" y1="60" x2="60" y2="60" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <circle cx="15" cy="50" r="5" fill="#10b981"/>
      <circle cx="85" cy="50" r="5" fill="#10b981"/>
    </svg>`
  },
  {
    id: 'sir_reginald',
    name: 'Sir Reginald',
    tagline: 'Clumsy knight who travels through comedic time warps',
    style: 'comic_book',
    colorScheme: { primary: '#f43f5e', secondary: '#881337', accent: '#facc15' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 35 Q50 15 75 35 L80 75 Q50 88 20 75 Z" fill="#94a3b8"/>
      <path d="M46 15 Q50 5 54 15 L52 28 L48 28 Z" fill="#f43f5e"/>
      <path d="M35 10 Q50 0 65 10 L50 20 Z" fill="#e11d48"/>
      <rect x="30" y="42" width="40" height="14" rx="4" fill="#0f172a"/>
      <circle cx="42" cy="49" r="4" fill="#facc15"/>
      <circle cx="58" cy="49" r="4" fill="#facc15"/>
      <path d="M38 68 Q50 78 62 68" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <line x1="30" y1="56" x2="70" y2="56" stroke="#475569" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'pineapple_bride',
    name: 'Miss Pineapple',
    tagline: 'Heartbroken bride turned fierce billionaire CEO',
    style: 'fruit_3d',
    colorScheme: { primary: '#eab308', secondary: '#15803d', accent: '#f43f5e' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="58" rx="34" ry="38" fill="#eab308"/>
      <path d="M25 45 L75 75 M25 75 L75 45 M20 58 L80 58" stroke="#a16207" stroke-width="2.5"/>
      <polygon points="30,30 50,2 42,28 62,8 54,30 72,16 60,32" fill="#15803d"/>
      <ellipse cx="38" cy="54" rx="8" ry="10" fill="#ffffff"/>
      <ellipse cx="62" cy="54" rx="8" ry="10" fill="#ffffff"/>
      <circle cx="38" cy="54" r="5" fill="#1e1b4b"/>
      <circle cx="62" cy="54" r="5" fill="#1e1b4b"/>
      <circle cx="40" cy="52" r="2" fill="#ffffff"/>
      <circle cx="64" cy="52" r="2" fill="#ffffff"/>
      <path d="M38 72 Q50 82 62 72" stroke="#e11d48" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 32 Q50 20 70 32 L80 90 Q50 96 20 90 Z" fill="#ffffff" opacity="0.3"/>
    </svg>`
  },
  {
    id: 'lady_grape',
    name: 'Lady Grape',
    tagline: 'Glamorous, scheming soap-opera villainess in purple gown',
    style: 'fruit_3d',
    colorScheme: { primary: '#7c3aed', secondary: '#4c1d95', accent: '#f43f5e' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="52" r="30" fill="#7c3aed"/>
      <circle cx="32" cy="40" r="18" fill="#6d28d9"/>
      <circle cx="68" cy="40" r="18" fill="#8b5cf6"/>
      <circle cx="35" cy="68" r="16" fill="#9333ea"/>
      <circle cx="65" cy="68" r="16" fill="#a855f7"/>
      <circle cx="50" cy="76" r="14" fill="#6b21a8"/>
      <path d="M42 22 Q50 6 64 18 Q52 26 42 22" fill="#22c55e"/>
      <ellipse cx="40" cy="50" rx="6" ry="8" fill="#ffffff"/>
      <ellipse cx="60" cy="50" rx="6" ry="8" fill="#ffffff"/>
      <circle cx="40" cy="50" r="4" fill="#1e1b4b"/>
      <circle cx="60" cy="50" r="4" fill="#1e1b4b"/>
      <path d="M38 66 Q52 74 62 62" stroke="#dc2626" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'sir_pepper',
    name: 'Sir Bell Pepper',
    tagline: 'Wealthy green pepper groom in a sharp tuxedo',
    style: 'fruit_3d',
    colorScheme: { primary: '#16a34a', secondary: '#09090b', accent: '#ef4444' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 38 C20 10 50 4 50 16 C50 4 80 10 76 38 C76 75 50 84 50 84 C50 84 24 75 24 38 Z" fill="#16a34a"/>
      <rect x="46" y="2" width="8" height="16" rx="3" fill="#15803d"/>
      <ellipse cx="38" cy="40" rx="6" ry="8" fill="#ffffff"/>
      <ellipse cx="62" cy="40" rx="6" ry="8" fill="#ffffff"/>
      <circle cx="38" cy="40" r="4" fill="#1e1b4b"/>
      <circle cx="62" cy="40" r="4" fill="#1e1b4b"/>
      <path d="M40 60 Q50 66 60 60" stroke="#052e16" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 84 L70 84 L80 100 L20 100 Z" fill="#09090b"/>
      <polygon points="44,88 56,88 50,94" fill="#ffffff"/>
      <polygon points="42,86 58,86 50,91" fill="#dc2626"/>
    </svg>`
  },
  {
    id: 'dr_carrot',
    name: 'Dr. Carrot',
    tagline: 'Elite fruit beauty guru and skincare doctor',
    style: 'fruit_3d',
    colorScheme: { primary: '#ea580c', secondary: '#15803d', accent: '#38bdf8' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="26,35 74,35 50,92" fill="#ea580c"/>
      <path d="M36 35 Q30 8 44 4 Q50 20 44 35 M50 35 Q50 4 58 6 Q56 22 52 35 M58 35 Q74 10 68 6 Q60 20 58 35" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="40" cy="46" rx="5" ry="6" fill="#1e1b4b"/>
      <ellipse cx="60" cy="46" rx="5" ry="6" fill="#1e1b4b"/>
      <path d="M42 64 Q50 72 58 64" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>
      <rect x="36" y="80" width="28" height="20" rx="4" fill="#ffffff"/>
    </svg>`
  },
  {
    id: 'sarah_creator',
    name: 'Sarah Jenkins',
    tagline: 'Tech & Lifestyle UGC Creator (iPhone 16 Pro 4K, Los Angeles)',
    style: 'real_human',
    isRealHuman: true,
    colorScheme: { primary: '#06b6d4', secondary: '#0f172a', accent: '#f43f5e' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sarah_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fdba74"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#sarah_bg)"/>
      <circle cx="50" cy="50" r="44" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4"/>
      <path d="M22 92 C26 72 38 68 50 68 C62 68 74 72 78 92 Z" fill="#0f172a"/>
      <rect x="44" y="54" width="12" height="18" fill="#fed7aa" rx="2"/>
      <ellipse cx="50" cy="42" rx="17" ry="21" fill="#fed7aa"/>
      <path d="M30 40 C30 20 40 18 50 18 C60 18 70 20 70 40 C70 54 67 68 65 74 C62 68 62 48 58 44 C50 44 42 44 38 52 C35 68 35 74 30 74 C31 64 30 52 30 40 Z" fill="#78350f"/>
      <ellipse cx="43" cy="40" rx="3.5" ry="2.5" fill="#451a03"/>
      <ellipse cx="57" cy="40" rx="3.5" ry="2.5" fill="#451a03"/>
      <circle cx="44" cy="39" r="1" fill="#ffffff"/>
      <circle cx="58" cy="39" r="1" fill="#ffffff"/>
      <path d="M39 36 Q43 34 47 36" stroke="#451a03" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M53 36 Q57 34 61 36" stroke="#451a03" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M44 51 Q50 56 56 51" stroke="#e11d48" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="48" y="70" width="4" height="7" rx="1.5" fill="#38bdf8"/>
      <circle cx="80" cy="22" r="4" fill="#ef4444"/>
    </svg>`
  },
  {
    id: 'marcus_finance',
    name: 'Marcus Vance',
    tagline: '7-Figure Founder & Mindset Mentor (Wall St, New York)',
    style: 'real_human',
    isRealHuman: true,
    colorScheme: { primary: '#10b981', secondary: '#022c22', accent: '#f59e0b' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="marcus_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#090d16"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#marcus_bg)"/>
      <path d="M20 92 C24 72 36 66 50 66 C64 66 76 72 80 92 Z" fill="#18181b"/>
      <polygon points="45,66 55,66 52,86 48,86" fill="#10b981"/>
      <polygon points="46,66 50,71 54,66" fill="#ffffff"/>
      <rect x="44" y="52" width="12" height="16" fill="#d97706" rx="2"/>
      <path d="M34 38 C34 24 42 20 50 20 C58 20 66 24 66 38 C66 52 59 60 50 60 C41 60 34 52 34 38 Z" fill="#d97706"/>
      <path d="M34 34 C34 20 42 16 50 16 C58 16 66 20 66 34 L66 30 C64 18 56 16 50 16 C44 16 36 18 34 30 Z" fill="#1c1917"/>
      <path d="M37 46 C37 57 44 61 50 61 C56 61 63 57 63 46 C63 48 58 53 50 53 C42 53 37 48 37 46 Z" fill="#1c1917" opacity="0.85"/>
      <circle cx="43" cy="38" r="2.5" fill="#0f172a"/>
      <circle cx="57" cy="38" r="2.5" fill="#0f172a"/>
      <circle cx="44" cy="37" r="1" fill="#ffffff"/>
      <circle cx="58" cy="37" r="1" fill="#ffffff"/>
      <path d="M45 49 Q50 51 55 49" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <circle cx="34" cy="78" r="2.5" fill="#fbbf24"/>
    </svg>`
  },
  {
    id: 'elena_actress',
    name: 'Elena Rostova',
    tagline: 'Dramatic Monologue & Storytime Actor (London)',
    style: 'real_human',
    isRealHuman: true,
    colorScheme: { primary: '#a855f7', secondary: '#3b0764', accent: '#ec4899' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="elena_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#4c1d95"/>
          <stop offset="100%" stop-color="#0f0728"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#elena_bg)"/>
      <path d="M22 92 C26 70 38 66 50 66 C62 66 74 70 78 92 Z" fill="#2e1065"/>
      <rect x="44" y="52" width="12" height="16" fill="#fed7aa"/>
      <ellipse cx="50" cy="40" rx="16" ry="19" fill="#fed7aa"/>
      <path d="M31 38 C31 20 40 16 50 16 C60 16 69 20 69 38 C69 56 66 64 64 64 C62 50 60 40 54 36 C48 36 44 42 38 52 C35 58 33 64 31 64 Z" fill="#18181b"/>
      <circle cx="43" cy="39" r="2.5" fill="#059669"/>
      <circle cx="57" cy="39" r="2.5" fill="#059669"/>
      <circle cx="44" cy="38" r="1" fill="#ffffff"/>
      <circle cx="58" cy="38" r="1" fill="#ffffff"/>
      <path d="M44 49 Q50 54 56 49" stroke="#be123c" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M12 20 L40 6 Z" stroke="#a855f7" stroke-width="2" stroke-opacity="0.4"/>
    </svg>`
  },
  {
    id: 'david_host',
    name: 'David Chen',
    tagline: 'Podcast Host & Street Interviewer (Shure SM7B Mic, Austin)',
    style: 'real_human',
    isRealHuman: true,
    colorScheme: { primary: '#f59e0b', secondary: '#1e1b4b', accent: '#3b82f6' },
    avatarSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="david_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#david_bg)"/>
      <path d="M22 92 C26 72 38 68 50 68 C62 68 74 72 78 92 Z" fill="#0284c7"/>
      <path d="M28 42 C28 22 40 18 50 18 C60 18 72 22 72 42" stroke="#1e293b" stroke-width="5" fill="none"/>
      <rect x="25" y="36" width="7" height="15" rx="3" fill="#3b82f6"/>
      <rect x="68" y="36" width="7" height="15" rx="3" fill="#3b82f6"/>
      <rect x="44" y="52" width="12" height="18" fill="#fde68a"/>
      <ellipse cx="50" cy="40" rx="16" ry="19" fill="#fde68a"/>
      <path d="M34 32 C34 20 42 17 50 17 C58 17 66 20 66 32 C60 28 40 28 34 32 Z" fill="#18181b"/>
      <circle cx="43" cy="38" r="2.5" fill="#1e293b"/>
      <circle cx="57" cy="38" r="2.5" fill="#1e293b"/>
      <path d="M44 48 Q50 53 56 48" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <rect x="58" y="62" width="14" height="24" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
      <line x1="65" y1="86" x2="65" y2="98" stroke="#475569" stroke-width="3"/>
    </svg>`
  }
];

export const PRESET_PROJECTS: Project[] = [
  {
    id: 'preset_real_human_ugc',
    title: 'The $10M Morning Routine (Real Human UGC)',
    viralHook: 'Stop scrolling your phone at 7 AM. Here is what 7-figure founders do instead.',
    tiktokCaption: 'Real talk: 99% of people destroy their dopamine before even getting out of bed. Switch to this 3-step morning protocol and see what happens. 👤📱⚡ #realhuman #ugc #founderlife #morningroutine #productivity #mindset #fyp #creator',
    hashtags: ['#realhuman', '#ugc', '#creator', '#morningroutine', '#productivity', '#mindset', '#fyp', '#viral'],
    format: 'real_human',
    tone: 'authentic_ugc',
    cartoonStyle: 'real_human',
    realHumanMode: true,
    actorPersona: 'Sarah Jenkins (UGC Creator)',
    captionPreset: 'bold_white_glow',
    captionYPercent: 74,
    captionFontSize: 34,
    autoEmojis: true,
    bgmTrack: 'lofi_chill',
    bgmVolume: 0.35,
    voiceVolume: 0.98,
    voiceSpeaker: 'Kore',
    characterName: 'Sarah Jenkins',
    characterAvatar: 'sarah_creator',
    splitScreenMode: false,
    scenes: [
      {
        id: 'sc_rh1',
        sceneNumber: 1,
        durationSec: 4.0,
        narration: 'Stop scrolling your phone at 7 AM! 99% of people fry their dopamine receptors before even brushing their teeth.',
        visualDescription: 'Real authentic living woman UGC creator holding iPhone 16 Pro looking directly into camera with shocked expressive face in modern bright morning sunlit room.',
        visualStyleKeywords: 'Shot on iPhone 16 Pro 4k video 35mm lens, natural sunlit bedroom window, authentic living human creator, pore details, real skin texture',
        imageUrl: generateCinematicSceneVisual('real woman UGC creator shocked looking into phone camera morning room', { format: 'real_human', sceneNumber: 1 }),
        keyframeImageUrl: generateCinematicSceneVisual('real woman UGC creator shocked looking into phone camera morning room', { format: 'real_human', sceneNumber: 1 }),
        expandedPrompt: 'Raw authentic vertical 9:16 video frame of real human creator Sarah looking directly into camera with shocked expressive face, natural skin pores, fine hair strands, morning sunlight through bedroom window, volumetric rim lighting, shot on iPhone 16 Pro 4k video 35mm f/1.8 lens, Kodachrome 64 color grading, photorealistic, 8k --ar 9:16 --v 6.0',
        promptExpansionDetails: {
          cinematography: 'iPhone 16 Pro 4k, 35mm anamorphic, f/1.8 aperture',
          lighting: 'Natural morning sunlight with soft warm 5600K key light & rim glow',
          atmosphere: 'Cinematic bedroom morning depth with subtle dust particle motes',
          colorGrading: 'Kodachrome 64 vintage tones, high dynamic range, deep shadows',
          motionGuidance: 'Slow cinematic push-in on subject expression with subtle background parallax'
        },
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: {
          type: 'zoom_in',
          strength: 7,
          cameraPath: 'Smooth cinematic forward push-in (1.18x) with Kling 4.0 motion interpolation',
          motionPrompt: 'slow cinematic push in, natural breathing movement, subtle hair flutter, 60fps',
          fps: 60
        },
        pipelineStatus: 'ready',
        cameraEffect: 'zoom_in',
        soundEffectCue: 'record_scratch',
        overlayBadge: 'STOP SCROLLING 🚨',
        emojiAccent: '📱⚡',
        characterEmotion: 'shocked',
        dialogueSpeaker: 'Sarah'
      },
      {
        id: 'sc_rh2',
        sceneNumber: 2,
        durationSec: 4.2,
        narration: 'The top 1% do this exact 3-step morning protocol before touching a single screen or opening emails.',
        visualDescription: 'Real human female founder sitting at clean modern wood kitchen counter holding warm ceramic coffee mug, natural morning sun flare, authentic 4k portrait.',
        visualStyleKeywords: 'Authentic 4k video still, real living human person, aesthetic kitchen interior, natural rim lighting, 35mm portrait lens',
        imageUrl: generateCinematicSceneVisual('real human woman kitchen counter coffee sunlight 4k video still', { format: 'real_human', sceneNumber: 2 }),
        keyframeImageUrl: generateCinematicSceneVisual('real human woman kitchen counter coffee sunlight 4k video still', { format: 'real_human', sceneNumber: 2 }),
        expandedPrompt: 'Vertical 9:16 cinematic portrait of female founder sitting at modern kitchen island holding warm ceramic mug, gentle morning steam rising, soft cinematic sun flare, ARRI Alexa Mini LF 35mm lens, f/2.0 aperture, filmic Kodak color grade, hyper-realistic, 8k',
        promptExpansionDetails: {
          cinematography: 'ARRI Alexa Mini LF, 35mm f/2.0 prime lens',
          lighting: 'Golden morning window flare with soft diffusion bounce',
          atmosphere: 'Aesthetic kitchen interior with soft bokeh and coffee steam',
          colorGrading: 'Kodak Vision3 500T, rich organic warmth and deep shadows',
          motionGuidance: 'Smooth lateral slow pan tracking the coffee mug to face'
        },
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: {
          type: 'pan_left',
          strength: 6,
          cameraPath: 'Kling 4.0 smooth lateral tracking sweep with micro parallax depth',
          motionPrompt: 'slow pan left, subtle steam drift, 60fps cinematic fluidity',
          fps: 60
        },
        pipelineStatus: 'ready',
        cameraEffect: 'pan_left',
        soundEffectCue: 'whoosh',
        overlayBadge: 'THE 3-STEP PROTOCOL',
        emojiAccent: '☕💡',
        characterEmotion: 'confident',
        dialogueSpeaker: 'Sarah'
      },
      {
        id: 'sc_rh3',
        sceneNumber: 3,
        durationSec: 4.0,
        narration: 'Step one: 500ml ice-cold water with Himalayan sea salt. It immediately recharges your neural mitochondria.',
        visualDescription: 'Real living human fitness athlete pouring ice cold mineral water in glass tumbler with visible sea salt in bright gym and wellness studio.',
        visualStyleKeywords: 'Real human gym wellness lifestyle, natural athlete skin texture, high shutter speed water pour, authentic creator vlog',
        imageUrl: generateCinematicSceneVisual('real human fitness coach drinking ice water gym studio', { format: 'real_human', sceneNumber: 3 }),
        keyframeImageUrl: generateCinematicSceneVisual('real human fitness coach drinking ice water gym studio', { format: 'real_human', sceneNumber: 3 }),
        expandedPrompt: 'Vertical 9:16 dynamic shot of fitness athlete pouring ice cold mineral water into glass tumbler, crystalline ice cubes, high shutter speed droplets, bright daylight gym studio, shot on Sony FX6 50mm f/1.4 lens, crisp contrast, 8k resolution',
        promptExpansionDetails: {
          cinematography: 'Sony FX6 Cinema Line, 50mm f/1.4 G-Master',
          lighting: 'High-key daylight wellness studio lighting, crisp specular highlights on water',
          atmosphere: 'Clean modern fitness aesthetics, condensation droplets on glass',
          colorGrading: 'Cool clean modern tones, crisp whites, vivid cyan hydration accents',
          motionGuidance: 'Handheld organic micro-shake following water pouring trajectory'
        },
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: {
          type: 'handheld',
          strength: 6,
          cameraPath: 'Kling 4.0 organic handheld camera with kinetic micro-jitter',
          motionPrompt: 'handheld camera movement, water pouring motion, ice clink, 60fps',
          fps: 60
        },
        pipelineStatus: 'ready',
        cameraEffect: 'shake',
        soundEffectCue: 'alert_stinger',
        overlayBadge: 'STEP 1: RE-HYDRATE',
        emojiAccent: '🧊💧',
        characterEmotion: 'heroic',
        dialogueSpeaker: 'Sarah'
      },
      {
        id: 'sc_rh4',
        sceneNumber: 4,
        durationSec: 4.5,
        narration: 'Step two: 10 minutes of direct morning sunlight on your eyes. Zero sunglasses. This hard-resets your biological clock.',
        visualDescription: 'Real human creator walking outside on urban city street in golden hour morning sunlight looking into handheld vlog camera.',
        visualStyleKeywords: 'Real human street vlogger, handheld iPhone 16 Pro camera perspective, golden hour cinematic lens flare, natural wind in hair',
        imageUrl: generateCinematicSceneVisual('real human creator walking street vlog golden hour morning sunlight', { format: 'real_human', sceneNumber: 4 }),
        keyframeImageUrl: generateCinematicSceneVisual('real human creator walking street vlog golden hour morning sunlight', { format: 'real_human', sceneNumber: 4 }),
        expandedPrompt: 'POV vertical 9:16 vlog of young creator walking along city avenue bathed in golden hour sunrise, warm sun rays across face, hair blowing in breeze, natural lens flare, iPhone 16 Pro 4k video, authentic TikTok influencer aesthetic, photorealistic',
        promptExpansionDetails: {
          cinematography: 'iPhone 16 Pro 4k 60fps, 24mm wide angle perspective',
          lighting: 'Direct morning sunrise backlight, radiant warm golden hour glow',
          atmosphere: 'City morning avenue, warm atmospheric haze, optical streak flares',
          colorGrading: 'Golden hour amber palette, lifted shadows, rich natural skin tone',
          motionGuidance: 'Dynamic tracking walk with subtle natural walking bounce'
        },
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: {
          type: 'pan_right',
          strength: 6,
          cameraPath: 'Kling 4.0 tracking sweep with gentle orbital parallax',
          motionPrompt: 'walking camera tracking, hair moving in breeze, golden sunlight shifts, 60fps',
          fps: 60
        },
        pipelineStatus: 'ready',
        cameraEffect: 'pan_right',
        soundEffectCue: 'chime',
        overlayBadge: 'STEP 2: SUNLIGHT',
        emojiAccent: '☀️👁️',
        characterEmotion: 'confident',
        dialogueSpeaker: 'Sarah'
      },
      {
        id: 'sc_rh5',
        sceneNumber: 5,
        durationSec: 4.0,
        narration: 'Save this video right now, try it tomorrow morning, and comment below how you felt after day one!',
        visualDescription: 'Real human podcast host and creator sitting in front of Shure SM7B studio microphone pointing directly at camera with confident warm smile.',
        visualStyleKeywords: 'Real human podcast studio, Shure SM7B mic, neon purple and amber background bokeh, authentic talking head creator video',
        imageUrl: generateCinematicSceneVisual('real human creator podcast studio microphone pointing at camera', { format: 'real_human', sceneNumber: 5 }),
        keyframeImageUrl: generateCinematicSceneVisual('real human creator podcast studio microphone pointing at camera', { format: 'real_human', sceneNumber: 5 }),
        expandedPrompt: 'Vertical 9:16 cinema frame of podcast host in moody creator studio, Shure SM7B microphone in foreground, neon cyan and amber background bokeh, charismatic gesture pointing at lens, ARRI Alexa LF 35mm anamorphic, deep depth of field, 8k',
        promptExpansionDetails: {
          cinematography: 'ARRI Alexa LF, 35mm anamorphic prime lens, f/1.4',
          lighting: 'Dual-tone studio lighting: soft amber key with cyan/purple edge lights',
          atmosphere: 'Aesthetic creator podcast studio with hexagonal sound panels',
          colorGrading: 'Cinematic commercial grade, deep ink blacks, crisp highlights',
          motionGuidance: 'Slow cinematic push-in centering on speaker gesture'
        },
        imageGenModel: 'flux_1',
        videoGenModel: 'kling_4',
        motionControl: {
          type: 'push_in',
          strength: 7,
          cameraPath: 'Kling 4.0 smooth push-in with focus pull to subject gesture',
          motionPrompt: 'slow push-in, expressive hand gesture, head nod, 60fps',
          fps: 60
        },
        pipelineStatus: 'ready',
        cameraEffect: 'zoom_out',
        soundEffectCue: 'sub_drop',
        overlayBadge: 'SAVE & TRY TOMORROW',
        emojiAccent: '👇🔥',
        characterEmotion: 'heroic',
        dialogueSpeaker: 'Sarah'
      }
    ]
  },
  {
    id: 'preset_fruit_drama',
    title: 'Pineapple Bride: The Fountain Revenge',
    viralHook: 'She pushed the bride into the dirty fountain... but watch who got the last laugh.',
    tiktokCaption: 'Lady Grape stole her groom at the altar... but 3 months later Miss Pineapple pulled up in a supercar! 🍍🍇🤯 #fruitdrama #halastory #animation #soapopera #glowup #revenge #fyp',
    hashtags: ['#fruitdrama', '#animation', '#cartoon', '#glowup', '#revenge', '#soapopera', '#fyp', '#viral'],
    format: 'fruit_drama',
    tone: 'dramatic_telenovela',
    cartoonStyle: 'fruit_3d',
    captionPreset: 'cartoon_comic',
    captionYPercent: 68,
    captionFontSize: 34,
    autoEmojis: true,
    bgmTrack: 'soap_opera_drama',
    bgmVolume: 0.45,
    voiceVolume: 0.95,
    voiceSpeaker: 'Kore',
    characterName: 'Miss Pineapple',
    characterAvatar: 'pineapple_bride',
    scenes: [
      {
        id: 'sc_fd1',
        sceneNumber: 1,
        durationSec: 4.0,
        narration: 'Lady Grape was furious that Sir Bell Pepper chose Miss Pineapple. Right before the walk, she shoved her into the fountain!',
        visualDescription: 'Lady Grape in a shimmering purple slit dress aggressively pushes Miss Pineapple into the marble courtyard fountain water.',
        visualStyleKeywords: 'Pixar 3D animated still, fruit characters in haute couture, luxury mansion courtyard, water splash',
        imageUrl: generateCinematicSceneVisual('lady grape pushes pineapple into fountain courtyard', { format: 'fruit_drama', sceneNumber: 1 }),
        cameraEffect: 'zoom_in',
        soundEffectCue: 'dramatic_slap',
        overlayBadge: 'THE BETRAYAL',
        emojiAccent: '🍇😱',
        characterEmotion: 'shocked',
        dialogueSpeaker: 'Lady Grape'
      },
      {
        id: 'sc_fd2',
        sceneNumber: 2,
        durationSec: 4.2,
        narration: 'Soaked and humiliated, Miss Pineapple wept as her makeup melted and the wedding guests walked away in silence.',
        visualDescription: 'Miss Pineapple bride weeping huge cartoon tears while sitting in the fountain pool with soaked ruined wedding dress.',
        visualStyleKeywords: '3D animated heartbreak, tears flowing into water, Disney weeping expression, dramatic lighting',
        imageUrl: generateCinematicSceneVisual('pineapple weeping in fountain pool soaked wedding dress', { format: 'fruit_drama', sceneNumber: 2 }),
        cameraEffect: 'shake',
        soundEffectCue: 'water_splash',
        overlayBadge: 'HEARTBROKEN',
        emojiAccent: '😭💔',
        characterEmotion: 'crying',
        dialogueSpeaker: 'Miss Pineapple'
      },
      {
        id: 'sc_fd3',
        sceneNumber: 3,
        durationSec: 4.0,
        narration: 'Meanwhile, inside the grand golden cathedral, Sir Bell Pepper proposed to Lady Grape right at the altar!',
        visualDescription: 'Sir Bell Pepper in black tuxedo on one knee presenting a diamond ring to Lady Grape in golden cathedral.',
        visualStyleKeywords: 'Golden cathedral chandeliers, romantic proposal still, Pixar 3D animated vegetable groom',
        imageUrl: generateCinematicSceneVisual('pepper proposes diamond ring lady grape cathedral wedding', { format: 'fruit_drama', sceneNumber: 3 }),
        cameraEffect: 'pan_right',
        soundEffectCue: 'chime',
        overlayBadge: 'STOLEN GROOM',
        emojiAccent: '💍👰',
        characterEmotion: 'scheming',
        dialogueSpeaker: 'Sir Pepper'
      },
      {
        id: 'sc_fd4',
        sceneNumber: 4,
        durationSec: 4.2,
        narration: 'Instead of giving up, Miss Pineapple booked an appointment with Dr. Carrot for an extreme luxury fruit skincare glow-up.',
        visualDescription: 'Dr. Carrot in clinic coat applying golden collagen skincare mask and cucumber slices to Pineapple relaxing on spa bed.',
        visualStyleKeywords: 'Luxury beauty clinic, fruit skincare aesthetic, soothing pastel lighting, 3D character glow',
        imageUrl: generateCinematicSceneVisual('dr carrot facial skincare mask pineapple spa makeover', { format: 'fruit_drama', sceneNumber: 4 }),
        cameraEffect: 'zoom_out',
        soundEffectCue: 'chime',
        overlayBadge: 'GLOW-UP TIME',
        emojiAccent: '✨🧖‍♀️',
        characterEmotion: 'confident',
        dialogueSpeaker: 'Dr. Carrot'
      },
      {
        id: 'sc_fd5',
        sceneNumber: 5,
        durationSec: 4.0,
        narration: 'She hit the gym every single morning, training relentlessly with champion discipline until she was completely unstoppable.',
        visualDescription: 'Miss Pineapple in neon athletic sportswear sprinting on high-tech treadmill with sweat flying and determined eyes.',
        visualStyleKeywords: 'Modern gym neon lights, high energy fitness montage, fierce character expression',
        imageUrl: generateCinematicSceneVisual('pineapple running treadmill gym fitness workout montage', { format: 'fruit_drama', sceneNumber: 5 }),
        cameraEffect: 'shake',
        soundEffectCue: 'vine_boom',
        overlayBadge: 'FITNESS MONTAGE',
        emojiAccent: '🔥💪',
        characterEmotion: 'heroic',
        dialogueSpeaker: 'Miss Pineapple'
      },
      {
        id: 'sc_fd6',
        sceneNumber: 6,
        durationSec: 4.5,
        narration: 'Three months later, she became CEO of the Year. She pulled up to the reception in a custom supercar holding her trophy!',
        visualDescription: 'Miss Pineapple dressed in tailored emerald green designer suit and sunglasses holding a golden trophy by a luxury supercar.',
        visualStyleKeywords: 'Haute couture emerald green suit, penthouse sunset lighting, luxury supercar, billionaire energy',
        imageUrl: generateCinematicSceneVisual('pineapple ceo emerald suit trophy supercar billionaire', { format: 'fruit_drama', sceneNumber: 6 }),
        cameraEffect: 'zoom_in',
        soundEffectCue: 'cash_register',
        overlayBadge: 'BOSS RETURN',
        emojiAccent: '👑💰',
        characterEmotion: 'confident',
        dialogueSpeaker: 'Miss Pineapple'
      },
      {
        id: 'sc_fd7',
        sceneNumber: 7,
        durationSec: 4.5,
        narration: 'She walked into the wedding hall and hit PLAY on the giant 85-inch screen... broadcasting the fountain security footage!',
        visualDescription: 'Grand wedding hall with giant 85-inch screen showing surveillance video of Grape pushing Pineapple into the fountain.',
        visualStyleKeywords: 'Shocked wedding guests, giant CCTV video display, dramatic reveal lighting, cinematic framing',
        imageUrl: generateCinematicSceneVisual('giant video screen security tape reveal wedding hall', { format: 'fruit_drama', sceneNumber: 7 }),
        cameraEffect: 'flash_cut',
        soundEffectCue: 'alert_stinger',
        overlayBadge: 'EVIDENCE REVEALED',
        emojiAccent: '📺🚨',
        characterEmotion: 'heroic',
        dialogueSpeaker: 'Miss Pineapple'
      },
      {
        id: 'sc_fd8',
        sceneNumber: 8,
        durationSec: 4.2,
        narration: 'Sir Pepper screamed "You are a liar!" and stormed off, leaving Lady Grape screaming in ruined despair!',
        visualDescription: 'Extreme close up of Lady Grape screaming in terror with wide open mouth while Sir Pepper storms away in fury.',
        visualStyleKeywords: 'Exaggerated cartoon scream face, dramatic red lighting, wedding in ruins, soap opera finale',
        imageUrl: generateCinematicSceneVisual('lady grape screaming in ruin mouth wide open pepper liar', { format: 'fruit_drama', sceneNumber: 8 }),
        cameraEffect: 'shake',
        soundEffectCue: 'villain_laugh',
        overlayBadge: 'JUSTICE SERVED',
        emojiAccent: '💀🤯',
        characterEmotion: 'shocked',
        dialogueSpeaker: 'Lady Grape'
      }
    ]
  },
  {
    id: 'preset_psychology',
    title: '5 Dark Psychological Tricks',
    viralHook: 'The 3rd one feels almost illegal to know...',
    tiktokCaption: 'Save this before it gets taken down. Which one surprised you most? 🧠👇 #psychologytricks #lifehacks #mindset #manipulation #fyp',
    hashtags: ['#psychologytricks', '#viralhacks', '#darkpsychology', '#mindblown', '#fyp', '#lifetips'],
    format: 'viral_facts',
    tone: 'dark_mystery',
    cartoonStyle: 'pixar_3d',
    captionPreset: 'hormozi_yellow',
    captionYPercent: 68,
    captionFontSize: 34,
    autoEmojis: true,
    bgmTrack: 'suspense_dark',
    bgmVolume: 0.35,
    voiceVolume: 0.95,
    voiceSpeaker: 'Fenrir',
    scenes: [
      {
        id: 'sc_1',
        sceneNumber: 1,
        durationSec: 4,
        narration: 'Never ask someone if they are lying. Instead, look into their left eye and stay completely silent.',
        visualDescription: 'Extreme cinematic close-up of a piercing intense eye with high-contrast dramatic noir shadows and golden iris reflection.',
        visualStyleKeywords: 'Cinematic hyperrealism, dark noir studio lighting, 8k macro portrait',
        imageUrl: generateCinematicSceneVisual('eye noir close-up lying silent look'),
        cameraEffect: 'zoom_in',
        soundEffectCue: 'vine_boom',
        overlayBadge: 'SECRET RULE #1',
        emojiAccent: '👁️🤫',
        characterEmotion: 'scheming'
      },
      {
        id: 'sc_2',
        sceneNumber: 2,
        durationSec: 4.5,
        narration: 'The silence forces their brain into panic overdrive, and they will over-explain every single lie.',
        visualDescription: 'Split screen view showing racing heart pulse rate monitor and a nervous person fidgeting with hands.',
        visualStyleKeywords: 'Cyberpunk medical monitor, nervous silhouette, neon crimson warning lights',
        imageUrl: generateCinematicSceneVisual('heart monitor panic pulse nervous'),
        cameraEffect: 'shake',
        soundEffectCue: 'sub_drop',
        overlayBadge: 'PSYCH FACT',
        emojiAccent: '💀⚠️',
        characterEmotion: 'shocked'
      },
      {
        id: 'sc_3',
        sceneNumber: 3,
        durationSec: 4.5,
        narration: 'If you want someone to instantly agree with you, nod your head gently while speaking your core point.',
        visualDescription: 'Charismatic speaker on a podcast stage nodding with hypnotic confidence under warm studio spotlights.',
        visualStyleKeywords: 'TED talk lighting, charismatic presenter, warm golden bokeh, sharp 35mm lens',
        imageUrl: generateCinematicSceneVisual('stage podcaster speaker charismatic spotlight'),
        cameraEffect: 'pan_right',
        soundEffectCue: 'cash_register',
        overlayBadge: 'UNFAIR ADVANTAGE',
        emojiAccent: '🧠🤝',
        characterEmotion: 'confident'
      },
      {
        id: 'sc_4',
        sceneNumber: 4,
        durationSec: 4,
        narration: 'Their mirror neurons subconsciously copy you. Hit follow right now to master the other three!',
        visualDescription: '3D glowing holographic neural network connecting two glowing brains with pulsing energy waves.',
        visualStyleKeywords: 'Holographic glowing brain synapses, neon purple and cyan lasers, sci-fi VFX',
        imageUrl: generateCinematicSceneVisual('holographic neural brain synapses mind'),
        cameraEffect: 'zoom_out',
        soundEffectCue: 'chime',
        overlayBadge: 'DON\'T MISS PART 2',
        emojiAccent: '🚀🔥',
        characterEmotion: 'heroic'
      }
    ]
  },
  {
    id: 'preset_cartoon_pizza',
    title: 'The Knight & The Pizza Portal',
    viralHook: 'Sir Reginald fought dragons, but nothing prepared him for Chicago deep dish.',
    tiktokCaption: 'Medieval knight discovers fast food and questions his entire knighthood 😂🍕 Wait till the end! #cartoon #animation #comedy #storytime #fyp',
    hashtags: ['#cartoon', '#animation', '#storytime', '#funny', '#viral', '#knight'],
    format: 'cartoon_story',
    tone: 'funny_cartoon',
    cartoonStyle: 'pixar_3d',
    captionPreset: 'cartoon_comic',
    captionYPercent: 72,
    captionFontSize: 36,
    autoEmojis: true,
    bgmTrack: 'cartoon_quirky',
    bgmVolume: 0.4,
    voiceVolume: 0.95,
    voiceSpeaker: 'Puck',
    characterName: 'Sir Reginald',
    characterAvatar: 'sir_reginald',
    scenes: [
      {
        id: 'sc_p1',
        sceneNumber: 1,
        durationSec: 4,
        narration: 'Sir Reginald was slaying a legendary forest beast when suddenly a glowing portal ripped open!',
        visualDescription: 'Cartoon knight in shiny oversized silver helmet standing astonished in front of a swirling cheesy neon pizza portal.',
        visualStyleKeywords: 'Pixar 3D animated still, magical glowing portal, cute goofy knight with expressive eyes, enchanted forest',
        imageUrl: generateCinematicSceneVisual('knight and pizza portal enchanted forest', { isCartoon: true, sceneNumber: 1 }),
        cameraEffect: 'zoom_in',
        soundEffectCue: 'whoosh',
        overlayBadge: 'COMIC STORY',
        emojiAccent: '⚔️🌀',
        characterEmotion: 'shocked',
        dialogueSpeaker: 'Narrator'
      },
      {
        id: 'sc_p2',
        sceneNumber: 2,
        durationSec: 4.5,
        narration: 'A cardboard box slid out. On the front it said: Extra Pepperoni, Keep Level.',
        visualDescription: 'Close-up of a steaming hot cartoon pizza box with steam rising in comical curls, grease marks shining brightly.',
        visualStyleKeywords: '3D animated comedy, stylized food props, glossy cheese stretch, golden crust',
        imageUrl: generateCinematicSceneVisual('steaming hot pizza box cartoon animation', { isCartoon: true, sceneNumber: 2 }),
        cameraEffect: 'flash_cut',
        soundEffectCue: 'record_scratch',
        overlayBadge: 'WHAT IS THAT?!',
        emojiAccent: '🍕📦',
        characterEmotion: 'thinking',
        dialogueSpeaker: 'Sir Reginald'
      },
      {
        id: 'sc_p3',
        sceneNumber: 3,
        durationSec: 4.5,
        narration: 'He took one bite. The cheese stretched to the heavens, and he immediately surrendered his sword.',
        visualDescription: 'Knight joyfully weeping tears of pure ecstasy with an impossible 10-foot cheese pull connecting to the slice.',
        visualStyleKeywords: 'Anime exaggerated reaction, sparkly background, weeping anime tears of joy, golden heavenly light',
        imageUrl: generateCinematicSceneVisual('anime weeping tears of joy cheese pull animated', { isCartoon: true, sceneNumber: 3 }),
        cameraEffect: 'shake',
        soundEffectCue: 'chime',
        overlayBadge: 'TASTE OF DESTINY',
        emojiAccent: '🤤✨',
        characterEmotion: 'laughing',
        dialogueSpeaker: 'Sir Reginald'
      },
      {
        id: 'sc_p4',
        sceneNumber: 4,
        durationSec: 4,
        narration: 'Farewell king! I now pledge my allegiance to the Pizzamancer! Comment your favorite topping below!',
        visualDescription: 'Sir Reginald riding a pizza delivery scooter into the sunset wearing his knight helmet backwards.',
        visualStyleKeywords: 'Hilarious cartoon finale, sunset horizon, whimsical slapstick animation, bold comic outlines',
        imageUrl: generateCinematicSceneVisual('cartoon knight riding pizza delivery scooter into sunset', { isCartoon: true, sceneNumber: 4 }),
        cameraEffect: 'zoom_out',
        soundEffectCue: 'vine_boom',
        overlayBadge: 'DROP A COMMENT',
        emojiAccent: '🛵🍕',
        characterEmotion: 'heroic',
        dialogueSpeaker: 'Sir Reginald'
      }
    ]
  },
  {
    id: 'preset_what_if',
    title: 'What If The Moon Disappeared?',
    viralHook: 'If the Moon vanished right now, you would have 3 hours to live.',
    tiktokCaption: 'Most people think tides would just stop. The real science is terrifying! 🌕💥 #space #sciencefacts #whatif #earth #viral',
    hashtags: ['#whatif', '#spacefacts', '#astronomy', '#science', '#mindblown', '#fyp'],
    format: 'what_if',
    tone: 'dramatic_suspense',
    cartoonStyle: 'cyberpunk_retro',
    captionPreset: 'neon_beast',
    captionYPercent: 65,
    captionFontSize: 35,
    autoEmojis: true,
    bgmTrack: 'phonk_drift',
    bgmVolume: 0.35,
    voiceVolume: 0.95,
    voiceSpeaker: 'Zephyr',
    scenes: [
      {
        id: 'sc_w1',
        sceneNumber: 1,
        durationSec: 4,
        narration: 'Without the Moon gravitational anchor, Earth axis would instantly begin to violently wobble.',
        visualDescription: 'Epic vertical space shot of Earth tilting erratically with broken orbital rings and cosmic debris in deep space.',
        visualStyleKeywords: 'Photorealistic NASA render, deep space nebula, Earth glowing blue atmosphere, high detail 8k',
        imageUrl: generateCinematicSceneVisual('cosmic space planet earth wobbling with rings nebula'),
        cameraEffect: 'shake',
        soundEffectCue: 'vine_boom',
        overlayBadge: 'EXTINCTION EVENT',
        emojiAccent: '🌍💥',
        characterEmotion: 'shocked'
      },
      {
        id: 'sc_w2',
        sceneNumber: 2,
        durationSec: 4.5,
        narration: 'Tides would collapse into gargantuan thousand-foot tsunamis sweeping across coastlines worldwide.',
        visualDescription: 'Colossal dark ocean mega-tsunami looming over illuminated skyscraper skyline at twilight.',
        visualStyleKeywords: 'Apocalyptic cinematic masterpiece, hyperrealistic ocean wave, city storm lights, volumetric spray',
        imageUrl: generateCinematicSceneVisual('ocean mega-tsunami dark wave deep ocean'),
        cameraEffect: 'zoom_in',
        soundEffectCue: 'sub_drop',
        overlayBadge: 'CATACLYSM',
        emojiAccent: '🌊⚡',
        characterEmotion: 'shocked'
      },
      {
        id: 'sc_w3',
        sceneNumber: 3,
        durationSec: 4.5,
        narration: 'Worse yet, Earth rotation would accelerate, turning one single day into just six chaotic hours.',
        visualDescription: 'Hyper-lapse showing the sun violently rocketing across the sky from morning to dark night in seconds.',
        visualStyleKeywords: 'Time-lapse sky trail, motion blur sun streaks, wild clouds spinning, hyper-speed reality',
        imageUrl: generateCinematicSceneVisual('night room digital clock 3 am stars moon'),
        cameraEffect: 'pan_left',
        soundEffectCue: 'whoosh',
        overlayBadge: 'SPEED UP',
        emojiAccent: '⏱️🌪️',
        characterEmotion: 'thinking'
      },
      {
        id: 'sc_w4',
        sceneNumber: 4,
        durationSec: 4,
        narration: 'Could humanity survive underground? Drop your theory in the comments and subscribe for part two!',
        visualDescription: 'Futuristic subterranean high-tech biosphere bunker deep underground with glowing neon hydroponics.',
        visualStyleKeywords: 'Cyberpunk underground sanctuary, glowing bio-luminescent plants, sleek subterranean architecture',
        imageUrl: generateCinematicSceneVisual('futuristic subterranean cyberpunk bunker neon city'),
        cameraEffect: 'zoom_out',
        soundEffectCue: 'alert_stinger',
        overlayBadge: 'SURVIVE OR DIE?',
        emojiAccent: '🚨👇',
        characterEmotion: 'heroic'
      }
    ]
  }
];
