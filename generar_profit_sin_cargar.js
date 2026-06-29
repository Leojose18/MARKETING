const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const PROFIT_FILE = path.join(__dirname, 'Profit 290626.xlsx');
const MEDUSA_SKUS_FILE = path.join(__dirname, 'medusa_skus.json');
const OUTPUT_FILE = path.join(__dirname, 'profit_sin_cargar_v2.xlsx');

function getLinea(codigo) {
  if (!codigo) return 'OTROS';
  const c = String(codigo).trim().toUpperCase();
  const prefixes = ['BODG', 'BLA', 'COC', 'HOG', 'SON', 'VID', 'TEL', 'COM', 'LEN', 'FER', 'CAR', 'MUE', 'NAC', 'EM'];
  for (const p of prefixes) {
    if (c.startsWith(p)) return p;
  }
  return 'OTROS';
}

async function main() {
  if (!fs.existsSync(MEDUSA_SKUS_FILE)) {
    console.error('❌ No se encontró medusa_skus.json. Ejecuta primero: node exportar_skus_medusa.js');
    process.exit(1);
  }

  const medusaSkus = new Set(
    JSON.parse(fs.readFileSync(MEDUSA_SKUS_FILE, 'utf-8')).map(s => s.trim().toUpperCase())
  );
  console.log(`✅ SKUs en Medusa: ${medusaSkus.size}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(PROFIT_FILE);

  let profitSheet = null;
  workbook.eachSheet(sheet => {
    if (sheet.name.toLowerCase().includes('profit') || sheet.name === 'Hoja1' || sheet.name === 'Sheet1') {
      if (!profitSheet) profitSheet = sheet;
    }
  });
  if (!profitSheet) profitSheet = workbook.worksheets[0];
  console.log(`📄 Leyendo hoja: ${profitSheet.name}`);

  let headerRow = null;
  let headerIdx = 0;
  profitSheet.eachRow((row, rowNum) => {
    if (headerRow) return;
    const vals = Array.from(row.values, v => String(v || '').trim().toUpperCase());
    if (vals.includes('CODIGO') || vals.includes('DESCRIPCION')) {
      headerRow = vals;
      headerIdx = rowNum;
    }
  });

  if (!headerRow) {
    console.error('❌ No se encontró fila de encabezados');
    process.exit(1);
  }

  const codigoIdx = headerRow.findIndex(h => h && h === 'CODIGO');
  const descIdx = headerRow.findIndex(h => h && (h === 'DESCRIPCION' || h.includes('DESCRI')));
  const modeloIdx = headerRow.findIndex(h => h && h === 'MODELO');
  const stockIdx = headerRow.findIndex(h => h && h.includes('STOCK'));
  const costoIdx = headerRow.findIndex(h => h && h.includes('COSTO'));
  const unidadIdx = headerRow.findIndex(h => h && h === 'UNIDAD');

  console.log(`📋 Columnas: CODIGO=${codigoIdx}, DESCRIPCION=${descIdx}, MODELO=${modeloIdx}, STOCK=${stockIdx}, COSTO=${costoIdx}, UNIDAD=${unidadIdx}`);

  const byLinea = {};
  let totalProfit = 0, totalSinCargar = 0, yaEnMedusa = 0;

  profitSheet.eachRow((row, rowNum) => {
    if (rowNum <= headerIdx) return;
    const vals = row.values;
    const codigo = String(vals[codigoIdx] || '').trim();
    if (!codigo || codigo.toUpperCase() === 'CODIGO') return;

    const modelo = String(vals[modeloIdx] || '').trim().toUpperCase();
    totalProfit++;

    if (medusaSkus.has(modelo)) {
      yaEnMedusa++;
      return;
    }

    const linea = getLinea(codigo);
    if (!byLinea[linea]) byLinea[linea] = [];
    byLinea[linea].push({
      codigo,
      descripcion: String(vals[descIdx] || '').trim(),
      modelo,
      stock: vals[stockIdx] ?? '',
      costo: vals[costoIdx] ?? '',
      unidad: String(vals[unidadIdx] || '').trim(),
    });
    totalSinCargar++;
  });

  console.log(`\n📊 Total en Profit: ${totalProfit}`);
  console.log(`✅ Ya en Medusa: ${yaEnMedusa}`);
  console.log(`📦 Sin cargar: ${totalSinCargar}`);

  const outWb = new ExcelJS.Workbook();
  const lineasOrder = ['BLA', 'COC', 'HOG', 'SON', 'VID', 'TEL', 'COM', 'LEN', 'FER', 'BODG', 'CAR', 'MUE', 'NAC', 'EM', 'OTROS'];
  const headers = ['CODIGO', 'DESCRIPCION', 'MODELO', 'STOCK ACTUAL', 'COSTO02', 'UNIDAD'];

  for (const linea of lineasOrder) {
    const rows = byLinea[linea];
    if (!rows || rows.length === 0) continue;

    const ws = outWb.addWorksheet(linea);
    ws.addRow(headers);
    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    for (const r of rows) {
      ws.addRow([r.codigo, r.descripcion, r.modelo, r.stock, r.costo, r.unidad]);
    }

    ws.columns.forEach(col => {
      let max = 10;
      col.eachCell(cell => { if (cell.value) max = Math.max(max, String(cell.value).length); });
      col.width = Math.min(max + 2, 60);
    });

    console.log(`  ${linea}: ${rows.length} productos sin cargar`);
  }

  await outWb.xlsx.writeFile(OUTPUT_FILE);
  console.log(`\n✅ Excel generado: ${OUTPUT_FILE}`);
}

main().catch(console.error);
