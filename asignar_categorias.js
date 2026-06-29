const https = require('https');
const fs = require('fs');
const path = require('path');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';

const CATEGORIAS = [
  { id: 'pcat_01KREC246BG0GF8298F3GG0VDY', nombre: 'Línea blanca' },
  { id: 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q', nombre: 'Hogar y Decoración' },
  { id: 'pcat_01KSGCP46MDW0BS48P8W9CTB38', nombre: 'Aires Acondicionados' },
  { id: 'pcat_01KTM3B4GGHZGDCT2T2HPKV9ZD', nombre: 'Lavadoras' },
  { id: 'pcat_01KTM3C4CDA4REA4AA36AY9PAK', nombre: 'Neveras' },
  { id: 'pcat_01KTM3D1AR8CYMBPF6AKJ01H1S3', nombre: 'Congeladores' },
  { id: 'pcat_01KTM3GX8D8HBRVRM82ZEMJD6C', nombre: 'Audio' },
  { id: 'pcat_01KTM3K9R5GKPYAETKDXDA8KM9', nombre: 'Bocinas' },
  { id: 'pcat_01KTM3M6VWQET407BA9HYDN5D6', nombre: 'Equipos de Sonido' },
  { id: 'pcat_01KTM3N6NX3YCHWEQMGTGBNA5P', nombre: 'Teatro en Casa' },
  { id: 'pcat_01KTM4QWEKKFNMZVG2Q2WC13WR', nombre: 'Video' },
  { id: 'pcat_01KTM4WJ2MT7111TKM33Q4WJYR', nombre: 'Telefonía' },
  { id: 'pcat_01KTM4ZBPZGFWAGFQPX5P4D081', nombre: 'Tecnología' },
  { id: 'pcat_01KTM5223MHKC9HV1S44A9J0D8', nombre: 'Bodegón' },
  { id: 'pcat_01KTM54XAJS591RN0YTXZ3NR9R', nombre: 'Cocinas' },
  { id: 'pcat_01KTWC3P75T9BAWQ7A2XHH0TVH', nombre: 'Ferretería' }
];

function getCategoryId(titulo) {
  const t = titulo.toLowerCase();

  if (t.includes('aire acondicionado') || t.includes('minisplit') || t.includes('cortina de aire')) {
    return 'pcat_01KSGCP46MDW0BS48P8W9CTB38';
  }
  if (t.includes('freidora') || t.includes('air fryer') || t.includes('horno') || t.includes('microondas') ||
      t.includes('vitroceramica') || t.includes('vitrocerámica') || t.includes('tope de cocina') ||
      t.includes('fregadero') || t.includes('lavaplatos') || t.includes('cocina de piso') ||
      t.includes('campana') || t.includes('gasco')) {
    return 'pcat_01KTM54XAJS591RN0YTXZ3NR9R';
  }
  if (t.includes('licuadora') || t.includes('batidora') || t.includes('tostadora') || t.includes('cafetera') ||
      t.includes('exprimidor') || t.includes('sandwichera') || t.includes('waflera') ||
      t.includes('hervidor') || t.includes('procesador') || t.includes('extractor')) {
    return 'pcat_01KTM5223MHKC9HV1S44A9J0D8';
  }
  if (t.includes('congelador') || t.includes('freezer')) {
    return 'pcat_01KTM3D1AR8CYMBPF6AKJ01H1S3';
  }
  if (t.includes('refrigerador') || t.includes('nevera') || t.includes('refrigeradora')) {
    return 'pcat_01KTM3C4CDA4REA4AA36AY9PAK';
  }
  if (t.includes('lavadora') || t.includes('lavasecadora') || t.includes('lava y seca')) {
    return 'pcat_01KTM3B4GGHZGDCT2T2HPKV9ZD';
  }
  if (t.includes('tv ') || t.includes(' tv') || t.includes('televisor') || t.includes('televisión') ||
      t.includes('television') || t.includes('smart tv') || t.includes('led ') || t.includes('cled') ||
      t.includes('uhd') || t.includes('pantalla')) {
    return 'pcat_01KTM4QWEKKFNMZVG2Q2WC13WR';
  }
  if (t.includes('home theater') || t.includes('teatro en casa') || t.includes('soundbar') ||
      t.includes('barra de sonido') || t.includes('proyector')) {
    return 'pcat_01KTM3N6NX3YCHWEQMGTGBNA5P';
  }
  if (t.includes('bocina') || t.includes('parlante') || t.includes('speaker') || t.includes('altavoz') || t.includes('subwoofer')) {
    return 'pcat_01KTM3K9R5GKPYAETKDXDA8KM9';
  }
  if (t.includes('equipo de sonido') || t.includes('minicomponente') || t.includes('componente')) {
    return 'pcat_01KTM3M6VWQET407BA9HYDN5D6';
  }
  if (t.includes('audifonos') || t.includes('audífonos') || t.includes('auricular') ||
      t.includes('headphone') || t.includes('radio') || t.includes('reproductor')) {
    return 'pcat_01KTM3GX8D8HBRVRM82ZEMJD6C';
  }
  if (t.includes('telefono') || t.includes('teléfono') || t.includes('celular') ||
      t.includes('smartphone') || t.includes('tablet')) {
    return 'pcat_01KTM4WJ2MT7111TKM33Q4WJYR';
  }
  if (t.includes('laptop') || t.includes('computadora') || t.includes('impresora') ||
      t.includes('camara') || t.includes('cámara') || t.includes('smartwatch')) {
    return 'pcat_01KTM4ZBPZGFWAGFQPX5P4D081';
  }
  if (t.includes('panel ac') || t.includes('maleta') || t.includes('travel') || t.includes('alfombra')) {
    return 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q';
  }
  return null;
}

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

async function getAllProducts(token) {
  let products = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const res = await apiRequest('GET', `/admin/products?limit=${limit}&offset=${offset}`, null, token);
    const batch = res.data.products || [];
    products = products.concat(batch);
    console.log(`  Obtenidos ${products.length} productos...`);
    if (batch.length < limit) break;
    offset += limit;
  }
  return products;
}

async function main() {
  const token = await getToken();
  console.log('📦 Obteniendo todos los productos de Medusa...');
  const products = await getAllProducts(token);
  console.log(`✅ Total productos: ${products.length}`);

  let asignados = 0, sinCategoria = 0, errores = 0;
  const sinCategoriaList = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const catId = getCategoryId(p.title);

    if (!catId) {
      sinCategoria++;
      sinCategoriaList.push({ titulo: p.title, sku: p.variants?.[0]?.sku || '' });
      console.log(`⚠️  [${i+1}/${products.length}] SIN CATEGORÍA: ${p.title}`);
      continue;
    }

    const res = await apiRequest('POST', `/admin/products/${p.id}/categories`, { add: [catId] }, token);
    if (res.status === 200 || res.status === 201) {
      asignados++;
      const cat = CATEGORIAS.find(c => c.id === catId);
      console.log(`✅ [${i+1}/${products.length}] ${p.title.substring(0, 50)} → ${cat?.nombre}`);
    } else {
      errores++;
      console.log(`❌ [${i+1}/${products.length}] ${p.title}: ${JSON.stringify(res.data?.message || res.data)}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n🏁 Resultado: ${asignados} asignados, ${sinCategoria} sin categoría, ${errores} errores`);

  if (sinCategoriaList.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'sin_categoria.json'), JSON.stringify(sinCategoriaList, null, 2));
    console.log(`⚠️  Productos sin categoría guardados en sin_categoria.json`);
  }
}

main().catch(console.error);
