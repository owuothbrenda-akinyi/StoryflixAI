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
  }
];

export const PRESET_PROJECTS: Project[] = [
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
