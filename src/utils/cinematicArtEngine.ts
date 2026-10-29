/**
 * Cinematic 9:16 Scene Art Engine
 * Generates rich, high-resolution 9:16 vertical movie stills, 3D animated cartoon scenes,
 * and cinematic backgrounds matching scene narration and visual prompts.
 */

export function generateCinematicSceneVisual(
  description: string,
  options: {
    format?: string;
    isCartoon?: boolean;
    emotion?: string;
    sceneNumber?: number;
  } = {}
): string {
  const d = (description || '').toLowerCase();
  const isCartoon = options.isCartoon || options.format === 'cartoon_story' || d.includes('cartoon') || d.includes('animated') || d.includes('pixar');

  if (isCartoon) {
    return generateCartoonMovieStill(description, options.emotion || 'shocked', options.sceneNumber || 1);
  }

  if (d.includes('ghost') || d.includes('horror') || d.includes('creepy') || d.includes('haunt') || d.includes('asylum') || d.includes('scary') || d.includes('spooky')) {
    return generateHorrorGhostScene();
  } else if (d.includes('pyramid') || d.includes('egypt') || d.includes('desert') || d.includes('pharaoh') || d.includes('sand') || d.includes('ancient')) {
    return generatePyramidsScene();
  } else if (d.includes('car') || d.includes('race') || d.includes('supercar') || d.includes('drift') || d.includes('speed') || d.includes('vehicle') || d.includes('engine')) {
    return generateSupercarScene();
  } else if (d.includes('ocean') || d.includes('sea') || d.includes('ship') || d.includes('shark') || d.includes('water') || d.includes('deep') || d.includes('fish')) {
    return generateDeepSeaScene();
  } else if (d.includes('castle') || d.includes('king') || d.includes('throne') || d.includes('medieval') || d.includes('sword') || d.includes('knight') || d.includes('kingdom')) {
    return generateMedievalCastleScene();
  } else if (d.includes('eye') || d.includes('lying') || d.includes('silent') || d.includes('look') || d.includes('stare')) {
    return generateEyeNoirScene();
  } else if (d.includes('heart') || d.includes('panic') || d.includes('monitor') || d.includes('pulse') || d.includes('hospital') || d.includes('doctor')) {
    return generateHeartMonitorScene();
  } else if (d.includes('speaker') || d.includes('stage') || d.includes('nod') || d.includes('podcast') || d.includes('interview')) {
    return generateStagePodcasterScene();
  } else if (d.includes('brain') || d.includes('neuron') || d.includes('mind') || d.includes('psycholog') || d.includes('think')) {
    return generateHolographicBrainScene();
  } else if (d.includes('pizza') || d.includes('portal') || d.includes('food') || d.includes('eating')) {
    return generatePizzaPortalScene();
  } else if (d.includes('space') || d.includes('galaxy') || d.includes('star') || d.includes('moon') || d.includes('planet') || d.includes('alien')) {
    return generateCosmicNebulaScene();
  } else if (d.includes('cyber') || d.includes('future') || d.includes('neon') || d.includes('robot') || d.includes('tech') || d.includes('ai')) {
    return generateCyberpunkCityScene();
  } else if (d.includes('money') || d.includes('gold') || d.includes('rich') || d.includes('millionaire') || d.includes('cash') || d.includes('crypto')) {
    return generateGoldVaultScene();
  } else if (d.includes('coffee') || d.includes('sleep') || d.includes('night') || d.includes('3 am') || d.includes('bed')) {
    return generateNightRoomScene();
  } else if (d.includes('door') || d.includes('closet') || d.includes('secret') || d.includes('dorm') || d.includes('mystery')) {
    return generateSecretDoorScene();
  }

  // General atmospheric movie still with mountain landscape & hero silhouette
  return generateAtmosphericMovieStill(description);
}

