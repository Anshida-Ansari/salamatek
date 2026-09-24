const sharp = require('sharp');

async function removeBg() {
  const input = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\fabff37b-63dd-4a0c-bc72-5b9321f0cac2\\.user_uploaded\\media_1790228539030.jpg';
  const output = 'd:\\Salamatek\\apps\\web\\public\\images\\24-7-logo-transparent.png';

  try {
    const { data, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If color is very close to white, make transparent
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0;
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(output);
    
    console.log('Successfully created transparent PNG');
  } catch (err) {
    console.error('Error:', err);
  }
}

removeBg();
