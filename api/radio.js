// Vercel Node.js Function: relay the original HTTP stream over the site's HTTPS.
const http = require('node:http');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end();
  }
  const upstream = http.get('http://uk15freenew.listen2myradio.com:24406/;stream.mp3', {
    headers: { 'User-Agent': 'RadioPower909-WebPlayer', 'Icy-MetaData': '0' }
  }, (stream) => {
    if (stream.statusCode !== 200) {
      stream.resume();
      res.statusCode = 502;
      return res.end('Señal temporalmente no disponible.');
    }
    res.setHeader('Content-Type', stream.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.flushHeaders();
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
  upstream.setTimeout(15000, () => upstream.destroy(new Error('Stream timeout')));
  upstream.on('error', () => {
    if (res.headersSent) return res.destroy();
    res.statusCode = 502;
    res.end('No se pudo conectar con Radio Power.');
  });
  res.on('close', () => upstream.destroy());
};
