const fs = require('fs');

async function extract(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none'
      }
    });
    const text = await res.text();
    const mp4Matches = text.match(/https:[^"'\\\s]+?\.mp4[^"'\\\s]*/g) || [];
    console.log(url, '-> mp4 count:', mp4Matches.length);
    if (mp4Matches.length > 0) {
      const cleanUrl = mp4Matches[0]
        .replace(/\\u0026/g, '&')
        .replace(/\\\\/g, '');
      console.log('Clean MP4:', cleanUrl.substring(0, 150));
      return cleanUrl;
    }
  } catch (e) {
    console.error('Error for', url, e.message);
  }
  return null;
}

async function run() {
  const urls = [
    'https://www.instagram.com/p/De3MkanTRut/',
    'https://www.instagram.com/p/C-_kJq3SswG/',
    'https://www.instagram.com/p/DbMqwvYTQAZ/',
    'https://www.instagram.com/p/DchoxfoT2_E/',
    'https://www.instagram.com/p/C_t6cLeywFx/',
    'https://www.instagram.com/p/DcKnR5UTzh_/'
  ];

  for (const u of urls) {
    await extract(u);
  }
}

run();