export function getAIImageUrl(prompt: string, isCartoon: boolean = false, seed?: number): string {
  const clean = prompt.replace(/[^\w\s,]/gi, ' ').trim().slice(0, 160);
  const aesthetic = isCartoon
    ? 'Pixar 3D cute cartoon character animation, vertical 9:16 portrait, cinematic studio lighting, highly detailed'
    : 'ultra-realistic 9:16 cinematic movie still, 8k, dramatic shadows, volumetric lighting, shot on 35mm lens';
  const fullPrompt = `${aesthetic}, ${clean}`;
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  const s = seed !== undefined ? seed : Math.abs(hash) % 999999;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=720&height=1280&nologo=true&seed=${s}`;
}

function encodeSvg(svg: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    try {
      return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
    } catch {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
  }
  if (typeof Buffer !== 'undefined') {
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/** 1. Extreme Close-Up Noir Eye Scene */
function generateEyeNoirScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="35%" stop-color="#b45309"/>
      <stop offset="65%" stop-color="#f59e0b"/>
      <stop offset="85%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#18181b"/>
    </radialGradient>
    <radialGradient id="shadowVignette" cx="50%" cy="50%" r="65%">
      <stop offset="40%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.9"/>
    </radialGradient>
    <linearGradient id="noirShadow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#09090b" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#18181b" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <!-- Dark cinematic skin background -->
  <rect width="720" height="1280" fill="#0c0a09"/>
  <rect width="720" height="1280" fill="url(#noirShadow)"/>
  
  <!-- Massive intense cinematic eye -->
  <g transform="translate(360, 560)">
    <!-- Eye sclera -->
    <path d="M-260 0 C-180 -140, 180 -140, 260 0 C180 140, -180 140, -260 0 Z" fill="#f4f4f5"/>
    <!-- Eye blood veins -->
    <path d="M-230 -10 Q-160 -30 -110 -15" stroke="#ef4444" stroke-width="2" opacity="0.4" fill="none"/>
    <path d="M230 10 Q160 30 110 15" stroke="#ef4444" stroke-width="2" opacity="0.4" fill="none"/>
    
    <!-- Iris & Pupil -->
    <circle cx="0" cy="0" r="105" fill="url(#irisGrad)"/>
    <!-- Detailed iris fibers -->
    <circle cx="0" cy="0" r="95" stroke="#d97706" stroke-width="4" stroke-dasharray="6 4" fill="none" opacity="0.7"/>
    <circle cx="0" cy="0" r="48" fill="#09090b"/>
    
    <!-- Intense specular light glint reflection -->
    <ellipse cx="-28" cy="-28" rx="20" ry="14" fill="#ffffff" opacity="0.95" transform="rotate(-30, -28, -28)"/>
    <circle cx="22" cy="22" r="8" fill="#ffffff" opacity="0.75"/>
    
    <!-- Upper heavy cinematic eyelid shadow -->
    <path d="M-260 0 C-180 -140, 180 -140, 260 0 C180 -60, -180 -60, -260 0 Z" fill="#000000" opacity="0.7"/>
    <!-- Eyelashes -->
    <path d="M-200 -75 Q-170 -120 -150 -130 M-100 -105 Q-80 -150 -60 -155 M0 -110 Q20 -160 40 -160 M100 -105 Q120 -150 140 -145 M180 -80 Q210 -115 230 -120" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  </g>

  <!-- Film grain & dramatic cinematic bars -->
  <rect width="720" height="1280" fill="url(#shadowVignette)"/>
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <!-- Movie Subtitle Tag -->
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#f59e0b" text-anchor="middle" opacity="0.9">SCENE 1 // PSYCHOLOGICAL DECEPTION</text>
</svg>`;
  return encodeSvg(svg);
}

/** 2. Cyberpunk Heart Rate Panic Scene */
function generateHeartMonitorScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="bgH" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#11071f"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <filter id="glowH" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="1280" fill="url(#bgH)"/>
  
  <!-- Cyberpunk Medical HUD grid -->
  <g stroke="#1e293b" stroke-width="1.5" opacity="0.4">
    <line x1="0" y1="200" x2="720" y2="200"/>
    <line x1="0" y1="400" x2="720" y2="400"/>
    <line x1="0" y1="600" x2="720" y2="600"/>
    <line x1="0" y1="800" x2="720" y2="800"/>
    <line x1="180" y1="0" x2="180" y2="1280"/>
    <line x1="360" y1="0" x2="360" y2="1280"/>
    <line x1="540" y1="0" x2="540" y2="1280"/>
  </g>
  
  <!-- High BPM Heart Rate spikes -->
  <path d="M0 580 L180 580 L210 520 L240 680 L270 440 L310 740 L340 540 L370 580 L500 580 L530 460 L560 700 L590 580 L720 580" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowH)"/>
  
  <!-- Holographic Nervous Silhouette in background -->
  <circle cx="360" cy="400" r="110" fill="#dc2626" opacity="0.15" filter="url(#glowH)"/>
  <path d="M220 720 C220 520, 500 520, 500 720 Z" fill="#09090b" opacity="0.8"/>
  <circle cx="360" cy="380" r="60" fill="#09090b" opacity="0.9"/>
  
  <!-- Panic Alert HUD Box -->
  <rect x="160" y="240" width="400" height="85" rx="18" fill="#180509" stroke="#ef4444" stroke-width="2.5"/>
  <text x="360" y="278" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#ef4444" text-anchor="middle" filter="url(#glowH)">HEART RATE: 168 BPM</text>
  <text x="360" y="306" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="14" fill="#fca5a5" text-anchor="middle" letter-spacing="3">ACUTE COGNITIVE PANIC DETECTED</text>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#ef4444" text-anchor="middle">SCENE 2 // PSYCHOLOGICAL OVERDRIVE</text>
