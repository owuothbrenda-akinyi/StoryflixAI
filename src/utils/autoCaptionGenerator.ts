import { Scene, SubtitleBlock } from '../types/studio';

export interface AutoCaptionOptions {
  wordsPerBlock?: number; // default 3 words per block (Hormozi / MrBeast style)
  timingOffsetSec?: number; // micro delay or advance
}

/**
 * Auto-Caption Generator
 * Analyzes scene narration text and duration, calculates natural speech cadence,
 * and generates precise timed subtitle blocks with word-level breakdown.
 */
export function generateAutoCaptions(
  scenes: Scene[],
  options: AutoCaptionOptions = {}
): SubtitleBlock[] {
  const wordsPerBlock = options.wordsPerBlock || 3;
  const timingOffset = options.timingOffsetSec || 0;

  const blocks: SubtitleBlock[] = [];
  let timelineCursorSec = 0;

  scenes.forEach((scene, sceneIndex) => {
    const text = (scene.narration || '').trim();
    const sceneDuration = scene.durationSec || 4.0;
    const sceneStart = timelineCursorSec + timingOffset;

    if (!text) {
      timelineCursorSec += sceneDuration;
      return;
    }

    // Split text into words, keeping punctuation attached
    const rawWords = text.split(/\s+/).filter(Boolean);

    if (rawWords.length === 0) {
      timelineCursorSec += sceneDuration;
      return;
    }

    // Allocate time per word across the scene (with slight pause at beginning and end)
    const effectiveDuration = Math.max(0.5, sceneDuration * 0.95);
    const startPadding = sceneDuration * 0.025;
    const timePerWord = effectiveDuration / rawWords.length;

    // Group words into blocks of wordsPerBlock (or break at punctuation ., ?, !)
    const chunks: { words: string[]; startWordIdx: number }[] = [];
    let currentChunk: string[] = [];
    let currentChunkStartIdx = 0;

    rawWords.forEach((word, wordIdx) => {
      if (currentChunk.length === 0) {
        currentChunkStartIdx = wordIdx;
      }
      currentChunk.push(word);

      const hasSentenceBreak = /[.!?]$/.test(word);
      const isFullChunk = currentChunk.length >= wordsPerBlock;

      if (hasSentenceBreak || isFullChunk || wordIdx === rawWords.length - 1) {
        chunks.push({ words: currentChunk, startWordIdx: currentChunkStartIdx });
        currentChunk = [];
      }
    });

    // Create subtitle blocks with exact seconds
    chunks.forEach((chunk, chunkIdx) => {
      const blockStartInScene = startPadding + chunk.startWordIdx * timePerWord;
      const blockDuration = Math.max(0.4, chunk.words.length * timePerWord);
      const blockEndInScene = Math.min(sceneDuration, blockStartInScene + blockDuration);

      const absStart = Math.max(0, sceneStart + blockStartInScene);
      const absEnd = sceneStart + blockEndInScene;

      // Word-level timestamps within the block
      const wordTimings = chunk.words.map((w, wIdx) => {
        const wStart = absStart + wIdx * timePerWord;
        const wEnd = Math.min(absEnd, wStart + timePerWord);
        return {
          word: w,
          start: Number(wStart.toFixed(2)),
          end: Number(wEnd.toFixed(2))
        };
      });

      blocks.push({
        id: `sub_${sceneIndex}_${chunkIdx}_${Date.now()}`,
        sceneIndex,
        text: chunk.words.join(' '),
        startSec: Number(absStart.toFixed(2)),
        endSec: Number(absEnd.toFixed(2)),
        words: wordTimings
      });
    });

    timelineCursorSec += sceneDuration;
  });

  return blocks;
}
