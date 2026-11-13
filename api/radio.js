const https = require('https');

// Memoria en caliente por instancia para evitar llamadas repetidas
let cachedStream = {
  httpsUrl: 'https://uk14freenew.listen2myradio.com/live.mp3?typeportmount=s2_28150_stream_914584271',
  httpUrl: 'http://uk14freenew.listen2myradio.com:28150/;?type=http&nocache=20',
  host: 'uk14freenew.listen2myradio.com',
  port: '28150',
  updatedAt: 0
};

function fetchActiveStreamMetadata(clientIp, userAgent) {
  return new Promise((resolve) => {
    // Si fue actualizado hace menos de 45 segundos en esta instancia, reutilizar en memoria
    if (Date.now() - cachedStream.updatedAt < 45000) {
      return resolve(cachedStream);
    }

    const headers = {
      'User-Agent': userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'text/html,application/xhtml+xml'
    };
    if (clientIp) {
      headers['X-Forwarded-For'] = clientIp;
    }

    const req = https.get(
      'https://espaciopower.radiostream321.com/index.php',
      { timeout: 2500, headers },
      (res) => {
        let html = '';
        res.on('data', (chunk) => { html += chunk.toString(); });
        res.on('end', () => {
          const urlMatch = html.match(/id=["']urladdress["'][^>]*>\s*(https?:\/\/[^\s<]+)/i);
          if (urlMatch && urlMatch[1]) {
            const httpsUrl = urlMatch[1].trim();
            const hpMatch = httpsUrl.match(/https?:\/\/([a-z0-9.-]+listen2myradio\.com)\/live\.mp3\?typeportmount=s\d+_(\d+)_stream/i);
            const host = (hpMatch && hpMatch[1]) ? hpMatch[1] : cachedStream.host;
            const port = (hpMatch && hpMatch[2]) ? hpMatch[2] : cachedStream.port;
            cachedStream = {
              httpsUrl,
              httpUrl: `http://${host}:${port}/;?type=http&nocache=20`,
              host,
              port,
              updatedAt: Date.now()
            };
          }
          resolve(cachedStream);
        });
      }
    );

    req.on('error', () => resolve(cachedStream));
    req.on('timeout', () => {
      req.destroy();
      resolve(cachedStream);
    });
  });
}

module.exports = async function handler(req, res) {
  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const userAgent = req.headers['user-agent'];
  const info = await fetchActiveStreamMetadata(clientIp, userAgent);

  // Cachear la respuesta en el CDN de Vercel por 60 segundos (con revalidación en segundo plano)
  // Esto evita que cada oyente invoque la función de origen y reduce el Fast Origin Transfer a ~0 MB
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.setHeader('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.query && req.query.format === 'json') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).end(JSON.stringify(info));
  }

  // Redirección 302 directa al stream HTTPS de Listen2MyRadio:
  // El navegador descarga el audio directamente de Listen2MyRadio sin transferir megabytes por Vercel.
  res.writeHead(302, { Location: info.httpsUrl });
  res.end();
};
