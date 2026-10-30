// Procedural Web Audio Engine for Viral Sound Effects, Background Music, and Speech Mix
import { SoundEffectCue } from '../types/studio';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;
  private currentBgmTrack = '';
  private destinationNode: MediaStreamAudioDestinationNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.35;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.value = 1.0;
      this.voiceGain.connect(this.masterGain);

      // Connect to speakers
      this.masterGain.connect(this.ctx.destination);

      // Connect to MediaStream destination for video recording export!
      this.destinationNode = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.destinationNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getRecordStream(): MediaStream | null {
    this.init();
    return this.destinationNode ? this.destinationNode.stream : null;
  }

  public setVolumes(bgm: number, voice: number) {
    if (this.bgmGain) this.bgmGain.gain.value = Math.max(0, Math.min(1, bgm));
    if (this.voiceGain) this.voiceGain.gain.value = Math.max(0, Math.min(1, voice));
  }

  // --- VIRAL PROCEDURAL SFX GENERATOR ---
  public playSFX(cue: SoundEffectCue) {
    this.init();
    if (!this.ctx || !this.sfxGain || cue === 'none') return;
    const now = this.ctx.currentTime;

    switch (cue) {
      case 'vine_boom':
        this.playVineBoom(now);
        break;
      case 'whoosh':
        this.playWhoosh(now);
        break;
      case 'sub_drop':
        this.playSubDrop(now);
        break;
      case 'cash_register':
        this.playCashRegister(now);
        break;
      case 'chime':
        this.playChime(now);
        break;
      case 'record_scratch':
        this.playRecordScratch(now);
        break;
      case 'alert_stinger':
        this.playAlertStinger(now);
        break;
      case 'dramatic_slap':
        this.playDramaticSlap(now);
        break;
      case 'water_splash':
        this.playWaterSplash(now);
        break;
      case 'gasp':
        this.playDramaticGasp(now);
        break;
      case 'villain_laugh':
        this.playVillainLaugh(now);
        break;
    }
  }

  // The iconic pitch-falling sub boom
  private playVineBoom(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(135, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.65);

    // Punch envelope
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(1.0, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    // Subtle distortion node for thickness
    const waveShaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * 1.8);
    }
    waveShaper.curve = curve;

    osc.connect(waveShaper);
    waveShaper.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.95);
  }

  // Cinematic fast air whoosh
  private playWhoosh(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(2800, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(180, t + 0.45);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.7, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  // Deep 808 sub drop
  private playSubDrop(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 1.2);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 1.25);
  }

  // Cha-ching cash register sound
  private playCashRegister(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const notes = [1760, 2637]; // A6 and E7
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.6, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.42);
    });
  }

  // Bell chime
  private playChime(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    [1046, 1318, 1568, 2093].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);

      gain.gain.setValueAtTime(0.4, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.85);
    });
  }

  // Vinyl record scratch
  private playRecordScratch(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.linearRampToValueAtTime(200, t + 0.08);
    osc.frequency.linearRampToValueAtTime(950, t + 0.22);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.7, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  // Alert suspense stinger
  private playAlertStinger(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    [220, 261.63, 311.13, 440].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.75);
    });
  }

  // Dramatic Soap Opera Slap
  private playDramaticSlap(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    gain.gain.setValueAtTime(0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  // Dramatic Fountain Water Splash
  private playWaterSplash(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    [120, 180, 260, 320].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, t + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + idx * 0.04 + 0.35);
      gain.gain.setValueAtTime(0.4, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.42);
    });
  }

  // Sharp Dramatic Gasp
  private playDramaticGasp(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(520, t + 0.18);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.45, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Cartoon Villain Cackle
  private playVillainLaugh(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    [0, 0.12, 0.24, 0.38].forEach((offset, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      const baseFreq = idx % 2 === 0 ? 320 : 280;
      osc.frequency.setValueAtTime(baseFreq, t + offset);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + offset + 0.1);
      gain.gain.setValueAtTime(0.4, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.11);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + offset);
      osc.stop(t + offset + 0.12);
    });
  }

  // --- PROCEDURAL BACKGROUND MUSIC GENERATOR ---
  public startBGM(trackName: string) {
    this.init();
    if (!this.ctx || !this.bgmGain || trackName === 'none') {
      this.stopBGM();
      return;
    }

    if (this.isBgmPlaying && this.currentBgmTrack === trackName) return;
    this.stopBGM();

    this.isBgmPlaying = true;
    this.currentBgmTrack = trackName;

    let step = 0;
    const tempo = trackName === 'phonk_drift' ? 140 : trackName === 'lo_fi_chill' ? 84 : 120;
    const intervalMs = (60 / tempo / 2) * 1000; // Eighth note tick

    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;
      this.tickBGM(trackName, step % 16, now);
      step++;
    }, intervalMs);
  }

  private tickBGM(track: string, step: number, t: number) {
    if (!this.ctx || !this.bgmGain) return;

    if (track === 'phonk_drift') {
      // Phonk Cowbell + 808 pattern
      if (step === 0 || step === 8) {
        // Kick / 808
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.25);
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.3);
      }
      if ([2, 5, 8, 11, 14].includes(step)) {
        // Cowbell melody
        const pitches = [587.33, 659.25, 783.99, 880];
        const pitch = pitches[step % pitches.length];
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.14);
      }
    } else if (track === 'lo_fi_chill') {
      // Warm jazzy 7th chord keys
      if (step % 8 === 0) {
        const chord = step < 8 ? [261.63, 329.63, 392, 493.88] : [220, 261.63, 329.63, 440];
        chord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.06, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
          osc.connect(g);
          g.connect(this.bgmGain!);
          osc.start(t);
          osc.stop(t + 0.85);
        });
      }
    } else if (track === 'suspense_dark') {
      // Pulse drone
      if (step % 4 === 0) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.45);
      }
    } else if (track === 'upbeat_pop') {
      // Bouncy synth bass + melody
      if (step % 4 === 0 || step === 6 || step === 14) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(110 * (1 + (step % 3) * 0.25), t);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.18);
      }
    } else if (track === 'cartoon_quirky') {
      // Xylophone / pizzicato bounce
      if (step % 2 === 0) {
        const melody = [523.25, 659.25, 783.99, 1046.5, 880, 698.46, 587.33, 659.25];
        const freq = melody[(step / 2) % melody.length];
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.14, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.16);
      }
    } else if (track === 'soap_opera_drama') {
      // Dramatic telenovela minor strings arpeggio & heartbeat tension bass
      if (step % 4 === 0) {
        // Deep cello bass pulse
        const bassFreq = step === 0 ? 65.41 : step === 4 ? 55.0 : step === 8 ? 73.42 : 49.0;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.7);
      }
      // Dramatic violin arpeggio
      const violinNotes = [440, 523.25, 659.25, 783.99, 659.25, 523.25, 440, 392];
      const vFreq = violinNotes[step % violinNotes.length];
      const vOsc = this.ctx.createOscillator();
      const vGain = this.ctx.createGain();
      vOsc.type = 'triangle';
      vOsc.frequency.setValueAtTime(vFreq, t);
      vGain.gain.setValueAtTime(0.09, t);
      vGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      vOsc.connect(vGain);
      vGain.connect(this.bgmGain);
      vOsc.start(t);
      vOsc.stop(t + 0.24);
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    this.currentBgmTrack = '';
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // --- PLAY AUDIO CLIPS (FROM GEMINI TTS OR RECORDING) ---
  public async playVoiceClip(audioUrl: string): Promise<void> {
    this.init();
    return new Promise((resolve) => {
      try {
        const audio = new Audio(audioUrl);
        if (this.voiceGain && this.ctx) {
          try {
            const source = this.ctx.createMediaElementSource(audio);
            source.connect(this.voiceGain);
          } catch {
            // If already connected or cross-origin, play directly
          }
        }
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      } catch {
        resolve();
      }
    });
  }

  // --- BROWSER WEB SPEECH API (INSTANT FALLBACK) ---
  public speakFallback(text: string, voiceName?: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        setTimeout(resolve, text.length * 55);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.25; // Viral fast tempo!
      utterance.pitch = voiceName === 'Puck' ? 1.3 : voiceName === 'Fenrir' ? 0.8 : 1.05;

      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      );
      if (match) utterance.voice = match;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }

  public stopAllSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