</svg>`;
  return encodeSvg(svg);
}

/** 3. Charismatic Speaker on Stage Scene */
function generateStagePodcasterScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="spotlight" cx="50%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.6"/>
      <stop offset="40%" stop-color="#b45309" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Dark auditorium studio -->
  <rect width="720" height="1280" fill="#09090b"/>
  <!-- Powerful cone of stage light -->
  <polygon points="360,50 80,1280 640,1280" fill="url(#spotlight)"/>
  
  <!-- Golden warm bokeh particles -->
  <circle cx="200" cy="450" r="28" fill="#f59e0b" opacity="0.3"/>
  <circle cx="520" cy="520" r="38" fill="#fbbf24" opacity="0.25"/>
  <circle cx="310" cy="320" r="18" fill="#fef08a" opacity="0.4"/>
  <circle cx="480" cy="700" r="45" fill="#d97706" opacity="0.2"/>
  
  <!-- Studio Shure SM7B microphone silhouette -->
  <g transform="translate(360, 620)">
    <!-- Mic boom arm -->
    <path d="M-180 300 L-40 80 L-10 20" stroke="#27272a" stroke-width="12" stroke-linecap="round" fill="none"/>
    <!-- Mic body -->
    <rect x="-24" y="-70" width="48" height="95" rx="14" fill="#18181b" stroke="#52525b" stroke-width="3"/>
    <rect x="-20" y="-64" width="40" height="48" rx="8" fill="#27272a"/>
    <!-- Foam windscreen line -->
    <line x1="-24" y1="-16" x2="24" y2="-16" stroke="#fbbf24" stroke-width="3"/>
    <!-- Red recording on-air indicator ring -->
    <circle cx="0" cy="40" r="6" fill="#ef4444"/>
  </g>
  
  <!-- Charismatic silhouette nodding in background -->
  <path d="M240 880 C240 680, 480 680, 480 880 Z" fill="#0f172a" opacity="0.9"/>
  <circle cx="360" cy="540" r="85" fill="#0f172a" opacity="0.95"/>
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#fbbf24" text-anchor="middle">SCENE 3 // CHARISMATIC INFLUENCE</text>
</svg>`;
  return encodeSvg(svg);
}

/** 4. Holographic Neural Brain Synapses Scene */
function generateHolographicBrainScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="brainGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.6"/>
      <stop offset="45%" stop-color="#06b6d4" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
    <filter id="neonBrainGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="1280" fill="#030712"/>
  <rect width="720" height="1280" fill="url(#brainGlow)"/>
  
  <!-- Cyber grid floor -->
  <g stroke="#3b82f6" stroke-width="1.5" opacity="0.3">
    <line x1="0" y1="920" x2="720" y2="920"/>
    <line x1="0" y1="1020" x2="720" y2="1020"/>
    <line x1="0" y1="1140" x2="720" y2="1140"/>
    <line x1="360" y1="840" x2="60" y2="1280"/>
    <line x1="360" y1="840" x2="220" y2="1280"/>
    <line x1="360" y1="840" x2="500" y2="1280"/>
    <line x1="360" y1="840" x2="660" y2="1280"/>
  </g>
  
  <!-- 3D Neural Network connecting nodes -->
  <g transform="translate(360, 520)" filter="url(#neonBrainGlow)">
    <!-- Left hemisphere curves -->
    <path d="M-15 -140 C-90 -130, -180 -70, -170 20 C-165 90, -80 140, -15 130 C-40 80, -60 20, -15 -140 Z" fill="none" stroke="#a855f7" stroke-width="4"/>
    <!-- Right hemisphere curves -->
    <path d="M15 -140 C90 -130, 180 -70, 170 20 C165 90, 80 140, 15 130 C40 80, 60 20, 15 -140 Z" fill="none" stroke="#06b6d4" stroke-width="4"/>
    
    <!-- Synaptic Network Lines -->
    <line x1="-120" y1="-40" x2="-60" y2="30" stroke="#f472b6" stroke-width="2.5"/>
    <line x1="-60" y1="30" x2="0" y2="-20" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="0" y1="-20" x2="60" y2="30" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="60" y1="30" x2="120" y2="-40" stroke="#f472b6" stroke-width="2.5"/>
    <line x1="-100" y1="60" x2="100" y2="60" stroke="#c084fc" stroke-width="2" stroke-dasharray="8 6"/>
    
    <!-- Glowing Synapse Nodes -->
    <circle cx="-120" cy="-40" r="10" fill="#f472b6"/>
    <circle cx="-60" cy="30" r="12" fill="#38bdf8"/>
    <circle cx="0" cy="-20" r="16" fill="#ffffff"/>
    <circle cx="60" cy="30" r="12" fill="#38bdf8"/>
    <circle cx="120" cy="-40" r="10" fill="#f472b6"/>
    <circle cx="0" cy="90" r="10" fill="#a855f7"/>
  </g>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#06b6d4" text-anchor="middle">SCENE 4 // MIRROR NEURON SYNC</text>
</svg>`;
  return encodeSvg(svg);
}

/** 5. Cartoon Movie Still: Knight & Swirling Pizza Portal */
function generatePizzaPortalScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="portalGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#facc15"/>
      <stop offset="65%" stop-color="#f97316"/>
      <stop offset="85%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#7c2d12" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cartoonSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="45%" stop-color="#38bdf8"/>
      <stop offset="70%" stop-color="#a7f3d0"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  
  <!-- Enchanted Fairytale Sky & Rolling Hills -->
  <rect width="720" height="1280" fill="url(#cartoonSky)"/>
  
  <!-- Magical cartoon clouds -->
  <g fill="#ffffff" opacity="0.85">
    <circle cx="160" cy="220" r="60"/>
    <circle cx="230" cy="200" r="75"/>
    <circle cx="300" cy="220" r="60"/>
    <circle cx="560" cy="280" r="50"/>
    <circle cx="620" cy="270" r="65"/>
  </g>
  
  <!-- Swirling Cheesy Pizza Portal in Center -->
  <g transform="translate(360, 520)">
    <circle cx="0" cy="0" r="230" fill="url(#portalGrad)"/>
    <!-- Swirling portal rays -->
    <circle cx="0" cy="0" r="180" fill="none" stroke="#facc15" stroke-width="12" stroke-dasharray="25 18"/>
    <circle cx="0" cy="0" r="130" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="15 12"/>
    <!-- Giant flying pepperoni slice flying through portal! -->
    <path d="M-60 -90 L90 -20 L-20 80 Z" fill="#eab308" stroke="#78350f" stroke-width="5"/>
    <circle cx="0" cy="-20" r="16" fill="#dc2626"/>
    <circle cx="20" cy="20" r="14" fill="#dc2626"/>
    <circle cx="-25" cy="15" r="12" fill="#dc2626"/>
    <!-- Cheesy melting drip -->
    <path d="M-10 60 Q0 110 10 140 Q15 150 20 140 Q25 100 35 60 Z" fill="#facc15"/>
  </g>
  
  <!-- Cartoon Enchanted Forest Trees on bottom hills -->
  <path d="M0 900 Q180 820 360 880 Q540 940 720 860 L720 1280 L0 1280 Z" fill="#166534"/>
  <path d="M0 980 Q220 920 440 960 Q600 1000 720 940 L720 1280 L0 1280 Z" fill="#14532d"/>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Outfit', sans-serif" font-weight="900" font-size="18" letter-spacing="4" fill="#facc15" text-anchor="middle">ANIMATED CARTOON STORY // ACT 1</text>
</svg>`;
  return encodeSvg(svg);
}

