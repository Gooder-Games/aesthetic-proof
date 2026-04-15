const fs = require('fs');

/**
 * Quick smoke test for the /api/v1/generate endpoint.
 *
 * Usage:
 *   AP_API_KEY=ap_your_key_here node test_api.js
 *
 * Requires the dev server to be running on localhost:3000.
 */
async function testApi() {
  const apiKey = process.env.AP_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing AP_API_KEY environment variable.');
    console.error('   Usage: AP_API_KEY=ap_xxx node test_api.js');
    process.exit(1);
  }

  const response = await fetch('http://localhost:3000/api/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "Alex Rivers",
      text: "This new Sunset preset is absolute fire. It matches my brand perfectly!",
      rating: 5,
      theme: "transparent",
      compact: true,
      preset: "sunset",
      styles: {
        elevation: 3
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync('aesthetic_embed_final.png', buffer);
  console.log('✅ Success! Created aesthetic_embed_final.png');
}

testApi();
