const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // To download the video from your AI API

/**
 * compositeTikTokVideo
 * 
 * Takes an AI video URL (or local file path), downloads/streams it,
 * picks a random pre-downloaded B-Roll clip (Minecraft, Subway Surfer, etc.) from assets/broll,
 * crops both to 1080:960 center windows, vstacks them into a 1080x1920 (9:16) video,
 * syncs to the AI video duration (-shortest), and renders via libx264.
 *
 * @param {string} aiVideoUrl - Remote HTTP URL or local video path
 * @param {string} outputFileName - Desired output filename (e.g. 'output_tiktok_video.mp4')
 * @returns {Promise<string>} - Resolves with absolute path to output video
 */
async function compositeTikTokVideo(aiVideoUrl, outputFileName) {
    return new Promise(async (resolve, reject) => {
        
        // 1. Define paths for processing
        const tempAiVideoPath = path.join(__dirname, '..', `temp_ai_scene_${Date.now()}.mp4`);
        const outputFolder = path.join(__dirname, '..', 'outputs');
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        const outputPath = path.join(outputFolder, outputFileName);
        
        // 2. Stream B: Pick a random pre-downloaded Minecraft clip from your assets folder
        let bRollFolder = path.join(__dirname, '..', 'assets', 'broll');
        if (!fs.existsSync(bRollFolder) || fs.readdirSync(bRollFolder).filter(f => f.endsWith('.mp4')).length === 0) {
            bRollFolder = path.join(__dirname, '..', 'public', 'assets', 'broll');
        }

        const bRollFiles = fs.readdirSync(bRollFolder).filter(file => file.endsWith('.mp4'));
        if (bRollFiles.length === 0) {
            return reject(new Error(`No B-Roll video files found in ${bRollFolder}`));
        }
        const randomBRoll = bRollFiles[Math.floor(Math.random() * bRollFiles.length)];
        const bRollPath = path.join(bRollFolder, randomBRoll);

        try {
            // 3. Download Stream A (The clean AI video) from your API response url
            if (aiVideoUrl.startsWith('http://') || aiVideoUrl.startsWith('https://')) {
                const response = await axios({
                    method: 'GET',
                    url: aiVideoUrl,
                    responseType: 'stream'
                });
                
                const writer = fs.createWriteStream(tempAiVideoPath);
                response.data.pipe(writer);
                
                await new Promise((res, rej) => {
                    writer.on('finish', res);
                    writer.on('error', rej);
                });
            } else {
                // Support local video path
                const resolvedLocal = path.isAbsolute(aiVideoUrl)
                    ? aiVideoUrl
                    : path.resolve(__dirname, '..', aiVideoUrl);
                fs.copyFileSync(resolvedLocal, tempAiVideoPath);
            }

            // 4. Run FFmpeg to crop, scale, stack, and sync the lengths perfectly
            const command = ffmpeg()
                .input(tempAiVideoPath) // Input 0: The pristine AI video
                .input(bRollPath);      // Input 1: The local Minecraft gameplay

            const filterGraph = [
                // Scale and crop Stream A to fill the top half (1080x960), synced to 30fps
                '[0:v]scale=1080:1920,crop=1080:960:0:480,fps=30,setsar=1[top]',
                // Scale and crop Stream B to fill the bottom half (1080x960), synced to 30fps
                '[1:v]scale=1080:1920,crop=1080:960:0:480,fps=30,setsar=1[bottom]',
                // Stack them vertically into one 1080x1920 frame
                '[top][bottom]vstack=inputs=2[v]'
            ];

            if (typeof command.complexFilter === 'function') {
                command.complexFilter(filterGraph);
            } else if (typeof command.filterComplex === 'function') {
                command.filterComplex(filterGraph);
            }

            command
                .map('[v]')             // Map the newly stacked video stream
                .outputOptions([
                    '-map 0:a?',        // Map audio from AI video (voiceover narration), safe if silent
                    '-shortest',        // CRITICAL: Tells FFmpeg to cut the long Minecraft clip the exact second the AI video ends
                    '-c:v libx264',     // Standard web-safe video codec
                    '-crf 18',          // High visual quality setting
                    '-preset veryfast', // Fast rendering
                    '-pix_fmt yuv420p', // Ensures perfect playback compatibility on mobile/TikTok
                    '-movflags +faststart' // Places moov atom at beginning for instant web streaming
                ])
                .output(outputPath)
                .on('end', () => {
                    // Clean up the temporary raw AI file from your server disk
                    try {
                        if (fs.existsSync(tempAiVideoPath)) {
                            fs.unlinkSync(tempAiVideoPath);
                        }
                    } catch (e) {}
                    console.log('Successfully generated split-screen video! Output:', outputPath);
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error('FFmpeg compilation error: ', err);
                    try {
                        if (fs.existsSync(tempAiVideoPath)) {
                            fs.unlinkSync(tempAiVideoPath);
                        }
                    } catch (e) {}
                    reject(err);
                })
                .run();

        } catch (error) {
            console.error("Failed to process streams:", error);
            try {
                if (fs.existsSync(tempAiVideoPath)) {
                    fs.unlinkSync(tempAiVideoPath);
                }
            } catch (e) {}
            reject(error);
        }
    });
}

module.exports = { compositeTikTokVideo };
