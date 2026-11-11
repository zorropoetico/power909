const http = require('http');
const https = require('https');

// Descubre automáticamente el servidor y puerto activo de Listen2MyRadio
function getActiveStreamTarget() {
  return new Promise((resolve) => {
    const fallback = { host: 'uk14freenew.listen2myradio.com', port: '28150' };
    const req = https.get(
      'https://espaciopower.radiostream321.com/index.php',
      { timeout: 2500, headers: { 'User-Agent': 'Mozilla/5.0' } },
      (res) => {
        let html = '';
        res.on('data', (chunk) => { html += chunk.toString(); });
        res.on('end', () => {
          // Busca: https://uk14freenew.listen2myradio.com/live.mp3?typeportmount=s2_28150_stream_...
          const match = html.match(/https?:\/\/([a-z0-9.-]+listen2myradio\.com)\/live\.mp3\?typeportmount=s\d+_(\d+)_stream/i);
          if (match && match[1] && match[2]) {
            resolve({ host: match[1], port: match[2] });
          } else {
            resolve(fallback);
          }
        });
      }
    );
    req.on('error', () => resolve(fallback));
    req.on('timeout', () => { req.destroy(); resolve(fallback); });
  });
}

module.exports = async function handler(req, res) {
  const target = await getActiveStreamTarget();
  const streamUrl = `http://${target.host}:${target.port}/;?type=http&nocache=${Date.now()}`;

  const upstreamReq = http.get(
    streamUrl,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': '*/*',
        'Icy-MetaData': '0',
        'Connection': 'keep-alive'
      }
    },
    (upstreamRes) => {
      res.writeHead(200, {
        'Content-Type': upstreamRes.headers['content-type'] || 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      });

      upstreamRes.pipe(res);

      req.on('close', () => {
        upstreamRes.destroy();
        upstreamReq.destroy();
      });
    }
  );

  upstreamReq.on('error', () => {
    if (!res.headersSent) {
      res.status(502).end('Error conectando con la señal de Radio Power');
    } else {
      res.end();
    }
  });
};
