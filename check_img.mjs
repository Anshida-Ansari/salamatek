import fs from 'fs';
import path from 'path';

// read raw bytes to get size of jpeg.
// Or just try to require sharp or image-size
try {
  const sharp = await import('sharp');
  const files = fs.readdirSync('apps/web/public/images/hospital').filter(f => f.endsWith('.jpg'));
  for (const f of files) {
    const p = path.join('apps/web/public/images/hospital', f);
    const metadata = await sharp.default(p).metadata();
    console.log(`${f}: ${metadata.width}x${metadata.height}`);
  }
} catch (e) {
  console.log('sharp not found, trying image-size');
  try {
     const sizeOf = (await import('image-size')).default;
     const files = fs.readdirSync('apps/web/public/images/hospital').filter(f => f.endsWith('.jpg'));
     for (const f of files) {
       const p = path.join('apps/web/public/images/hospital', f);
       const dimensions = sizeOf(p);
       console.log(`${f}: ${dimensions.width}x${dimensions.height}`);
     }
  } catch(e2) {
     console.log('Could not get image sizes', e2);
  }
}
