const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const PROFIT_FILE = path.join(__dirname, 'Profit 290626.xlsx');
const MEDUSA_SKUS_FILE = path.join(__dirname, 'medusa_skus.json');
const SKU_BUSCAR = 'EK60R410A1';

async function main() {
  const medusaSkus = JSON.parse(fs.readFileSync(MEDUSA_SKUS_FILE, 'utf-8'));

  // Search in Medusa SKUs (exact and partial)
  const exacto = medusaSkus.find(s => s.toUpperCase() === SKU_BUSCAR.toUpperCase());
  const parcial = medusaSkus.filter(s => s.toUpperCase().includes(SKU_BUSCAR.toUpperCase().substring(0, 6)));

  console.log(`\n=== BUSQUEDA EN MEDUSA ===`);
  console.log(`Exacto: ${exacto || 'NO ENCONTRADO'}`);
  console.log(`Parecidos: ${parcial.join(', ') || 'ninguno'}`);

  // Search in Profit file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(PROFIT_FILE);
  const sheet = workbook.worksheets[0];

  let headerRow = null, headerIdx = 0, modeloIdx = -1;
  sheet.eachRow((row, rowNum) => {
    if (headerRow) return;
    const vals = Array.from(row.values, v => String(v || '').trim().toUpperCase());
    if (vals.includes('MODELO')) { headerRow = vals; headerIdx = rowNum; modeloIdx = vals.findIndex(h => h === 'MODELO'); }
  });

  console.log(`\n=== BUSQUEDA EN PROFIT (columna MODELO=${modeloIdx}) ===`);
  sheet.eachRow((row, rowNum) => {
    if (rowNum <= headerIdx) return;
    const modelo = String(row.values[modeloIdx] || '').trim();
    if (modelo.toUpperCase().includes(SKU_BUSCAR.toUpperCase().substring(0, 6))) {
      console.log(`Fila ${rowNum}: [${modelo}] (largo=${modelo.length}, chars: ${[...modelo].map(c => c.charCodeAt(0)).join(',')})`);
    }
  });
}

main().catch(console.error);
