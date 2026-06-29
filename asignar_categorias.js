const https = require('https');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';
const PROFIT_FILE = path.join(__dirname, 'Profit 290626.xlsx');

// Medusa category IDs
const LINEA_CAT = {
  'COC': 'pcat_01KTM54XAJS591RN0YTXZ3NR9R',   // Cocinas
  'HOG': 'pcat_01KTM5223MHKC9HV1S44A9J0D8',   // Bodegon (hogar)
  'LEN': 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q',   // Hogar y Decoracion
  'MUE': 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q',   // Hogar y Decoracion
  'VID': 'pcat_01KTM4QWEKKFNMZVG2Q2WC13WR',   // Video
  'COM': 'pcat_01KTM4ZBPZGFWAGFQPX5P4D081',   // Tecnologia
  'EM':  'pcat_01KTM4ZBPZGFWAGFQPX5P4D081',   // Tecnologia
  'TEL': 'pcat_01KTM4WJ2MT7111TKM33Q4WJYR',   // Telefonia
  'FER': 'pcat_01KTWC3P75T9BAWQ7A2XHH0TVH',   // Ferreteria
  'SON': 'pcat_01KTM3K9R5GKPYAETKDXDA8KM9',   // Audio
  'CAR': 'pcat_01KTM3K9R5GKPYAETKDXDA8KM9',   // Audio
  'BODG': 'pcat_01KTM5223MHKC9HV1S44A9J0D8',  // Bodegon
  'NAC': 'pcat_01KTM4ZBPZGFWAGFQPX5P4D081',   // Tecnologia
};

function getCatForBLA(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes('aire acondicionado') || t.includes('cortina de aire') || t.includes('minisplit')) return 'pcat_01KSGCP46MDW0BS48P8W9CTB38';
  if (t.includes('lavadora') || t.includes('lavasecadora') || t.includes('lava y seca')) return 'pcat_01KTM3B4GGHZGDCT2T2HPKV9ZD';
  if (t.includes('nevera') || t.includes('refrigerador') || t.includes('refrigeradora')) return 'pcat_01KTM3C4CDA4REA4AA36AY9PAK';
  if (t.includes('congelador') || t.includes('freezer') || t.includes('vinera')) return 'pcat_01KTM3D1AR8CYMBPF6AKJ01H1S3';
  return 'pcat_01KREC246BG0GF8298F3GG0VDY'; // Linea blanca general
}

function getCatByTitle(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes('aire acondicionado') || t.includes('cortina de aire')) return 'pcat_01KSGCP46MDW0BS48P8W9CTB38';
  if (t.includes('congelador') || t.includes('freezer')) return 'pcat_01KTM3D1AR8CYMBPF6AKJ01H1S3';
  if (t.includes('nevera') || t.includes('refrigerador')) return 'pcat_01KTM3C4CDA4REA4AA36AY9PAK';
  if (t.includes('lavadora')) return 'pcat_01KTM3B4GGHZGDCT2T2HPKV9ZD';
  if (t.includes('tv ') || t.includes(' tv') || t.includes('smart tv') || t.includes('televisor')) return 'pcat_01KTM4QWEKKFNMZVG2Q2WC13WR';
  if (t.includes('bocina') || t.includes('parlante') || t.includes('speaker') || t.includes('radio') || t.includes('teatro')) return 'pcat_01KTM3K9R5GKPYAETKDXDA8KM9';
  if (t.includes('celular') || t.includes('smartphone') || t.includes('telefono')) return 'pcat_01KTM4WJ2MT7111TKM33Q4WJYR';
  if (t.includes('router') || t.includes('camara') || t.includes('laptop') || t.includes('computadora') || t.includes('interruptor')) return 'pcat_01KTM4ZBPZGFWAGFQPX5P4D081';
  if (t.includes('cocina') || t.includes('tope') || t.includes('fregadero') || t.includes('campana') || t.includes('horno') || t.includes('microondas')) return 'pcat_01KTM54XAJS591RN0YTXZ3NR9R';
  if (t.includes('freidora') || t.includes('licuadora') || t.includes('batidora') || t.includes('cafetera') || t.includes('sandwichera') || t.includes('procesador') || t.includes('extractor') || t.includes('plancha') || t.includes('aspiradora') || t.includes('ventilador')) return 'pcat_01KTM5223MHKC9HV1S44A9J0D8';
  if (t.includes('alfombra') || t.includes('cojin') || t.includes('almohada') || t.includes('cortina') || t.includes('adorno') || t.includes('mueble') || t.includes('silla') || t.includes('mesa') || t.includes('sillon') || t.includes('sofa')) return 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q';
  if (t.includes('martillo') || t.includes('destornillador') || t.includes('alicate') || t.includes('sierra') || t.includes('taladro') || t.includes('herramienta')) return 'pcat_01KTWC3P75T9BAWQ7A2XHH0TVH';
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
  const res = await apiRequest('POST', '/auth/user/emailpass', { email: EMAIL, password: PASSWORD });
  if (res.data?.token) { console.log('✅ Login exitoso'); return res.data.token; }
  throw new Error('Login fallido: ' + JSON.stringify(res.data));
}

