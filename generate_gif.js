const fs = require('fs');
const GIFEncoder = require('gifencoder');
const { Jimp } = require('jimp');
const path = require('path');

async function createGif() {
  console.log('Generating 240x240 Animated Thumbnail...');
  const presetsDir = path.join(__dirname, 'public', 'presets');
  const files = ['midnight.png', 'frost.png', 'sunset.png', 'minimal.png'];

  const encoder = new GIFEncoder(240, 240);
  const outPath = path.join(__dirname, 'launch_assets', 'images', 'thumbnail_animated.gif');
  encoder.createReadStream().pipe(fs.createWriteStream(outPath));

  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(800); // 0.8 second per frame
  encoder.setQuality(10); // image quality. 10 is default.

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(presetsDir, file);
    // Read the image using Jimp
    const image = await Jimp.read(filePath);
    
    // We want to crop the 1200x630 nicely. Let's cover an area of 240x240.
    // To 'cover', we first resize the height to 240, which leaves width > 240, then we crop the center.
    image.cover({ w: 240, h: 240 });
    
    // Get the pixel data as a buffer matching what gifencoder wants
    /* 
      Jimp 1.x uses .bitmap.data, which is an RGBA buffer.
    */
    encoder.addFrame(image.bitmap.data);
  }

  encoder.finish();
  console.log(`✅ GIF Saved to ${outPath}`);
}

createGif().catch(err => {
  console.error("Error generating GIF:", err);
});
