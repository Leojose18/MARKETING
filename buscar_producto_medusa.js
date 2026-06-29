const https = require('https');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';
const BUSCAR = process.argv[2] || 'EK60R410A1';

function apiRequest(method, endpoint, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request({ hostname: API_HOST, path: endpoint, method, headers }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch (e) { resolve({ status: res.statusCode, data: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const loginRes = await apiRequest('POST', '/auth/user/emailpass', { email: EMAIL, password: PASSWORD });
  const token = loginRes.data?.token;
  if (!token) { console.error('Login fallido'); process.exit(1); }

  const res = await apiRequest('GET', `/admin/products?q=${encodeURIComponent(BUSCAR)}&limit=10`, null, token);
  const products = res.data?.products || [];
  
  console.log(`\nBuscando: "${BUSCAR}" — ${products.length} resultado(s)\n`);
  for (const p of products) {
    console.log(`ID: ${p.id}`);
    console.log(`Titulo: ${p.title}`);
    console.log(`Handle: ${p.handle}`);
    console.log(`Variantes:`);
    for (const v of (p.variants || [])) {
      console.log(`  - SKU: [${v.sku}]  Titulo: ${v.title}`);
    }
    console.log('');
  }
}

main().catch(console.error);
