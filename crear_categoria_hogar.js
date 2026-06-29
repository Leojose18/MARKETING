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

  const res = await apiRequest('POST', '/admin/product-categories', {
    name: 'Línea Hogar',
    description: 'Pequeños electrodomésticos del hogar',
    handle: 'linea-hogar',
    is_active: true,
    is_internal: false,
    metadata: { icon: 'blender' },
  }, token);

  if (res.status === 200 || res.status === 201) {
    const cat = res.data.product_category;
    console.log('\n✅ Categoría creada exitosamente:');
    console.log(`   ID:     ${cat.id}`);
    console.log(`   Nombre: ${cat.name}`);
    console.log(`   Handle: ${cat.handle}`);
    console.log('\n📋 Copia este ID y pégaselo a Claude:');
    console.log(`   ${cat.id}`);
  } else {
    console.error('❌ Error al crear categoría:', JSON.stringify(res.data, null, 2));
  }
}

main().catch(console.error);
