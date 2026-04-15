const fs = require('fs');
const path = require('path');

/**
 * Generate preset preview images for the landing page.
 *
 * Usage:
 *   AP_API_KEY=ap_your_key_here node generate_presets.js
 *
 * Requires the dev server to be running on localhost:3000.
 */
async function generatePresets() {
  const apiKey = process.env.AP_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing AP_API_KEY environment variable.');
    console.error('   Usage: AP_API_KEY=ap_xxx node generate_presets.js');
    process.exit(1);
  }

  const presets = ['frost', 'midnight', 'sunset', 'minimal'];

  for (const preset of presets) {
    console.log(`Generating ${preset}...`);
    const response = await fetch('http://localhost:3000/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Jane Doe",
        text: `This ${preset} theme looks absolutely incredible. The design quality is unmatched!`,
        rating: 5,
        theme: preset === 'midnight' ? 'dark' : 'light',
        compact: true,
        preset: preset
      })
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(path.join('public', 'presets', `${preset}.png`), buffer);
      console.log(`✅ Saved public/presets/${preset}.png`);
    } else {
      console.error(`❌ Failed ${preset}:`, await response.text());
    }
  }
}

generatePresets();
