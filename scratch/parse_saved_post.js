const fs = require('fs');

const html = fs.readFileSync('scratch/post_C-_kJq3SswG.html', 'utf8');

// Look for video_url
const videoUrls = [...html.matchAll(/"video_url":"([^"]+)"/g)];
console.log('video_url count:', videoUrls.length);
if (videoUrls.length > 0) {
  console.log('Found video_url:', videoUrls[0][1].replace(/\\u0026/g, '&'));
}

// Look for display_url
const displayUrls = [...html.matchAll(/"display_url":"([^"]+)"/g)];
console.log('display_url count:', displayUrls.length);
if (displayUrls.length > 0) {
  console.log('Found display_url:', displayUrls[0][1].replace(/\\u0026/g, '&'));
}

// Look for any https://scontent or https://video.cdninstagram.com
const cdnVideos = [...html.matchAll(/https:\/\/[^"'\s\\]+?\.cdninstagram\.com\/[^"'\s\\]+?\.mp4[^"'\s\\]*/g)];
console.log('cdnVideos count:', cdnVideos.length);
if (cdnVideos.length > 0) {
  console.log('Found cdnVideo:', cdnVideos[0][0]);
}

// Look for any mentions of text or captions
const captions = [...html.matchAll(/"text":"([^"]{20,200})"/g)];
console.log('Captions count:', captions.length);
if (captions.length > 0) {
  console.log('Sample caption:', captions.slice(0, 3).map(c => c[1]));
}