function getLinea(codigo) {
  const c = String(codigo).trim().toUpperCase();
  const prefixes = ['BODG', 'BLA', 'COC', 'HOG', 'SON', 'VID', 'TEL', 'COM', 'LEN', 'FER', 'CAR', 'MUE', 'NAC', 'EM'];
  for (const p of prefixes) { if (c.startsWith(p)) return p; }
  return null;
}

async function buildModeloToLinea() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(PROFIT_FILE);
  let sheet = null;
  workbook.eachSheet(s => { if (!sheet) sheet = s; });

  let headerRow = null, headerIdx = 0;
  sheet.eachRow((row, rowNum) => {
    if (headerRow) return;
    const vals = Array.from(row.values, v => String(v || '').trim().toUpperCase());
    if (vals.includes('CODIGO') && vals.includes('MODELO')) { headerRow = vals; headerIdx = rowNum; }
  });

  const codigoIdx = headerRow.findIndex(h => h === 'CODIGO');
  const modeloIdx = headerRow.findIndex(h => h === 'MODELO');

  const map = {};
  sheet.eachRow((row, rowNum) => {
    if (rowNum <= headerIdx) return;
    const codigo = String(row.values[codigoIdx] || '').trim().toUpperCase();
    const modelo = String(row.values[modeloIdx] || '').trim().toUpperCase();
    const linea = getLinea(codigo);
    if (modelo && linea) map[modelo] = linea;
  });

  console.log(`📋 Mapa MODELO→LINEA: ${Object.keys(map).length} entradas`);
  return map;
}

async function main() {
  const token = await getToken();
  const modeloToLinea = await buildModeloToLinea();

  // Fetch all products
  let allProducts = [];
  let offset = 0;
  const limit = 50;
  let total = null;
  console.log('\n📦 Obteniendo productos de Medusa...');
  while (true) {
    const res = await apiRequest('GET', `/admin/products?limit=${limit}&offset=${offset}`, null, token);
    if (res.status !== 200) { console.error('Error:', res.status); break; }
    const products = res.data.products || [];
    if (total === null) total = res.data.count;
    allProducts = allProducts.concat(products);
    offset += products.length;
    if (products.length < limit || offset >= total) break;
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`✅ ${allProducts.length} productos obtenidos\n`);

  let ok = 0, fallidos = 0, sinCategoria = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    const sku = (p.variants?.[0]?.sku || '').trim().toUpperCase();
    const linea = modeloToLinea[sku];

    let catId = null;
    if (linea === 'BLA') {
      catId = getCatForBLA(p.title);
    } else if (linea && LINEA_CAT[linea]) {
      catId = LINEA_CAT[linea];
    } else {
      catId = getCatByTitle(p.title);
    }

    if (!catId) {
      sinCategoria++;
      console.log(`⚠️  Sin categoria: [${sku}] ${p.title.substring(0, 50)}`);
      continue;
    }

    const res = await apiRequest('PATCH', `/admin/products/${p.id}`, { categories: [{ id: catId }] }, token);
    if (res.status === 200 || res.status === 201) {
      ok++;
      if (ok % 20 === 0) console.log(`  Progreso: ${ok} asignados...`);
    } else {
      fallidos++;
      console.log(`❌ [${i+1}] ${sku}: ${JSON.stringify(res.data?.message || res.data).substring(0, 80)}`);
    }

    await new Promise(r => setTimeout(r, 250));
  }

  console.log(`\n🏁 Resultado: ${ok} asignados, ${sinCategoria} sin categoria, ${fallidos} errores`);
}

main().catch(console.error);
