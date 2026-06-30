const https = require('https');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';
const ID_VIEJO = 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q';

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
  const token = loginRes.data.token;
  console.log('✅ Login OK\n');

  // Paso 1: Eliminar la categoría dañada
  console.log(`🗑️  Eliminando categoría dañada ${ID_VIEJO}...`);
  const del = await apiRequest('DELETE', `/admin/product-categories/${ID_VIEJO}`, null, token);
  console.log(`   Status: ${del.status} | ${JSON.stringify(del.data).substring(0, 100)}`);

  // Paso 2: Crear categoría nueva
  console.log('\n➕ Creando nueva categoría "Hogar y Decoración"...');
  const create = await apiRequest('POST', '/admin/product-categories', {
    name: 'Hogar y Decoración',
    description: 'Muebles, textiles, decoración y organización del hogar',
    handle: 'hogar-y-decoracion',
    is_active: true,
    is_internal: false,
  }, token);

  if (create.status !== 200 && create.status !== 201) {
    console.error('❌ Error creando:', JSON.stringify(create.data));
    return;
  }

  const cat = create.data.product_category;
  console.log(`✅ Nueva categoría creada:`);
  console.log(`   ID:     ${cat.id}`);
  console.log(`   Nombre: ${cat.name}`);
  console.log(`   Handle: ${cat.handle}`);

  // Paso 3: Probar asignación con producto QDF109
  console.log('\n🧪 Probando asignación con QDF109...');
  const search = await apiRequest('GET', `/admin/products?q=QDF109&limit=5`, null, token);
  const p = (search.data.products || [])[0];
  if (p) {
    const assign = await apiRequest('POST', `/admin/products/${p.id}`, { categories: [{ id: cat.id }] }, token);
    if (assign.status === 200 || assign.status === 201) {
      console.log(`✅ Asignación exitosa!`);
    } else {
      console.log(`❌ Asignación falló: ${JSON.stringify(assign.data?.message || assign.data).substring(0, 200)}`);
    }
  }

  console.log(`\n📋 NUEVO ID para asignar_categorias.js:`);
  console.log(`   '${cat.id}'`);
  console.log('\nCopia ese ID — lo necesitamos para actualizar el script.');
}

main().catch(console.error);