/** 6. Deep Space Cosmic Nebula */
function generateCosmicNebulaScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="nebula" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="35%" stop-color="#818cf8" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#c084fc" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="720" height="1280" fill="#020617"/>
  <rect width="720" height="1280" fill="url(#nebula)"/>
  
  <!-- Giant glowing planet with rings -->
  <g transform="translate(360, 480)">
    <!-- Back ring -->
    <ellipse cx="0" cy="0" rx="280" ry="60" fill="none" stroke="#7dd3fc" stroke-width="16" opacity="0.4" transform="rotate(-15)"/>
    <!-- Planet sphere -->
    <circle cx="0" cy="0" r="140" fill="#0f172a"/>
    <circle cx="0" cy="0" r="140" fill="#38bdf8" opacity="0.3"/>
    <!-- Planet shadow -->
    <path d="M0 -140 A140 140 0 0 1 0 140 A70 140 0 0 0 0 -140" fill="#020617" opacity="0.7"/>
    <!-- Front ring -->
    <path d="M-270 70 A280 60 0 0 0 270 -70" fill="none" stroke="#e0f2fe" stroke-width="20" opacity="0.7" transform="rotate(-15)"/>
  </g>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#38bdf8" text-anchor="middle">SCENE // COSMIC ANOMALY</text>
</svg>`;
  return encodeSvg(svg);
}

/** 7. Cyberpunk Neon City Scene */
function generateCyberpunkCityScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="cyberSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#090514"/>
      <stop offset="60%" stop-color="#2e1065"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#cyberSky)"/>
  
  <!-- Towering neon skyscraper silhouettes -->
  <rect x="40" y="320" width="130" height="800" fill="#0f0926" stroke="#00f0ff" stroke-width="2"/>
  <rect x="200" y="240" width="160" height="880" fill="#170c3a" stroke="#ff007f" stroke-width="2"/>
  <rect x="390" y="180" width="140" height="940" fill="#0d0722" stroke="#00f0ff" stroke-width="2"/>
  <rect x="560" y="360" width="120" height="760" fill="#1b0e45" stroke="#facc15" stroke-width="2"/>
  
  <!-- Glowing holographic ads -->
  <rect x="230" y="340" width="100" height="60" fill="#ff007f" opacity="0.8"/>
  <text x="280" y="375" font-family="sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">AI 2099</text>
  
  <!-- Neon street reflection pool -->
  <polygon points="0,1100 720,1100 720,1280 0,1280" fill="#020617"/>
  <ellipse cx="360" cy="1150" rx="300" ry="40" fill="#ff007f" opacity="0.3"/>
  <ellipse cx="360" cy="1180" rx="260" ry="30" fill="#00f0ff" opacity="0.35"/>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#00f0ff" text-anchor="middle">SCENE // NEO-TOKYO 2099</text>
</svg>`;
  return encodeSvg(svg);
}

/** 8. High-Security Gold Vault Scene */
function generateGoldVaultScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="goldGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#b45309" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="720" height="1280" fill="#022c22"/>
  <rect width="720" height="1280" fill="url(#goldGlow)"/>
  
  <!-- Vault Door Gear -->
  <circle cx="360" cy="520" r="220" fill="#1e293b" stroke="#fbbf24" stroke-width="8"/>
  <circle cx="360" cy="520" r="170" fill="#0f172a" stroke="#cbd5e1" stroke-width="6"/>
  <circle cx="360" cy="520" r="60" fill="#fbbf24"/>
  
  <!-- Gold Bars Stacked in Foreground -->
  <g transform="translate(180, 840)">
    <polygon points="0,40 100,0 240,0 140,40" fill="#fde047"/>
    <polygon points="0,40 140,40 140,80 0,80" fill="#ca8a04"/>
    <polygon points="140,40 240,0 240,40 140,80" fill="#a16207"/>
  </g>
  <g transform="translate(300, 800)">
    <polygon points="0,40 100,0 240,0 140,40" fill="#fef08a"/>
    <polygon points="0,40 140,40 140,80 0,80" fill="#eab308"/>
    <polygon points="140,40 240,0 240,40 140,80" fill="#ca8a04"/>
  </g>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#fbbf24" text-anchor="middle">SCENE // THE BILLIONAIRE VAULT</text>
