const fs = require('fs');

async function check() {
  const urls = [
    'https://www.instagram.com/p/De3MkanTRut/',
    'https://www.instagram.com/p/C-_kJq3SswG/',
    'https://www.instagram.com/p/DbMqwvYTQAZ/',
    'https://www.instagram.com/p/DchoxfoT2_E/',
    'https://www.instagram.com/p/C_t6cLeywFx/',
    'https://www.instagram.com/p/DcKnR5UTzh_/'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      const text = await res.text();
      const ogVideo = text.match(/property="og:video(:secure_url)?" content="([^"]+)"/i);
      const ogImage = text.match(/property="og:image" content="([^"]+)"/i);
      const ogTitle = text.match(/property="og:title" content="([^"]+)"/i);
      const ogDesc = text.match(/property="og:description" content="([^"]+)"/i);
      
      console.log('=== URL:', u);
      console.log('Title:', ogTitle ? ogTitle[2] || ogTitle[1] : 'none');
      console.log('Desc:', ogDesc ? ogDesc[2] || ogDesc[1] : 'none');
      console.log('Video:', ogVideo ? ogVideo[2] || ogVideo[1] : 'none');
      console.log('Image:', ogImage ? ogImage[2] || ogImage[1] : 'none');
    } catch (e) {
      console.error('Error for', u, e.message);
    }
  }
}

check();
