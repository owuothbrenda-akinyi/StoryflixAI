import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // Color helper (gradient: amber -> rose -> violet)
  function getPixel(x, y) {
    // Normalised coordinates 0 to 1
    const nx = x / width;
    const ny = y / height;

    // Corner radius for rounded squircle (unless maskable, which is full bleed)
    if (!isMaskable) {
      const cornerR = 0.22;
      const dx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerR));
      const dy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerR));
      if (dx * dx + dy * dy > cornerR * cornerR) {
        return [0, 0, 0, 0]; // Transparent outside squircle
      }
    }

    // Gradient background
    const t = (nx + ny) * 0.5;
    let r, g, b;
    if (t < 0.5) {
      const f = t / 0.5;
      r = Math.round(245 * (1 - f) + 244 * f);
      g = Math.round(158 * (1 - f) + 63 * f);
      b = Math.round(11 * (1 - f) + 94 * f);
    } else {
      const f = (t - 0.5) / 0.5;
      r = Math.round(244 * (1 - f) + 124 * f);
      g = Math.round(63 * (1 - f) + 58 * f);
      b = Math.round(94 * (1 - f) + 237 * f);
    }

    // Center icon: Phone shape (nx between 0.32 and 0.68, ny between 0.20 and 0.80)
    const phoneX1 = 0.33, phoneX2 = 0.67;
    const phoneY1 = 0.20, phoneY2 = 0.80;
    const phoneCorner = 0.06;

    const pdx = Math.max(0, Math.abs(nx - (phoneX1 + phoneX2) / 2) - ((phoneX2 - phoneX1) / 2 - phoneCorner));
    const pdy = Math.max(0, Math.abs(ny - (phoneY1 + phoneY2) / 2) - ((phoneY2 - phoneY1) / 2 - phoneCorner));

    if (nx >= phoneX1 && nx <= phoneX2 && ny >= phoneY1 && ny <= phoneY2 && (pdx * pdx + pdy * pdy <= phoneCorner * phoneCorner)) {
      // Border
      const borderWidth = 0.02;
      const innerX1 = phoneX1 + borderWidth, innerX2 = phoneX2 - borderWidth;
      const innerY1 = phoneY1 + borderWidth, innerY2 = phoneY2 - borderWidth;

      if (nx >= innerX1 && nx <= innerX2 && ny >= innerY1 && ny <= innerY2) {
        // Inside phone screen: Dark background
        let pr = 20, pg = 20, pb = 25;

        // Play Triangle in center (vertices: [0.44, 0.40], [0.60, 0.50], [0.44, 0.60])
        const tx1 = 0.44, ty1 = 0.40;
        const tx2 = 0.60, ty2 = 0.50;
        const tx3 = 0.44, ty3 = 0.60;

        function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
          return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
        }
        const d1 = sign(nx, ny, tx1, ty1, tx2, ty2);
        const d2 = sign(nx, ny, tx2, ty2, tx3, ty3);
        const d3 = sign(nx, ny, tx3, ty3, tx1, ty1);

        const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        if (!(hasNeg && hasPos)) {
          // Inside triangle: Rose color
          return [244, 63, 94, 255];
        }

        return [pr, pg, pb, 255];
      }
      return [255, 255, 255, 220]; // White border
    }

    return [r, g, b, 255];
  }

  // Raw image data with 1 byte filter prefix per scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Header: 8 bytes
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: 13 bytes
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Non-interlaced

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write PWA Icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));

console.log('Successfully generated all PWA PNG icons!');
