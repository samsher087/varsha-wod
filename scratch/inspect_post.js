const fs = require('fs');

async function inspect(shortcode) {
  const url = `https://www.instagram.com/p/${shortcode}/`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync(`scratch/post_${shortcode}.html`, html);
  console.log(`[${shortcode}] HTML size:`, html.length);
  
  // Look for title
  const title = html.match(/<title>([^<]+)<\/title>/i);
  console.log(`[${shortcode}] Title:`, title ? title[1] : 'none');

  // Look for any text mentioning the author or content
  const naju = html.includes('naju') || html.includes('Naju');
  console.log(`[${shortcode}] Contains naju:`, naju);
}

async function run() {
  await inspect('C-_kJq3SswG');
  await inspect('De3MkanTRut');
}

run();