</svg>`;
  return encodeSvg(svg);
}

/** 9. Dark Room & 3 AM Scene */
function generateNightRoomScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050814"/>
      <stop offset="70%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#nightSky)"/>
  
  <!-- Glowing Window with Moon -->
  <rect x="180" y="240" width="360" height="420" rx="20" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
  <line x1="360" y1="240" x2="360" y2="660" stroke="#1e293b" stroke-width="6"/>
  <line x1="180" y1="450" x2="540" y2="450" stroke="#1e293b" stroke-width="6"/>
  <circle cx="280" cy="340" r="45" fill="#fef08a"/>
  
  <!-- Glowing Digital Clock: 03:00 AM -->
  <rect x="220" y="740" width="280" height="90" rx="16" fill="#000000" stroke="#ef4444" stroke-width="3"/>
  <text x="360" y="800" font-family="monospace" font-weight="900" font-size="44" fill="#ef4444" text-anchor="middle" letter-spacing="4">03:00 AM</text>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#ef4444" text-anchor="middle">SCENE // MIDNIGHT METABOLISM</text>
</svg>`;
  return encodeSvg(svg);
}

/** 10. Secret Door Dorm Mystery Scene */
function generateSecretDoorScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <radialGradient id="doorGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#6366f1" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="720" height="1280" fill="#09090b"/>
  
  <!-- Wooden closet wall -->
  <rect x="100" y="240" width="520" height="800" fill="#271c19" stroke="#451a03" stroke-width="8"/>
  
  <!-- Secret stone door opening with blinding mystical blue light -->
  <rect x="180" y="320" width="360" height="720" fill="url(#doorGlow)"/>
  <rect x="180" y="320" width="100" height="720" fill="#1c1917" stroke="#000000" stroke-width="4"/>
  <circle cx="260" cy="680" r="10" fill="#facc15"/>
  
  <!-- Ancient glowing symbols on stone door -->
  <text x="230" y="440" font-size="28" fill="#38bdf8" opacity="0.8">᚛᚜</text>
  <text x="230" y="520" font-size="28" fill="#38bdf8" opacity="0.8">⚡</text>
  <text x="230" y="600" font-size="28" fill="#38bdf8" opacity="0.8">👁️</text>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#38bdf8" text-anchor="middle">SCENE // THE UNEXPLAINED ENTRANCE</text>
</svg>`;
  return encodeSvg(svg);
}

/** 11. Cartoon Movie Still with Animated Staging */
function generateCartoonMovieStill(prompt: string, emotion: string, sceneNum: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <radialGradient id="cSpot" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Vibrant Animated Studio Sky -->
  <rect width="720" height="1280" fill="url(#cSky)"/>
  <rect width="720" height="1280" fill="url(#cSpot)"/>
  
  <!-- 3D Pixar Style Fluffy Clouds -->
  <g fill="#ffffff" opacity="0.8">
    <ellipse cx="200" cy="200" rx="90" ry="50"/>
    <ellipse cx="270" cy="180" rx="80" ry="60"/>
    <ellipse cx="540" cy="240" rx="100" ry="55"/>
  </g>
  
  <!-- Animated Fairytale Castle / City Towers in Distance -->
  <path d="M140 700 L140 520 L180 460 L220 520 L220 700 Z" fill="#818cf8"/>
  <path d="M260 750 L260 480 L320 400 L380 480 L380 750 Z" fill="#6366f1"/>
  <path d="M420 700 L420 540 L460 490 L500 540 L500 700 Z" fill="#818cf8"/>
  
  <!-- Lush Green Hills -->
  <path d="M0 800 Q180 720 360 780 Q540 840 720 760 L720 1280 L0 1280 Z" fill="#22c55e"/>
  <path d="M0 880 Q240 820 480 860 Q620 900 720 840 L720 1280 L0 1280 Z" fill="#16a34a"/>
  
  <!-- Dynamic Cartoon Emotion Explosion in Sky -->
  <g transform="translate(360, 420)">
    <polygon points="0,-120 35,-40 120,-30 50,30 80,110 0,60 -80,110 -50,30 -120,-30 -35,-40" fill="#facc15" stroke="#e11d48" stroke-width="6"/>
    <text x="0" y="20" font-family="'Outfit', sans-serif" font-weight="900" font-size="52" fill="#e11d48" text-anchor="middle">POW!</text>
  </g>
  
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Outfit', sans-serif" font-weight="900" font-size="18" letter-spacing="4" fill="#facc15" text-anchor="middle">PIXAR 3D CARTOON ANIMATION // SCENE ${sceneNum}</text>
</svg>`;
  return encodeSvg(svg);
}

