const https = require('https');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';
const PROFIT_FILE = path.join(__dirname, 'Profit 290626.xlsx');

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

async function buildCodigoToModelo() {
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
    if (codigo && modelo) map[codigo] = modelo;
  });
  console.log(`📋 Mapa CODIGO→MODELO: ${Object.keys(map).length} entradas`);
  return map;
}

async function main() {
  const token = await getToken();
  const codigoToModelo = await buildCodigoToModelo();

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
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`✅ ${allProducts.length} productos obtenidos`);

  // Build set of all current SKUs in Medusa
  const allSkus = new Set();
  for (const p of allProducts) {
    for (const v of (p.variants || [])) {
      if (v.sku) allSkus.add(v.sku.trim().toUpperCase());
    }
  }

  // Find products to delete: those whose SKU is an internal CODIGO
  // AND whose corresponding MODELO already exists in Medusa
  const toDelete = [];
  for (const p of allProducts) {
    for (const v of (p.variants || [])) {
      const sku = (v.sku || '').trim().toUpperCase();
      const modeloCorrecto = codigoToModelo[sku];
      if (modeloCorrecto && modeloCorrecto !== sku && allSkus.has(modeloCorrecto)) {
        toDelete.push({ id: p.id, title: p.title, codigoSku: sku, modeloSku: modeloCorrecto });
      }
    }
  }

  console.log(`\n🗑️  Productos duplicados a eliminar: ${toDelete.length}`);
  for (const p of toDelete) {
    console.log(`  - ${p.title.substring(0, 50)} | SKU actual: ${p.codigoSku} | Modelo correcto ya existe: ${p.modeloSku}`);
  }

  if (toDelete.length === 0) {
    console.log('✅ No hay duplicados que eliminar.');
    return;
  }

  console.log('\n🚀 Eliminando duplicados...');
  let eliminados = 0, fallidos = 0;
  const log = [];

  for (const p of toDelete) {
    const res = await apiRequest('DELETE', `/admin/products/${p.id}`, null, token);
    if (res.status === 200 || res.status === 204) {
      eliminados++;
      const msg = `✅ Eliminado: ${p.title.substring(0, 50)} (${p.codigoSku})`;
      console.log(msg);
      log.push(msg);
    } else {
      fallidos++;
      const msg = `❌ Error eliminando ${p.codigoSku}: ${JSON.stringify(res.data?.message || res.data).substring(0, 100)}`;
      console.log(msg);
      log.push(msg);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n🏁 Resultado: ${eliminados} eliminados, ${fallidos} fallidos`);
  fs.writeFileSync(path.join(__dirname, 'log_eliminacion_duplicados.txt'), log.join('\n'));
  console.log('📄 Log guardado en log_eliminacion_duplicados.txt');
}

main().catch(console.error);
