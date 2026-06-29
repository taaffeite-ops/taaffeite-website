import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const photosDir = path.join(rootDir, 'public', 'assets', '05 PHOTOS');

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.webp' || ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        results.push(fullPath);
      }
    }
  });
  return results;
}

async function run() {
  console.log(`Scanning photos in: ${photosDir}`);
  if (!fs.existsSync(photosDir)) {
    console.error('Photos directory does not exist.');
    return;
  }

  const files = getFilesRecursively(photosDir);
  console.log(`Found ${files.length} images to optimize.`);

  let totalSaved = 0;
  let optimizedCount = 0;

  for (const file of files) {
    try {
      // Read file into buffer to avoid EBUSY Windows file locking issues
      const inputBuffer = fs.readFileSync(file);
      const metadata = await sharp(inputBuffer).metadata();
      const originalSize = inputBuffer.length;

      // If the image is already reasonable size (width <= 1000px) and it's webp, skip
      if (metadata.width <= 1000 && path.extname(file).toLowerCase() === '.webp') {
        console.log(`Skipping (already optimized): ${path.relative(rootDir, file)} (${metadata.width}x${metadata.height})`);
        continue;
      }

      console.log(`Optimizing: ${path.relative(rootDir, file)} (${metadata.width}x${metadata.height}) - ${Math.round(originalSize / 1024)} KB`);

      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);
      const dirName = path.dirname(file);

      let finalPipeline = sharp(inputBuffer);
      if (metadata.width > 1000) {
        finalPipeline = finalPipeline.resize(1000, null, { fit: 'inside', withoutEnlargement: true });
      }

      let outputBuffer;
      if (ext === '.webp') {
        outputBuffer = await finalPipeline.webp({ quality: 80 }).toBuffer();
      } else if (ext === '.png') {
        outputBuffer = await finalPipeline.png({ compressionLevel: 9 }).toBuffer();
      } else {
        outputBuffer = await finalPipeline.jpeg({ quality: 80 }).toBuffer();
      }

      // Write output buffer back to file (this is safe since the file is not locked)
      fs.writeFileSync(file, outputBuffer);

      const newSize = outputBuffer.length;
      const saved = originalSize - newSize;
      totalSaved += saved;
      optimizedCount++;

      console.log(` -> Done! New Size: ${Math.round(newSize / 1024)} KB | Saved: ${Math.round(saved / 1024)} KB (${Math.round((saved / originalSize) * 100)}%)`);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
    }
  }

  console.log(`\nOptimization finished!`);
  console.log(`Optimized ${optimizedCount} images.`);
  console.log(`Total saved space: ${Math.round(totalSaved / (1024 * 1024) * 100) / 100} MB`);
}

run();
