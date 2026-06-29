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

async function getProductosProfit() {
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
  const descIdx = headerRow.findIndex(h => h === 'DESCRIPCION' || h === 'DESCRIP' || h === 'DESC');

  const productos = [];
  sheet.eachRow((row, rowNum) => {
    if (rowNum <= headerIdx) return;
    const codigo = String(row.values[codigoIdx] || '').trim().toUpperCase();
    const modelo = String(row.values[modeloIdx] || '').trim().toUpperCase();
    const desc = descIdx > 0 ? String(row.values[descIdx] || '').trim() : '';
    if (codigo && modelo) productos.push({ codigo, modelo, desc });
  });
  return productos;
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

  console.log('\n📦 Obteniendo productos de Medusa...');
  const medusaProducts = await getAllMedusaProducts(token);
  console.log(`✅ ${medusaProducts.length} productos en Medusa`);

  // Analyze status and prices
  let published = 0, draft = 0, noPrice = 0, noVariants = 0;
  const skuMap = new Map(); // sku -> product info

  for (const p of medusaProducts) {
    if (p.status === 'published') published++;
    else draft++;

    const variants = p.variants || [];
    if (variants.length === 0) noVariants++;

    let hasPrice = false;
    for (const v of variants) {
      if (v.sku) {
        const info = {
          id: p.id,
          title: p.title,
          status: p.status,
          hasPrice: false,
          variantId: v.id,
        };
        // Check prices
        if (v.prices && v.prices.length > 0) {
          hasPrice = true;
          info.hasPrice = true;
        }
        skuMap.set(v.sku.trim().toUpperCase(), info);
      }
    }
    if (!hasPrice && variants.length > 0) noPrice++;
  }

  console.log(`\n📊 Estado en Medusa:`);
  console.log(`   Publicados: ${published}`);
  console.log(`   Borradores: ${draft}`);
  console.log(`   Sin variantes: ${noVariants}`);
  console.log(`   Sin precios: ${noPrice}`);

  // Cross-reference with Profit
  console.log('\n📋 Leyendo productos de Profit...');
  const profitProductos = await getProductosProfit();
  console.log(`✅ ${profitProductos.length} productos en Profit`);

  // Check which Profit products are missing from Medusa
  const faltantes = [];
  const enMedusa = [];
  const enMedusaDraft = [];
  const enMedusaSinPrecio = [];

  for (const pp of profitProductos) {
    const info = skuMap.get(pp.modelo);
    if (!info) {
      faltantes.push(pp);
    } else if (info.status !== 'published') {
      enMedusaDraft.push({ ...pp, medusaId: info.id, medusaTitle: info.title });
    } else if (!info.hasPrice) {
      enMedusaSinPrecio.push({ ...pp, medusaId: info.id, medusaTitle: info.title });
    } else {
      enMedusa.push(pp);
    }
  }

  console.log(`\n🔍 Resultados:`);
  console.log(`   ✅ En Medusa publicados con precio: ${enMedusa.length}`);
  console.log(`   📝 En Medusa como BORRADOR (draft): ${enMedusaDraft.length}`);
  console.log(`   💰 En Medusa pero SIN PRECIO: ${enMedusaSinPrecio.length}`);
  console.log(`   ❌ NO están en Medusa: ${faltantes.length}`);

  // Save detailed report
  const wb = new ExcelJS.Workbook();

  if (faltantes.length > 0) {
    const ws1 = wb.addWorksheet('Faltantes en Medusa');
    ws1.addRow(['CODIGO', 'MODELO', 'DESCRIPCION']);
    ws1.getRow(1).font = { bold: true };
    for (const p of faltantes) ws1.addRow([p.codigo, p.modelo, p.desc]);
    console.log(`\n❌ Primeros 20 faltantes en Medusa:`);
    faltantes.slice(0, 20).forEach(p => console.log(`   ${p.codigo} → ${p.modelo} | ${p.desc.substring(0, 50)}`));
  }

  if (enMedusaDraft.length > 0) {
    const ws2 = wb.addWorksheet('Borradores');
    ws2.addRow(['CODIGO', 'MODELO', 'DESCRIPCION', 'Medusa ID', 'Medusa Título']);
    ws2.getRow(1).font = { bold: true };
    for (const p of enMedusaDraft) ws2.addRow([p.codigo, p.modelo, p.desc, p.medusaId, p.medusaTitle]);
    console.log(`\n📝 Primeros 20 en borrador:`);
    enMedusaDraft.slice(0, 20).forEach(p => console.log(`   ${p.modelo} | ${p.medusaTitle?.substring(0, 50)}`));
  }

  if (enMedusaSinPrecio.length > 0) {
    const ws3 = wb.addWorksheet('Sin Precio');
    ws3.addRow(['CODIGO', 'MODELO', 'DESCRIPCION', 'Medusa ID', 'Medusa Título']);
    ws3.getRow(1).font = { bold: true };
    for (const p of enMedusaSinPrecio) ws3.addRow([p.codigo, p.modelo, p.desc, p.medusaId, p.medusaTitle]);
    console.log(`\n💰 Primeros 20 sin precio:`);
    enMedusaSinPrecio.slice(0, 20).forEach(p => console.log(`   ${p.modelo} | ${p.medusaTitle?.substring(0, 50)}`));
  }

  const outFile = path.join(__dirname, 'diagnostico_faltantes.xlsx');
  await wb.xlsx.writeFile(outFile);
  console.log(`\n📄 Reporte guardado en: diagnostico_faltantes.xlsx`);
  console.log('   - Hoja 1: Faltantes en Medusa (nunca importados)');
  console.log('   - Hoja 2: En Medusa como borrador (no visibles en web)');
  console.log('   - Hoja 3: En Medusa sin precio (no visibles en web)');
}

main().catch(console.error);
