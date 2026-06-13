import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));

const variants = [
  { name: 'landscape.jpg', width: 1600, height: 1200, hue: 200 },
  { name: 'portrait.jpg', width: 1080, height: 1920, hue: 30 },
  { name: 'square.jpg', width: 1500, height: 1500, hue: 120 },
];

function svgFor(width, height, hue) {
  const c1 = `hsl(${hue}, 70%, 70%)`;
  const c2 = `hsl(${(hue + 60) % 360}, 70%, 40%)`;
  const fs = Math.round(Math.min(width, height) * 0.12);
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="${width * 0.3}" cy="${height * 0.35}" r="${Math.min(width, height) * 0.18}" fill="white" fill-opacity="0.35"/>
      <circle cx="${width * 0.7}" cy="${height * 0.7}" r="${Math.min(width, height) * 0.12}" fill="black" fill-opacity="0.25"/>
      <text x="${width / 2}" y="${height / 2}" font-family="sans-serif" font-size="${fs}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">TEST</text>
    </svg>
  `;
}

for (const { name, width, height, hue } of variants) {
  const out = join(here, name);
  const svg = Buffer.from(svgFor(width, height, hue));
  const buf = await sharp(svg).jpeg({ quality: 80 }).toBuffer();
  await writeFile(out, buf);
  console.log(`wrote ${out} (${buf.length} bytes)`);
}
