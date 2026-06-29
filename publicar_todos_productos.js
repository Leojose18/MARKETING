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
  const res = await apiRequest('POST', '/auth/user/emailpass', { email: EMAIL, password: PASSWORD });
  if (res.data?.token) { console.log('✅ Login exitoso'); return res.data.token; }
  throw new Error('Login fallido: ' + JSON.stringify(res.data));
}

async function getAllMedusaProducts(token) {
  let all = [];
  let offset = 0;
  const limit = 50;
  let total = null;
  while (true) {
    const res = await apiRequest('GET', `/admin/products?limit=${limit}&offset=${offset}`, null, token);
    if (res.status !== 200) break;
    const products = res.data.products || [];
    if (total === null) total = res.data.count;
    all = all.concat(products);
    offset += products.length;
    if (products.length < limit || offset >= total) break;
    await new Promise(r => setTimeout(r, 200));
  }
  return all;
}

async function main() {
  const token = await getToken();

  console.log('\n📦 Obteniendo todos los productos...');
  const allProducts = await getAllMedusaProducts(token);
  console.log(`✅ ${allProducts.length} productos totales`);

  const drafts = allProducts.filter(p => p.status === 'draft');
  console.log(`📝 ${drafts.length} productos en borrador (no visibles en web)`);

  if (drafts.length === 0) {
    console.log('✅ Todos los productos ya están publicados.');
    return;
  }

  console.log('\n🚀 Publicando todos los borradores...');
  let ok = 0, fail = 0;
  const log = [];

  for (const p of drafts) {
    const res = await apiRequest('POST', `/admin/products/${p.id}`, { status: 'published' }, token);
    if (res.status === 200 || res.status === 201) {
      ok++;
      const msg = `✅ Publicado: ${p.title?.substring(0, 60)}`;
      if (ok <= 10 || ok % 50 === 0) console.log(msg);
      log.push(msg);
    } else {
      fail++;
      const msg = `❌ Error: ${p.title?.substring(0, 40)} → ${JSON.stringify(res.data?.message || res.data).substring(0, 80)}`;
      console.log(msg);
      log.push(msg);
    }
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🏁 ${ok} publicados, ${fail} fallidos`);
  fs.writeFileSync(path.join(__dirname, 'log_publicar_productos.txt'), log.join('\n'));
  console.log('📄 Log guardado en log_publicar_productos.txt');
}

main().catch(console.error);
