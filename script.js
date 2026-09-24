const { Jimp } = require('jimp');
const path = require('path');

async function processImage() {
  try {
    const inputPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\fabff37b-63dd-4a0c-bc72-5b9321f0cac2\\.user_uploaded\\media_1790228148868.jpeg';
    const outputPath = 'd:\\Salamatek\\apps\\web\\public\\images\\24-7-logo-transparent.png';
    
    console.log('Reading image...');
    const img = await Jimp.read(inputPath);
    
    console.log('Processing pixels...');
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx+1];
      const b = this.bitmap.data[idx+2];
      
      // If pixel is white or very light gray, make it transparent
      if (r > 230 && g > 230 && b > 230) {
        this.bitmap.data[idx+3] = 0; // Set alpha to 0
      }
    });
    
    console.log('Writing image...');
    await img.write(outputPath);
    console.log('Done!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
