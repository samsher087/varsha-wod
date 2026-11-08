const fs = require('fs');

async function run() {
  const res = await fetch('https://www.instagram.com/reel/De3MkanTRut/embed/captioned/');
  const t = await res.text();
  fs.writeFileSync('scratch/embed_dump.html', t);
  console.log('Saved embed_dump.html, size:', t.length);

  // Search for any video references
  const v = t.match(/<video[^>]*src="([^"]+)"/i);
  console.log('Video src tag:', v ? v[1] : 'none');

  // Search for video_url in JSON
  const matches = [...t.matchAll(/"video_url":"([^"]+)"/g)];
  console.log('video_url matches:', matches.length);
  for (const m of matches) {
    console.log('Found video_url:', m[1].replace(/\\u0026/g, '&'));
  }

  // Search for playback_url or any mp4
  const mp4s = t.match(/https:[^"'\s\\]+?\.mp4[^"'\s\\]*/g) || [];
  console.log('Direct mp4 matches:', mp4s.length);
  if (mp4s.length > 0) {
    console.log('Sample mp4:', mp4s[0]);
  }
}

run();
