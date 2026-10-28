import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));

// Server-side Gemini client with recommended telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Script & Storyboard Generator Endpoint
app.post('/api/generate-script', async (req, res) => {
  try {
    const {
      topic,
      format = 'viral_facts',
      targetDuration = 30, // seconds
      tone = 'fast_viral',
      cartoonStyle = 'pixar_3d',
      voiceStyle = 'hype_beast',
    } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an elite short-form video producer for TikTok, Instagram Reels, and YouTube Shorts.
You specialize in viral hooks, 9:16 retention pacing, high-dopamine visual cues, dynamic scene sequencing, and captivating storytelling (including cartoon animated stories).
Your scripts consistently achieve over 85% completion rate because:
1. The first 3 seconds contain an irresistible hook that breaks scrolling patterns.
2. Every scene is 3 to 6 seconds max with distinct visual motions, camera cues, and sound effects.
3. Every sentence is punchy, conversational, and trimmed of filler.
4. Word-by-word visual emphasis markers and sound effect triggers (vine boom, whoosh, cash register, chime, record scratch, sub bass drop) are placed on climactic moments.

For Cartoon Stories: Create engaging characters with defined emotional reactions, comedic timing or epic moments, dialogue lines, and clear visual staging.

Return ONLY a valid JSON object matching the requested schema.`;

    const userPrompt = `Create a complete viral 9:16 vertical video storyboard and script.
Topic / Idea: "${topic}"
Format: ${format}
Target Duration: approximately ${targetDuration} seconds
Narrative Tone: ${tone}
Cartoon Art Style (if cartoon format): ${cartoonStyle}
Voice Style: ${voiceStyle}

Create approximately ${Math.max(3, Math.min(8, Math.round(targetDuration / 4.5)))} fast-paced scenes.
Each scene must have:
- narration: 1-2 punchy spoken sentences for voiceover
- visualDescription: Vivid description of what's shown on screen (visual composition, character action, background lighting, 9:16 framing)
- visualStyleKeywords: 3-5 visual aesthetic keywords (e.g. "Cyberpunk neon, futuristic alley, rainy reflective street, cinematic depth of field" or "3D cute Pixar cartoon style, expressive eyes, vibrant whimsical studio lighting")
- cameraEffect: one of ["zoom_in", "zoom_out", "pan_left", "pan_right", "shake", "flash_cut"]
- soundEffectCue: one of ["vine_boom", "whoosh", "sub_drop", "cash_register", "chime", "record_scratch", "alert_stinger", "none"]
- overlayBadge: A viral text sticker or badge to hook attention (e.g., "WAIT FOR IT...", "PART 1", "SECRET EXPOSED", "DID YOU KNOW?", "MIND BLOWN", "DON'T SKIP", "PLOT TWIST")
- emojiAccent: 1-2 relevant high-engagement emojis (e.g. "🤯🔥", "💀👀", "💰⚡")
- characterEmotion: (for cartoon stories) one of ["shocked", "heroic", "laughing", "scheming", "thinking", "angry", "crying", "confident"]
- dialogueSpeaker: optional name of speaker if dialogue scene`;

    let parsedData: any = null;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Catchy viral title for the video' },
              viralHook: { type: Type.STRING, description: 'The exact opening hook sentence that stops thumbs' },
              tiktokCaption: { type: Type.STRING, description: 'High-converting TikTok caption with call to action' },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '5-8 high-reach hashtags like #fyp #viral #storytime'
              },
              estimatedTotalSeconds: { type: Type.NUMBER, description: 'Total estimated video length in seconds' },
              bgmSuggestion: {
                type: Type.STRING,
                description: 'Recommended background music mood (e.g., phonk_drift, lo_fi_chill, suspense_dark, upbeat_pop, cartoon_quirky)'
              },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.NUMBER },
                    durationSec: { type: Type.NUMBER, description: 'Scene length between 3 and 6 seconds' },
                    narration: { type: Type.STRING, description: 'Spoken text' },
                    visualDescription: { type: Type.STRING, description: 'Detailed prompt for visual illustration' },
                    visualStyleKeywords: { type: Type.STRING, description: 'Aesthetic tags for art rendering' },
                    cameraEffect: { type: Type.STRING, enum: ['zoom_in', 'zoom_out', 'pan_left', 'pan_right', 'shake', 'flash_cut'] },
                    soundEffectCue: { type: Type.STRING, enum: ['vine_boom', 'whoosh', 'sub_drop', 'cash_register', 'chime', 'record_scratch', 'alert_stinger', 'none'] },
                    overlayBadge: { type: Type.STRING },
                    emojiAccent: { type: Type.STRING },
                    characterEmotion: { type: Type.STRING, enum: ['shocked', 'heroic', 'laughing', 'scheming', 'thinking', 'angry', 'crying', 'confident'] },
                    dialogueSpeaker: { type: Type.STRING }
                  },
                  required: ['sceneNumber', 'durationSec', 'narration', 'visualDescription', 'cameraEffect', 'soundEffectCue', 'overlayBadge', 'emojiAccent']
                }
              }
            },
            required: ['title', 'viralHook', 'tiktokCaption', 'hashtags', 'scenes']
          }
        }
      });
      parsedData = JSON.parse(response.text || '{}');
    } catch (modelErr: any) {
      console.warn('Gemini 3.1 model call fallback triggered:', modelErr.message);
      // Resilient Smart Text-to-Video Engine: Split any prompt text into high-retention scenes
      const sentences = topic.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 5);
      const sceneTexts = sentences.length >= 2 ? sentences.slice(0, 7) : [
        `Here is what you need to know about ${topic}: it changes everything you thought you knew.`,
        `When you look at the deeper facts, the real story is ten times more intense than it seems.`,
        `Drop a comment with your opinion right now, and follow for part two!`
      ];

      const cameraList = ['zoom_in', 'pan_left', 'shake', 'pan_right', 'zoom_out'];
      const sfxList = ['whoosh', 'vine_boom', 'sub_drop', 'alert_stinger', 'cash_register'];
      const badgeList = ['WAIT FOR IT...', 'MIND BLOWN 🤯', 'PLOT TWIST', 'SECRET REVEALED', 'DON\'T SKIP'];

      parsedData = {
        title: topic.slice(0, 40) || 'Viral Video',
        viralHook: sceneTexts[0],
        tiktokCaption: `Wait until the end... 🤯\n\nWhat do you think? Drop a comment below! 👇`,
        hashtags: ['#fyp', '#viral', '#shorts', '#trending', '#mindblown'],
        estimatedTotalSeconds: sceneTexts.length * 4.2,
        bgmSuggestion: 'phonk_drift',
        scenes: sceneTexts.map((text, i) => ({
          sceneNumber: i + 1,
          durationSec: 4.2,
          narration: text,
          visualDescription: `Cinematic 9:16 vertical visual for: ${text}`,
          visualStyleKeywords: 'Cinematic 9:16, 8k resolution, volumetric neon lighting',
          cameraEffect: cameraList[i % cameraList.length],
          soundEffectCue: sfxList[i % sfxList.length],
          overlayBadge: badgeList[i % badgeList.length],
          emojiAccent: '🤯⚡',
          characterEmotion: 'shocked'
        }))
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process prompt to video.'
    });
  }
});

// 2. Text-to-Speech (TTS) Endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore', style = 'High-energy viral social media creator' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const ai = getGeminiClient();

    // Valid prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const allowedVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const chosenVoice = allowedVoices.includes(voice) ? voice : 'Kore';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 400), // Keep concise per scene for low latency
              speechMetadata: {
                style: style
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS.' });
    }

    return res.json({
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
      format: 'audio/wav',
      voice: chosenVoice
    });
  } catch (error: any) {
    console.warn('Gemini TTS error (will allow client fallback):', error.message || error);
    return res.status(500).json({
      error: error.message || 'TTS generation unavailable',
      fallback: true
    });
  }
});

// 3. AI Scene Visual Generation (Image) Endpoint
app.post('/api/generate-visual', async (req, res) => {
  try {
    const { prompt, style = 'cinematic', isCartoon = false } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = getGeminiClient();

    const enhancedPrompt = isCartoon
      ? `3D Pixar and Disney animation movie still, vibrant 9:16 vertical portrait wallpaper, cute expressive character, rich volumetric rim lighting, high detail, masterpiece: ${prompt}`
      : `Cinematic 9:16 vertical TikTok viral video B-roll still shot, hyper-realistic, 8k resolution, dramatic lighting, shot on 35mm lens, high contrast: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: '9:16'
        }
      }
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      return res.json({ imageUrl });
    } else {
      return res.status(404).json({ error: 'No image generated in response', fallbackNeeded: true });
    }
  } catch (error: any) {
    console.warn('Image generation error (fallback will be used):', error.message || error);
    return res.status(500).json({
      error: error.message || 'Failed to generate visual with Gemini image model.',
      fallbackNeeded: true
    });
  }
});

// 4. Viral Script Re-writer / Hook Optimizer Endpoint
app.post('/api/enhance-hook', async (req, res) => {
  try {
    const { currentHook, angle = 'shock' } = req.body;
    const ai = getGeminiClient();

    const prompt = `Rewrite this short-form video hook into 5 different ultra-viral variations designed to stop scrolling on TikTok/Reels/Shorts:
Current Hook: "${currentHook}"
Angle: ${angle} (Options: curiosity gap, extreme controversy/shock, negative question, FOMO/secret, numbers/data).
Return JSON with { "hooks": [{ "text": string, "angle": string, "predictedScore": number }] }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  angle: { type: Type.STRING },
                  predictedScore: { type: Type.NUMBER, description: 'Viral score out of 100' }
                },
                required: ['text', 'angle', 'predictedScore']
              }
            }
          },
          required: ['hooks']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{"hooks": []}');
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Hook enhancer failed' });
  }
});

// Vite / static file serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TikCraft Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
