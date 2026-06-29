const https = require('https');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';

// Probar asignar categoria a un producto QDF (uno de los que fallaron)
const TEST_SKU = 'QDF109'; // producto del error
const CAT_HOGAR_DEC = 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q';

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
  if (res.data?.token) return res.data.token;
  throw new Error('Login fallido');
}

async function main() {
  const token = await getToken();
  console.log('✅ Login OK\n');

  // Buscar el producto con SKU QDF109
  const search = await apiRequest('GET', `/admin/products?q=QDF109&limit=5`, null, token);
  const products = search.data.products || [];
  if (products.length === 0) {
    console.log('❌ No se encontró producto con SKU QDF109');
    return;
  }
  const p = products[0];
  console.log(`Producto encontrado: ${p.id} | ${p.title}`);
  console.log(`SKU: ${p.variants?.[0]?.sku}`);
  console.log(`Status: ${p.status}`);
  console.log(`Categorías actuales: ${JSON.stringify(p.categories)}\n`);

  // Intentar formato 1: categories array de objetos
  console.log('--- Prueba 1: { categories: [{ id }] } ---');
  const r1 = await apiRequest('POST', `/admin/products/${p.id}`, { categories: [{ id: CAT_HOGAR_DEC }] }, token);
  console.log(`Status: ${r1.status}`);
  console.log(`Respuesta: ${JSON.stringify(r1.data?.message || r1.data?.categories || r1.data).substring(0, 300)}\n`);

  // Intentar formato 2: category_ids array de strings
  console.log('--- Prueba 2: { category_ids: [id] } ---');
  const r2 = await apiRequest('POST', `/admin/products/${p.id}`, { category_ids: [CAT_HOGAR_DEC] }, token);
  console.log(`Status: ${r2.status}`);
  console.log(`Respuesta: ${JSON.stringify(r2.data?.message || r2.data?.categories || r2.data).substring(0, 300)}\n`);
}

main().catch(console.error);