/** 12. General Atmospheric Cinematic Movie Still with Hero Silhouette */
function generateAtmosphericMovieStill(prompt: string): string {
  const p = (prompt || '').toLowerCase();
  let skyTop = '#05020c';
  let skyMid = '#1e103a';
  let mountainA = '#120726';
  let mountainB = '#0a0316';
  let accent = '#f43f5e';
  let title = 'CINEMATIC STORY';

  if (p.includes('nature') || p.includes('forest') || p.includes('mountain') || p.includes('tree')) {
    skyTop = '#021a12';
    skyMid = '#064e3b';
    mountainA = '#022c22';
    mountainB = '#01150f';
    accent = '#4ade80';
    title = 'EPIC WILDERNESS';
  } else if (p.includes('ocean') || p.includes('water') || p.includes('sea')) {
    skyTop = '#02101e';
    skyMid = '#075985';
    mountainA = '#0c4a6e';
    mountainB = '#031f30';
    accent = '#38bdf8';
    title = 'DEEP HORIZON';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${skyTop}"/>
      <stop offset="50%" stop-color="${skyMid}"/>
      <stop offset="85%" stop-color="#000000"/>
    </linearGradient>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="${accent}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky background -->
  <rect width="720" height="1280" fill="url(#skyGrad)"/>

  <!-- Twinkling stars -->
  <g fill="#ffffff" opacity="0.6">
    <circle cx="80" cy="180" r="1.5"/><circle cx="220" cy="120" r="2"/><circle cx="340" cy="90" r="1.5"/>
    <circle cx="510" cy="160" r="2.5"/><circle cx="640" cy="220" r="1.5"/><circle cx="150" cy="280" r="2"/>
    <circle cx="580" cy="310" r="2"/><circle cx="290" cy="240" r="1.5"/><circle cx="430" cy="260" r="2"/>
  </g>

  <!-- Glowing celestial moon -->
  <circle cx="500" cy="320" r="180" fill="url(#moonGlow)" opacity="0.5"/>
  <circle cx="500" cy="320" r="70" fill="#fef08a" opacity="0.95"/>
  <circle cx="480" cy="305" r="60" fill="${skyMid}" opacity="0.3"/>

  <!-- Distant mountain ridges -->
  <path d="M0 640 Q180 520 360 590 T720 540 L720 1280 L0 1280 Z" fill="${mountainA}" opacity="0.85"/>
  <path d="M0 720 Q220 620 460 700 T720 660 L720 1280 L0 1280 Z" fill="${mountainB}"/>

  <!-- Foreground cliff precipice with silhouetted hero figure -->
  <path d="M0 860 L240 820 L380 870 L480 830 L520 890 L720 860 L720 1280 L0 1280 Z" fill="#030108"/>

  <!-- Traveler / Hero Silhouette standing on cliff -->
  <g transform="translate(360, 770)" fill="#000000">
    <ellipse cx="0" cy="0" rx="10" ry="12"/> <!-- Head -->
    <path d="M-12 12 L12 12 L16 54 L-16 54 Z"/> <!-- Coat / Torso -->
    <path d="M-14 18 Q-30 35 -38 52" stroke="#000000" stroke-width="5" stroke-linecap="round"/> <!-- Flowing cloak -->
    <rect x="-10" y="54" width="7" height="32" rx="3"/> <!-- Legs -->
    <rect x="3" y="54" width="7" height="32" rx="3"/>
  </g>

  <!-- Volumetric fog / mist -->
  <ellipse cx="360" cy="850" rx="420" ry="80" fill="${accent}" opacity="0.15"/>
  <ellipse cx="360" cy="980" rx="440" ry="120" fill="#ffffff" opacity="0.06"/>

  <!-- Film grain & dramatic cinematic bars -->
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="${accent}" text-anchor="middle">${title}</text>
</svg>`;
  return encodeSvg(svg);
}

/** 13. Horror / Ghost / Haunted Hospital Scene */
function generateHorrorGhostScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="ghostBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="40%" stop-color="#0f172a"/>
      <stop offset="85%" stop-color="#020408"/>
    </linearGradient>
    <radialGradient id="ghostGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#0284c7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#ghostBg)"/>

  <!-- Cracked arched hospital hallway perspective -->
  <path d="M0 0 L260 380 L260 900 L0 1280 Z" fill="#080e1a"/>
  <path d="M720 0 L460 380 L460 900 L720 1280 Z" fill="#060b14"/>
  <rect x="260" y="380" width="200" height="520" fill="#030712"/>

  <!-- Moonlight beam pouring from broken high window -->
  <polygon points="120,0 260,0 360,650 180,650" fill="#38bdf8" opacity="0.12"/>

  <!-- Spooky floating ethereal ghost phantom -->
  <g transform="translate(360, 520)">
    <!-- Aura glow -->
    <circle cx="0" cy="0" r="160" fill="url(#ghostGlow)"/>
    
    <!-- Ghost shroud -->
    <path d="M-55 -40 C-55 -110, 55 -110, 55 -40 C60 40, 75 140, 45 180 C20 150, 0 185, -20 150 C-45 180, -60 120, -55 -40 Z" fill="#e0f2fe" opacity="0.88"/>
    
    <!-- Hollow glowing spectral eyes -->
    <ellipse cx="-20" cy="-45" rx="10" ry="16" fill="#020617"/>
    <ellipse cx="20" cy="-45" rx="10" ry="16" fill="#020617"/>
    <circle cx="-20" cy="-45" r="4" fill="#38bdf8"/>
    <circle cx="20" cy="-45" r="4" fill="#38bdf8"/>

    <!-- Open wailing mouth -->
    <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#020617"/>

    <!-- Wispy trailing vapor -->
    <path d="M-35 150 Q-50 210 -10 240 M25 150 Q45 200 15 250" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" opacity="0.6" fill="none"/>
  </g>

  <!-- Ground mist -->
  <ellipse cx="360" cy="1000" rx="420" ry="140" fill="#38bdf8" opacity="0.18"/>

  <!-- Cinematic Letterbox bars -->
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#38bdf8" text-anchor="middle">PARANORMAL // HAUNTED INVESTIGATION</text>
</svg>`;
  return encodeSvg(svg);
}

/** 14. Ancient Egyptian Pyramids Scene */
function generatePyramidsScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="pyrSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e102d"/>
      <stop offset="45%" stop-color="#7c2d12"/>
      <stop offset="75%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#pyrSky)"/>

  <!-- Massive glowing golden sunset sun -->
  <circle cx="360" cy="560" r="140" fill="url(#sunGrad)"/>

  <!-- Distant small pyramids -->
  <polygon points="120,680 180,590 240,680" fill="#451a03"/>
  <polygon points="180,590 240,680 260,680" fill="#78350f"/>

  <!-- Great Pyramid of Giza (Massive center) -->
  <polygon points="160,780 380,440 600,780" fill="#78350f"/>
  <polygon points="380,440 600,780 660,780" fill="#451a03"/>
  <!-- Gold capstone -->
  <polygon points="360,470 380,440 400,470" fill="#fef08a"/>

  <!-- Left Great Pyramid -->
  <polygon points="0,820 180,520 360,820" fill="#9a3412"/>
  <polygon points="180,520 360,820 400,820" fill="#451a03"/>

  <!-- Desert sand dunes in foreground -->
  <path d="M0 760 Q200 680 440 760 T720 740 L720 1280 L0 1280 Z" fill="#d97706"/>
  <path d="M0 860 Q260 760 520 860 T720 840 L720 1280 L0 1280 Z" fill="#b45309"/>
  <path d="M0 980 Q320 880 720 960 L720 1280 L0 1280 Z" fill="#78350f"/>

  <!-- Camel caravan silhouette -->
  <g transform="translate(180, 880)" fill="#1c1917">
    <ellipse cx="0" cy="0" rx="14" ry="10"/>
    <ellipse cx="2" cy="-9" rx="7" ry="7"/> <!-- Hump -->
    <path d="M10 -6 Q16 -18 20 -14 Q18 -6 12 0 Z"/> <!-- Neck/Head -->
    <rect x="-8" y="8" width="3" height="24"/>
    <rect x="6" y="8" width="3" height="24"/>
  </g>

  <!-- Letterbox bars -->
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#fde047" text-anchor="middle">ANCIENT EGYPT // FORGOTTEN PYRAMIDS</text>
</svg>`;
  return encodeSvg(svg);
}

/** 15. Neon Night Supercar Racing Scene */
function generateSupercarScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="carSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030712"/>
      <stop offset="50%" stop-color="#1e1035"/>
      <stop offset="85%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="headlightCone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#carSky)"/>

  <!-- City skyline background with illuminated windows -->
  <g fill="#0f172a" opacity="0.9">
    <rect x="60" y="320" width="80" height="280"/>
    <rect x="160" y="260" width="90" height="340"/>
    <rect x="270" y="210" width="110" height="390"/>
    <rect x="400" y="280" width="80" height="320"/>
    <rect x="500" y="240" width="100" height="360"/>
    <rect x="620" y="340" width="70" height="260"/>
  </g>

  <!-- Wet asphalt highway -->
  <polygon points="0,600 720,600 720,1280 0,1280" fill="#090d16"/>
  <!-- Highway lane dividers -->
  <polygon points="350,600 370,600 380,1280 340,1280" fill="#facc15" opacity="0.75"/>

  <!-- Supercar Headlight Beams coming at the camera -->
  <polygon points="260,780 0,1160 300,1280" fill="url(#headlightCone)" opacity="0.6"/>
  <polygon points="460,780 720,1160 420,1280" fill="url(#headlightCone)" opacity="0.6"/>

  <!-- Supercar Body Silhouette & Sharp Aero Lines -->
  <g transform="translate(360, 760)">
    <!-- Aerodynamic low body -->
    <path d="M-180 40 L-130 -30 L-70 -70 L70 -70 L130 -30 L180 40 L160 70 L-160 70 Z" fill="#020617"/>
    <path d="M-120 -25 L-60 -65 L60 -65 L120 -25 Z" fill="#0f172a"/> <!-- Windshield -->

    <!-- Piercing LED Headlights -->
    <path d="M-140 20 L-80 30 L-145 35 Z" fill="#ffffff"/>
    <circle cx="-110" cy="28" r="8" fill="#38bdf8"/>
    <path d="M140 20 L80 30 L145 35 Z" fill="#ffffff"/>
    <circle cx="110" cy="28" r="8" fill="#38bdf8"/>

    <!-- Cyan Neon Underglow -->
    <ellipse cx="0" cy="72" rx="170" ry="18" fill="#00f0ff" opacity="0.75"/>
  </g>

  <!-- Speed lines & tire smoke -->
  <g stroke="#ffffff" stroke-width="2" opacity="0.4">
    <line x1="40" y1="740" x2="20" y2="920"/>
    <line x1="680" y1="740" x2="700" y2="920"/>
  </g>

  <!-- Letterbox bars -->
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#00f0ff" text-anchor="middle">MIDNIGHT RACING // HYPERCAR HIGHWAY</text>
</svg>`;
  return encodeSvg(svg);
}

