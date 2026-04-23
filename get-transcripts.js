const https = require('https');
const fs = require('fs');

const API_KEY = 'sd_07d88953907507c92a9bca89ebe58722'; // Replace with your Supadata API key

const videos = [
  {
    id: 'DaxRlFOOITU',
    title: 'The Best LinkedIn Content Strategy 2025 - Lara Acosta',
    expert: 'lara-acosta',
    filename: 'lara-acosta-linkedin-strategy.md'
  },
  {
    id: 'OSzrHwHLT6M',
    title: 'LinkedIn WILL Change in 2026 - Lara Acosta',
    expert: 'lara-acosta',
    filename: 'lara-acosta-linkedin-2026.md'
  },
  {
    id: '7_bFP2iVVN0',
    title: 'B2B Content Marketing and Distribution - Ross Simmonds',
    expert: 'ross-simmonds',
    filename: 'ross-simmonds-b2b-content.md'
  }
];

async function getTranscript(videoId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supadata.ai',
      path: `/v1/youtube/transcript?videoId=${videoId}&text=true`,
      method: 'GET',
      headers: {
        'x-api-key': API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  for (const video of videos) {
    console.log(`Getting transcript for: ${video.title}`);
    try {
      const result = await getTranscript(video.id);
      const content = `# ${video.title}

**Expert:** ${video.expert}
**Video URL:** https://www.youtube.com/watch?v=${video.id}
**Source:** YouTube via Supadata API

---

## Transcript

${result.content || result.text || JSON.stringify(result)}
`;
      const path = `research/youtube-transcripts/${video.filename}`;
      fs.writeFileSync(path, content);
      console.log(`✅ Saved: ${path}`);
    } catch (error) {
      console.log(`❌ Error for ${video.title}: ${error.message}`);
    }
  }
}

main();