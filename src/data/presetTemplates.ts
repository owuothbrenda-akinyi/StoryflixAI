import { CharacterPreset, Project } from '../types/studio';

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
  }
];

export const PRESET_PROJECTS: Project[] = [
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
        cameraEffect: 'zoom_out',
        soundEffectCue: 'alert_stinger',
        overlayBadge: 'SURVIVE OR DIE?',
        emojiAccent: '🚨👇',
        characterEmotion: 'heroic'
      }
    ]
  }
];
