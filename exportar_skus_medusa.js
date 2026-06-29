const https = require('https');
const fs = require('fs');
const path = require('path');

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
  const res = await apiRequest('POST', '/auth/user/emailpass', { email: EMAIL, password: PASSWORD }, null);
  if (res.data?.token) { console.log('✅ Login exitoso'); return res.data.token; }
  throw new Error('Login fallido: ' + JSON.stringify(res.data));
}

async function main() {
  const token = await getToken();

  let allSkus = [];
  let offset = 0;
  const limit = 100;
  let total = null;

  console.log('📦 Exportando todos los productos de Medusa...');

  while (true) {
    const res = await apiRequest('GET', `/admin/products?limit=${limit}&offset=${offset}&fields=id,title,variants.sku`, null, token);
    if (res.status !== 200) {
      console.error('Error:', res.status, JSON.stringify(res.data));
      break;
    }

    const products = res.data.products || [];
    if (total === null) total = res.data.count;

    for (const p of products) {
      for (const v of (p.variants || [])) {
        if (v.sku) allSkus.push(v.sku.trim().toUpperCase());
      }
    }

    console.log(`  Progreso: ${offset + products.length}/${total} productos, ${allSkus.length} SKUs encontrados`);

    offset += products.length;
    if (products.length < limit || offset >= total) break;
    await new Promise(r => setTimeout(r, 200));
  }

  const outputPath = path.join(__dirname, 'medusa_skus.json');
  fs.writeFileSync(outputPath, JSON.stringify(allSkus, null, 2));
  console.log(`\n✅ ${allSkus.length} SKUs exportados a: ${outputPath}`);
}

main().catch(console.error);
