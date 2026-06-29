const https = require('https');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';

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

async function getToken() {
  const res = await apiRequest('POST', '/auth/user/emailpass', { email: EMAIL, password: PASSWORD });
  if (res.data?.token) { console.log('✅ Login exitoso'); return res.data.token; }
  throw new Error('Login fallido: ' + JSON.stringify(res.data));
}

async function main() {
  const token = await getToken();
  const res = await apiRequest('GET', '/admin/product-categories?limit=100', null, token);
  if (res.status !== 200) {
    console.error('Error:', res.status, JSON.stringify(res.data).substring(0, 300));
    return;
  }
  const cats = res.data.product_categories || [];
  console.log(`\n📋 ${cats.length} categorías encontradas:\n`);
  for (const c of cats) {
    const parent = c.parent_category ? ` (padre: ${c.parent_category.name})` : '';
    console.log(`  ${c.id}  →  ${c.name}${parent}`);
  }
}

main().catch(console.error);