/** 16. Deep Sea Ocean & Giant Creature Scene */
function generateDeepSeaScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="oceanBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="35%" stop-color="#0369a1"/>
      <stop offset="70%" stop-color="#082f49"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="jellyGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#c084fc" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#oceanBg)"/>

  <!-- Water sunbeams cascading down from surface -->
  <polygon points="140,0 220,0 360,780 200,780" fill="#e0f2fe" opacity="0.18"/>
  <polygon points="380,0 460,0 580,720 440,720" fill="#e0f2fe" opacity="0.15"/>

  <!-- Colossal mysterious sea creature silhouette in background -->
  <g opacity="0.35" fill="#021a2e">
    <ellipse cx="260" cy="520" rx="320" ry="120" transform="rotate(-15, 260, 520)"/>
    <path d="M480 460 Q620 440 680 380 Q640 480 540 520 Z"/> <!-- Massive tail fluke -->
  </g>

  <!-- Glowing Bioluminescent Jellyfish in midground -->
  <g transform="translate(420, 640)">
    <circle cx="0" cy="0" r="90" fill="url(#jellyGlow)"/>
    <path d="M-45 0 C-45 -50, 45 -50, 45 0 Q0 15 -45 0 Z" fill="#e0f2fe" opacity="0.9"/>
    <!-- Tentacles -->
    <path d="M-30 10 Q-45 80 -25 140 M-10 10 Q-5 90 -15 150 M10 10 Q5 85 15 145 M30 10 Q40 80 25 140" stroke="#c084fc" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
  </g>

  <!-- Small floating air bubbles -->
  <circle cx="210" cy="420" r="6" fill="#e0f2fe" opacity="0.6"/>
  <circle cx="230" cy="380" r="4" fill="#e0f2fe" opacity="0.5"/>
  <circle cx="480" cy="360" r="8" fill="#e0f2fe" opacity="0.6"/>
  <circle cx="495" cy="310" r="5" fill="#e0f2fe" opacity="0.5"/>

  <!-- Letterbox bars -->
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#38bdf8" text-anchor="middle">DEEP OCEAN // THE UNKNOWN ABYSS</text>
</svg>`;
  return encodeSvg(svg);
}

/** 17. Medieval Castle & Kingdom Fortress Scene */
function generateMedievalCastleScene(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="castleSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0316"/>
      <stop offset="45%" stop-color="#2e1065"/>
      <stop offset="85%" stop-color="#4c0519"/>
    </linearGradient>
    <radialGradient id="castleMoon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#castleSky)"/>

  <!-- Golden Moon behind fortress -->
  <circle cx="240" cy="360" r="95" fill="url(#castleMoon)"/>

  <!-- High mountain cliff base -->
  <polygon points="0,680 720,740 720,1280 0,1280" fill="#090514"/>

  <!-- Fortress Towers & Battlements -->
  <g fill="#180e29">
    <!-- Left watchtower -->
    <rect x="80" y="440" width="80" height="260"/>
    <polygon points="70,440 120,360 170,440" fill="#3b0764"/>
    <!-- Center Great Keep -->
    <rect x="220" y="400" width="160" height="300"/>
    <rect x="210" y="380" width="180" height="25" fill="#2e1065"/>
    <!-- Battlements teeth -->
    <rect x="210" y="360" width="30" height="25"/>
    <rect x="260" y="360" width="30" height="25"/>
    <rect x="310" y="360" width="30" height="25"/>
    <rect x="360" y="360" width="30" height="25"/>
    <!-- Right Spire -->
    <rect x="440" y="480" width="90" height="240"/>
    <polygon points="430,480 485,390 540,480" fill="#3b0764"/>
  </g>

  <!-- Glowing warm torchlight in castle windows -->
  <rect x="260" y="440" width="20" height="36" rx="10" fill="#fef08a"/>
  <rect x="320" y="440" width="20" height="36" rx="10" fill="#fef08a"/>
  <rect x="110" y="490" width="16" height="28" rx="8" fill="#fef08a"/>

  <!-- Knight silhouette in foreground -->
  <g transform="translate(520, 840)" fill="#05020a">
    <ellipse cx="0" cy="0" rx="12" ry="14"/> <!-- Helmet -->
    <path d="M-14 14 L14 14 L18 64 L-18 64 Z"/> <!-- Armor -->
    <rect x="-8" y="64" width="7" height="38"/>
    <rect x="3" y="64" width="7" height="38"/>
    <!-- Sword pointing down -->
    <line x1="-22" y1="20" x2="-22" y2="85" stroke="#e2e8f0" stroke-width="4"/>
    <line x1="-30" y1="35" x2="-14" y2="35" stroke="#f59e0b" stroke-width="4"/>
  </g>

  <!-- Letterbox bars -->
  <rect x="0" y="0" width="720" height="90" fill="#000000"/>
  <rect x="0" y="1190" width="720" height="90" fill="#000000"/>
  <text x="360" y="1160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" letter-spacing="6" fill="#fbbf24" text-anchor="middle">MEDIEVAL KINGDOM // STONE FORTRESS</text>
</svg>`;
  return encodeSvg(svg);
}
