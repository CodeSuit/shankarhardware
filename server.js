const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');
const XML_FILE = path.join(DATA, 'enquiries.xml');

fs.mkdirSync(DATA, { recursive: true });
if (!fs.existsSync(XML_FILE)) {
  fs.writeFileSync(XML_FILE, '<?xml version="1.0" encoding="UTF-8"?>\n<enquiries>\n</enquiries>\n', 'utf8');
}

let writeQueue = Promise.resolve();

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseEnquiries(xml) {
  const result = [];
  const matches = xml.matchAll(/<enquiry>([\s\S]*?)<\/enquiry>/g);
  for (const match of matches) {
    const block = match[1];
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&') : '';
    };
    result.push({
      id: get('id'), date: get('date'), name: get('name'), phone: get('phone'),
      type: get('type'), details: get('details'), product: get('product'), status: get('status')
    });
  }
  return result.reverse();
}

function saveEnquiry(data) {
  writeQueue = writeQueue.then(async () => {
    let xml = await fs.promises.readFile(XML_FILE, 'utf8');
    const enquiry = `    <enquiry>\n` +
      `        <id>${escapeXml(data.id)}</id>\n` +
      `        <date>${escapeXml(data.date)}</date>\n` +
      `        <name>${escapeXml(data.name)}</name>\n` +
      `        <phone>${escapeXml(data.phone)}</phone>\n` +
      `        <type>${escapeXml(data.type)}</type>\n` +
      `        <details>${escapeXml(data.details)}</details>\n` +
      `        <product>${escapeXml(data.product)}</product>\n` +
      `        <status>New</status>\n` +
      `    </enquiry>\n`;
    xml = xml.replace('</enquiries>', enquiry + '</enquiries>');
    await fs.promises.writeFile(XML_FILE, xml, 'utf8');
  });
  return writeQueue;
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function serveStatic(req, res, pathname) {
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.normalize(path.join(PUBLIC, relative));
  if (!file.startsWith(PUBLIC)) return send(res, 403, 'Forbidden', 'text/plain');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'Not found', 'text/plain');
    const ext = path.extname(file).toLowerCase();
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
    send(res, 200, data, types[ext] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'POST' && parsed.pathname === '/api/enquiries') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10000) req.destroy();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const name = String(data.name || '').trim();
        const phone = String(data.phone || '').trim();
        const type = String(data.type || '').trim();
        const details = String(data.details || '').trim();
        const product = String(data.product || '').trim();
        if (!name || !/^\d{10}$/.test(phone) || !type || !details) {
          return send(res, 400, JSON.stringify({ success: false, message: 'Invalid enquiry details.' }));
        }
        const enquiry = { id: 'ENQ-' + Date.now(), date: new Date().toISOString(), name, phone, type, details, product };
        await saveEnquiry(enquiry);
        return send(res, 201, JSON.stringify({ success: true, enquiry }));
      } catch (err) {
        console.error(err);
        return send(res, 500, JSON.stringify({ success: false, message: 'Could not save enquiry.' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && parsed.pathname === '/api/enquiries') {
    try {
      const xml = fs.readFileSync(XML_FILE, 'utf8');
      return send(res, 200, JSON.stringify({ success: true, enquiries: parseEnquiries(xml) }));
    } catch (err) {
      return send(res, 500, JSON.stringify({ success: false, message: 'Could not read enquiries.' }));
    }
  }

  if (req.method === 'GET' && parsed.pathname === '/enquiries.xml') {
    return fs.readFile(XML_FILE, (err, data) => {
      if (err) return send(res, 500, 'Could not read XML', 'text/plain');
      send(res, 200, data, 'application/xml; charset=utf-8');
    });
  }

  serveStatic(req, res, parsed.pathname);
});

server.listen(PORT, () => console.log(`Shankar Hardware running on port ${PORT}`));
