import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesToOptimize = [
  {
    input: 'public/assets/images/founders3.png',
    outputs: [
      { suffix: '-sm', width: 600, format: 'webp', quality: 80 },
      { suffix: '-lg', width: 1200, format: 'webp', quality: 82 },
      { suffix: '', width: 1200, format: 'webp', quality: 82 } // also founders3.webp
    ]
  },
  {
    input: 'public/assets/images/logo.png',
    outputs: [
      { suffix: '', width: 450, height: 450, format: 'webp', quality: 85 }, // logo.webp
      { suffix: '', width: 450, height: 450, format: 'png', quality: 85, overwriteInput: true } // overwrite logo.png to 450x450
    ]
  },
  {
    input: 'public/assets/05 PHOTOS/Proposal/0039.webp',
    outputs: [
      { suffix: '-sm', width: 600, format: 'webp', quality: 75 },
      { suffix: '-md', width: 1200, format: 'webp', quality: 78 },
      { suffix: '-lg', width: 2000, format: 'webp', quality: 80 }
    ]
  },
  {
    input: 'public/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp',
    outputs: [
      { suffix: '-sm', width: 600, format: 'webp', quality: 75 },
      { suffix: '-md', width: 1200, format: 'webp', quality: 78 },
      { suffix: '-lg', width: 2000, format: 'webp', quality: 80 }
    ]
  }
];

async function run() {
  console.log('Starting image optimization...');
  for (const item of imagesToOptimize) {
    const inputPath = path.join(rootDir, item.input);
    if (!fs.existsSync(inputPath)) {
      console.warn(`Input image does not exist: ${inputPath}`);
      continue;
    }

    const ext = path.extname(item.input);
    const baseWithoutExt = path.basename(item.input, ext);
    const dir = path.dirname(inputPath);

    console.log(`Processing: ${item.input}`);

    for (const out of item.outputs) {
      let outputPath;
      if (out.overwriteInput) {
        // We'll write to a temp file first, then overwrite to avoid issues
        outputPath = path.join(dir, `${baseWithoutExt}-temp${ext}`);
      } else {
        outputPath = path.join(dir, `${baseWithoutExt}${out.suffix}.${out.format}`);
      }

      let pipeline = sharp(inputPath);

      if (out.width || out.height) {
        pipeline = pipeline.resize(out.width, out.height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background for logo
        });
      }

      if (out.format === 'webp') {
        pipeline = pipeline.webp({ quality: out.quality });
      } else if (out.format === 'png') {
        pipeline = pipeline.png({ compressionLevel: 9, quality: out.quality });
      }

      await pipeline.toFile(outputPath);
      
      if (out.overwriteInput) {
        const finalPath = path.join(dir, `${baseWithoutExt}${ext}`);
        fs.renameSync(outputPath, finalPath);
        console.log(` -> Overwrote input: ${finalPath} (${fs.statSync(finalPath).size} bytes)`);
      } else {
        console.log(` -> Generated: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
      }
    }
  }
  console.log('Image optimization finished successfully.');
}

run().catch(err => {
  console.error('Error during image optimization:', err);
  process.exit(1);
});
