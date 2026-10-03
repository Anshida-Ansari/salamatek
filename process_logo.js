const { Jimp } = require('jimp');

async function processLogo() {
  const image = await Jimp.read(String.raw`C:\Users\user\.gemini\antigravity-ide\brain\a24e6f3f-d7c6-43cf-b117-061ae6b696d3\.user_uploaded\media_1791034543751.jpg`);
  
  // Crop out the outer 6% to remove the green border
  const cropAmountW = Math.floor(image.bitmap.width * 0.06);
  const cropAmountH = Math.floor(image.bitmap.height * 0.06);
  const cropW = image.bitmap.width - cropAmountW * 2;
  const cropH = image.bitmap.height - cropAmountH * 2;
  image.crop({x: cropAmountW, y: cropAmountH, w: cropW, h: cropH});
  
  // Make white transparent
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // white threshold
    if (r > 230 && g > 230 && b > 230) {
      this.bitmap.data[idx + 3] = 0; // transparent
    }
  });

  // Autocrop the transparent edges (might need different args in Jimp 1.x but we'll try without if it fails)
  // Let's just save it.
  
  await image.write(String.raw`d:\Salamatek\apps\web\public\images\new-logo-transparent.png`);
  console.log('Done!');
}
processLogo().catch(console.error);
