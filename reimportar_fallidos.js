const https = require('https');
const fs = require('fs');
const path = require('path');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';

// Only these 6 failed due to invalid handle - the rest already exist in Medusa
const SKUS_TO_RETRY = ['BERGAMO', 'CUA60DXJ15GRIS', 'HEX26CPXJ11MARRCL', 'HEX26CPXJ05NGSM', 'TRTUMBLK01', 'TRSAMBLK01'];

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

function fixHandle(sku) {
  // Use SKU as handle - guaranteed URL-safe and unique
  return sku.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

async function main() {
  const token = await getToken();
  const todos = JSON.parse(fs.readFileSync(path.join(__dirname, 'productos.json'), 'utf-8'));
  const productos = todos.filter(p => SKUS_TO_RETRY.includes(p.sku));
  console.log(`📦 Productos a reimportar: ${productos.length}`);

  let exitosos = 0, fallidos = 0;

  for (let i = 0; i < productos.length; i++) {
    const p = productos[i];
    const handleFijo = fixHandle(p.sku);
    const body = {
      title: p.titulo,
      handle: handleFijo,
      status: 'draft',
      description: p.descripcion || '',
      options: [{ title: 'Tipo', values: ['Default'] }],
      variants: [{
        title: 'Default',
        sku: p.sku,
        options: { Tipo: 'Default' },
        prices: p.precio > 0 ? [{ amount: Math.round(p.precio * 100), currency_code: 'usd' }] : []
      }],
      images: p.imagenes.map(url => ({ url }))
    };

    try {
      const res = await apiRequest('POST', '/admin/products', body, token);
      if (res.status === 200 || res.status === 201) {
        exitosos++;
        console.log(`✅ [${i+1}/${productos.length}] ${p.sku} - handle: ${handleFijo}`);
      } else {
        fallidos++;
        console.log(`❌ [${i+1}/${productos.length}] ${p.sku}: ${JSON.stringify(res.data?.message || res.data)}`);
      }
    } catch (e) {
      fallidos++;
      console.log(`❌ [${i+1}/${productos.length}] ${p.sku}: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n🏁 Resultado: ${exitosos} exitosos, ${fallidos} fallidos`);
  if (fallidos === 0) {
    console.log('✅ Todos los productos pendientes fueron importados correctamente.');
  }
}

main().catch(console.error);
