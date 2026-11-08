const fs = require('fs');
const html = fs.readFileSync('scratch/embed_dump.html', 'utf8');

console.log('Length:', html.length);
console.log('Has Error text:', html.includes('broken') || html.includes('removed'));
console.log('Has Login text:', html.includes('Log In') || html.includes('login'));

// Look for window.__additionalDataLoaded or similar
const addData = html.match(/window\.__additionalDataLoaded\s*\(.*?\);/);
console.log('additionalDataLoaded:', addData ? 'YES' : 'NO');

// Look for any media URLs (cdninstagram.com)
const cdnMatches = html.match(/https:\/\/[^"'\s\\]+?\.cdninstagram\.com[^"'\s\\]*/g) || [];
console.log('cdninstagram URLs count:', cdnMatches.length);
if (cdnMatches.length > 0) {
  console.log('Sample cdn link:', cdnMatches[0]);
}
