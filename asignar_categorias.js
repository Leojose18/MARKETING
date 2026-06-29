const https = require('https');
const fs = require('fs');
const path = require('path');

const API_HOST = 'dash.krash-depot.com';
const EMAIL = 'publicidad@krash-depot.com';
const PASSWORD = 'KrashDepot_*.';

// Mapa SKU → LINEA extraído del archivo Profit
const SKU_LINEA = {"STV002":"UNKNOWN","STV007":"UNKNOWN","SBC004":"LEN","SBC005":"LEN","CLED32SDF6":"UNKNOWN","FRO48011G":"HOG","FRO3088RB":"HOG","MW1069BAF":"HOG","FRW3014BLT":"HOG","FRW2011GY":"HOG","FRW225":"UNKNOWN","FRW3013BT":"HOG","FRW3012GT":"HOG","FRW2011WH":"UNKNOWN","FRW145":"HOG","ENIJBN750":"UNKNOWN","ENIJBE200LAA":"UNKNOWN","MC36412":"CAR","PWS2233":"CAR","MC3568":"CAR","PA12DCT102":"CAR","OSTTSSTTVMAF1NS":"HOG","HMT101ATM":"SON","CLED32SDL7":"VID","JASPES":"COC","TACOMA":"COC","TURIN":"COC","SIENA":"HOG","TERMA":"HOG","DJ2":"COC","GAHMM925BUVBG":"HOG","LUGANOBS":"UNKNOWN","BERGAMO":"COC","GRIVP00ACPDCR":"COC","WAH3024611":"UNKNOWN","VCS15BAT7":"HOG","WAH93142708":"EM","WAH3024612":"EM","HM535S":"HOG","HM750":"HOG","CM618":"HOG","MX900":"HOG","CM0941W":"HOG","CM0701W":"UNKNOWN","KUCF002B":"HOG","CM0916W":"HOG","KUCF003B":"UNKNOWN","LT2010":"HOG","OSTBVSTDCP12B":"HOG","CM1228":"HOG","CM401GR":"HOG","CM1227":"HOG","CM101GR":"HOG","TFV1213":"HOG","KUCC012M":"HOG","KUJB004R":"HOG","JE2500BLA":"HOG","REJ3020":"HOG","XJ8404W":"HOG","XJ161":"HOG","WAH09892008":"UNKNOWN","KMHR014W":"UNKNOWN","XJ126W":"HOG","RAS16BBQ":"HOG","LT2605":"HOG","RAF70L":"HOG","TPCDR1200":"HOG","OLBOGAW9702":"HOG","RMW721BL":"HOG","OLBOGAW9701":"HOG","TP111":"HOG","OLBOGGME2701":"HOG","AWHMG20B01":"HOG","MW759M":"HOG","MW760GR":"HOG","MW773M":"HOG","MW106725":"HOG","RMW721WH":"HOG","MW751W":"HOG","MW1135BL":"HOG","MW751BL":"HOG","BLBD210PV":"HOG","BLBD210PG":"HOG","BLBD202PB":"HOG","KMJB012L":"HOG","BLBD210PR":"HOG","BLBD210PW":"HOG","KMJB012P":"HOG","OSTBLSTKAPWPB":"HOG","BLBD202PW":"HOG","LT945":"HOG","OST4655CUCHILLA":"HOG","RL315":"UNKNOWN","BL777P":"HOG","BL775G":"HOG","BL778":"HOG","BL1274CH":"HOG","BL770PBL":"HOG","BL776R":"HOG","BL1551WG":"HOG","BL1379WG":"HOG","BL711PR":"HOG","BL1378BLG":"HOG","BL710G25":"HOG","BL1552GG":"UNKNOWN","BL1373BLP":"HOG","BL1374WP":"HOG","RMCE500A":"HOG","SA2250":"HOG","MX157G":"UNKNOWN","SA1082":"HOG","MX124G":"HOG","HC300B":"HOG","PV439RE":"HOG","HC150B":"HOG","PV501":"UNKNOWN","KUEC014W":"HOG","SA1550":"HOG","LT9849":"UNKNOWN","SW41":"HOG","SWC137BL":"HOG","OSTTSSTTV7030":"HOG","RS1500PR":"UNKNOWN","RH45":"HOG","RSC6753":"HOG","OT350":"HOG","RH30":"HOG","RH66":"HOG","TO12":"HOG","TO12SM2":"HOG","TO13":"HOG","TO10BL1":"HOG","FRO2509DS":"HOG","FRO38011G":"HOG","OT2810G":"HOG","APS45ORANGE":"UNKNOWN","FRO3209S":"HOG","FN17BAT10":"UNKNOWN","FN12BAT20":"UNKNOWN","NTR1241":"HOG","FN17BAT12":"HOG","FN12BAT14":"HOG","MR20":"COM","EC220":"COM","AC10":"COM","ARCHERC64":"COM","MR80X":"UNKNOWN","HKHLPS2831":"FER","GARAV10110":"BLA","GARAV10220":"BLA","EW811":"BLA","EW576":"BLA","HONOR200-256-8CY":"UNKNOWN","GALAXYA56-128-8AWGR":"UNKNOWN","GALAXYA36-8-128ABLK":"UNKNOWN","X8C-512-8MBLK":"TEL","GALAXYA56-256-12AWGR":"UNKNOWN","GALAXYA36-8-256AWBLK":"UNKNOWN","ENIJAF161":"UNKNOWN","A01GNW30H6500K":"LEN","A01GNW30H4000K":"LEN","CAP1112":"BLA","WM1166PH":"UNKNOWN","WM9077P":"BLA","ARCO":"COC","WM7015GR":"BLA","PATTYTLBL2":"UNKNOWN","PATTYTLGR3":"COC","ANDROS":"COC","ARCOSS":"COC","ONTARIOSA":"COC","LT2314":"UNKNOWN","ESID1000":"COC","OSTBLSTKAGWPB":"HOG","OSTBLSTKAGBPB":"HOG","OSTBLSTKAGWRD":"HOG","OSTBLSTPYG1312":"HOG","OSTBLSTPYG1309B":"HOG","OSTBVSTDCS12BN":"UNKNOWN","RFC580":"BLA","OSTBVSTDC05":"HOG","OSTBVSTDC4403":"UNKNOWN","CAM1115":"UNKNOWN","CAM1112":"BLA","RFC392G":"UNKNOWN","OSTCKSTAF401MDF":"HOG","OSTCKSTAF40M":"HOG","OSTCKSTAF7MCDDF":"HOG","OSTCKSTPA2880":"HOG","OSTCKSTAF60WMDF":"UNKNOWN","OSTFPSTJU4175":"HOG","OSTCKSTAM0513":"UNKNOWN","OSTCKSTRC1700W":"HOG","OSTCKSTRC1700B":"UNKNOWN","CAM1112BL":"BLA","OSTGCSTBS5004":"HOG","OSTGCSTBS5001":"HOG","OSTGCSTBS5002":"HOG","OSTGCSTBS5053":"HOG","OSTBVSTKT673SS":"UNKNOWN","OSTGCSTBS6005":"HOG","HMT31":"UNKNOWN","EWP9004":"BLA","PD054HLR66F":"UNKNOWN","PD054HLR50Q":"LEN","WC303WOK":"HOG","NS407856":"UNKNOWN","W1073R":"HOG","P1078HLR50F":"LEN","LECT4AD3672P":"UNKNOWN","SCR3899":"LEN","PD054HLR50K":"UNKNOWN","PDC002HLR66Q":"LEN","P088LEATHER":"LEN","TR216572":"LEN","LEJC5505P":"UNKNOWN","LECT4AD6612N":"MUE","796ASDEC212261":"LEN","796ASDEC078216":"LEN","796ASDEC078062":"LEN","796ASDEC002068":"LEN","796ASDEC146138":"LEN","796ASDEC212273":"LEN","833BC170173B":"LEN","JLANOS120X120SURT":"LEN","BA4280":"LEN","GOOD2SLP50X80BG":"LEN","MAK500P":"LEN","SCR3858":"LEN","SCR3859":"LEN","PLW179K":"LEN","PLW178":"LEN","PLW186":"LEN","PLW210":"LEN","704TT0442":"LEN","MAX0378":"LEN","GAVI2040B":"BLA","MC61138":"CAR","PWS2275":"CAR","R503":"CAR","R505":"CAR","R509BT":"CAR","R506":"CAR","R512":"CAR","CLED58SDL7":"VID","UN50AU7000GXZ":"VID","RFEA1400SL":"HOG","KUJC010B":"HOG","RFEA1000SL":"UNKNOWN","LSWF06DW":"COM","LSWF28GW":"COM","LSWF07GW":"COM","GAF402M":"UNKNOWN","GAF810SD":"UNKNOWN","GAF601M":"HOG","BOC242N":"UNKNOWN","BOC241N":"UNKNOWN","GSH774BG":"UNKNOWN","GSH911RBG":"COC","GSH994BLG":"COC","GSH912BG":"COC","RH75028S":"UNKNOWN","EW1255":"BLA","CARLAGY6":"COC","CARLASL6":"COC","GSH590SCM":"COC","MCT002B":"HOG","PA15128STM":"CAR","GSH704NGQ":"COC","MCT002N":"HOG","GARRFG210":"UNKNOWN","CLED43SL5":"VID","PA15129STM":"UNKNOWN","GARBF13":"UNKNOWN","SWD2DOOROAK":"LEN","GARBF65":"HOG","SWD2DOORWENGUE":"LEN","SCD3DRAWEROAK":"LEN","SCD3DRAWEWENGUE":"LEN","GARHC40":"HOG","GARHMF32":"HOG","GARHC52":"HOG","GARHC65":"UNKNOWN","GARCIRH3500":"UNKNOWN","SBC4CUBEWENGUE":"UNKNOWN","SBC4CUBEWHITE":"LEN","MP3S":"UNKNOWN","KP3":"UNKNOWN","OLAX2000MAH":"UNKNOWN","428541":"UNKNOWN","428489":"UNKNOWN","428544":"LEN","428488":"UNKNOWN","CUA60DXJ04NEGRO":"LEN","CUA60DXJ15GRIS":"LEN","CUA60DXJ05NGSM":"LEN","CUA60DXJ11MARRCL":"LEN","CUA60DXJ01BLANCO":"LEN","CUA60DCXJ05NGSM":"LEN","CUA60DCXJ11MARRCL":"LEN","CUA60DCXJ15GRIS":"LEN","CUA60DCXJ04NEGRO":"LEN","CUA60DCXJ01BLANCO":"LEN","GASS130":"UNKNOWN","RAW12":"UNKNOWN","HEX26CPXJ11MARRCL":"LEN","HEX26CPXJ15GRIS":"LEN","HEX26CPXJ05NGSM":"LEN","HEX26CPXJ04NEGRO":"LEN","HEX26CPXJ01BLANCO":"LEN","HEX26EXJ04NEGRO":"LEN","HEX26EXJ11MARRCL":"LEN","HEX26EXJ15GRIS":"LEN","HEX26EXJ05NGSM":"LEN","HEX26EXJ01BLANCO":"LEN","HEX26CXJ04NEGRO":"LEN","HEX26CXJ11MARRCL":"LEN","HEX26CXJ15GRIS":"LEN","HEX26CXJ05NGSM":"LEN","HEX26CXJ01BLANCO":"LEN","HEX26TXJ05NGSM":"LEN","HEX26LXJ04NEGRO":"LEN","HEX26LXJ11MARRCL":"LEN","HEX26LXJ15GRIS":"LEN","HEX26LXJ05NGSM":"LEN","HEX26LXJ01BLANCO":"LEN","QDF109":"LEN","QDF20":"LEN","QDF49":"LEN","QDF119":"LEN","QDF27":"LEN","QDF09":"LEN","QDF43":"LEN","QDF22":"LEN","QDF62":"LEN","QDF81":"LEN","HMT66BAR":"UNKNOWN","LTKK32B13A":"VID","32A4NV":"VID","CLED40SDL7":"VID","CLED43SDL7":"VID","CLED55SDL7":"VID","CLEDQ65SL1":"VID","ES12R410A3":"BLA","3020":"LEN","3041":"LEN","3007":"LEN","3084":"LEN","3096":"LEN","4607":"LEN","3065":"LEN","3095":"LEN","3039":"LEN","GAROPEM6":"HOG","GAR999GNEG":"HOG","GAR999GBLAN":"HOG","GAROPEA5":"HOG","G639":"HOG","G639PLUS":"UNKNOWN","G4626GRIS":"HOG","G4626NEGRO":"HOG","GHH3811":"COC","WA122W":"BLA","CUPON300MMC":"UNKNOWN","CUPON400MMC":"UNKNOWN","CUPON900MMC":"UNKNOWN","CUPON500MMC":"UNKNOWN","CUPON600MMC":"UNKNOWN","CUPON700MMC":"UNKNOWN","CUPON800MMC":"UNKNOWN","KE61M":"HOG","KE89BCD":"HOG","OT389SS":"HOG","OT489SS":"HOG","GARWM9":"BLA","ERMRS20WABG":"HOG","PA10DCN49":"CAR","AW32B4SMG":"VID","LT50KM4584":"VID","50A5NV":"VID","55A6NV":"VID","EPKT033":"LEN","ROL7PZG":"HOG","EP7PCS038":"LEN","BH2978":"LEN","856-DRN992N":"UNKNOWN","856DRN992CH":"LEN","856DRN992B":"LEN","NS441201":"LEN","NS441202":"LEN","NS441203":"LEN","NS441204":"LEN","OFFICECHAIR306":"LEN","NS416798":"LEN","NS416805":"LEN","NS416806":"LEN","NS416802":"UNKNOWN","NS416803":"LEN","TRSAMNVY02":"LEN","TRTUMBLK01":"LEN","TRSAMBLK01":"LEN","AWCA502BT":"SON","AWCA802BS":"SON","AWW666BT":"SON","OSTBLSTPEGGPB":"HOG","OSTBLSTPEGRPB":"HOG","PA8DCS505":"CAR","PA8DCS512M":"CAR","PA8DCS509":"CAR","PA4DCS20M":"CAR","PA4DCS21M":"CAR","PA15230TSM":"CAR","PA12DCM8TM":"CAR","PA12DCM9TM":"CAR","PA8DCS503":"CAR","PA8DCS507":"CAR","PA8DCS511M":"CAR","PA8DCS508":"CAR","PA6DCS23M":"CAR","PA6DCS22M 2":"UNKNOWN","MC20512":"CAR","MC36512":"CAR"};

// Mapeo LINEA → Medusa category ID
const LINEA_CAT = {
  'BLA':  'pcat_01KREC246BG0GF8298F3GG0VDY',   // Línea blanca
  'HOG':  'pcat_01KWAKDF4CVXANSJQ19RENKA9E',    // Línea Hogar (pequeños electrodomésticos)
  'BODG': 'pcat_01KTM5223MHKC9HV1S44A9J0D8',   // Bodegón
  'LEN':  'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q',  // Hogar y Decoración
  'MUE':  'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q',  // Hogar y Decoración
  'COC':  'pcat_01KTM54XAJS591RN0YTXZ3NR9R',   // Cocinas
  'VID':  'pcat_01KTM4QWEKKFNMZVG2Q2WC13WR',   // Video
  'COM':  'pcat_01KTM4ZBPZGFWAGFQPX5P4D081',   // Tecnología
  'EM':   'pcat_01KTM4ZBPZGFWAGFQPX5P4D081',   // Tecnología
  'TEL':  'pcat_01KTM4WJ2MT7111TKM33Q4WJYR',   // Telefonía
  'FER':  'pcat_01KTWC3P75T9BAWQ7A2XHH0TVH',   // Ferretería
  'SON':  'pcat_01KTM3GX8D8HBRVRM82ZEMJD6C',   // Audio
  'CAR':  'pcat_01KTM3GX8D8HBRVRM82ZEMJD6C',   // Audio
  'NAC':  'pcat_01KTM4ZBPZGFWAGFQPX5P4D081',   // Tecnología
};

function getCatForBLA(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes('aire acondicionado') || t.includes('cortina de aire') || t.includes('minisplit')) return 'pcat_01KSGCP46MDW0BS48P8W9CTB38';
  if (t.includes('lavadora') || t.includes('lavasecadora') || t.includes('lava y seca')) return 'pcat_01KTM3B4GGHZGDCT2T2HPKV9ZD';
  if (t.includes('refrigerador') || t.includes('nevera') || t.includes('refrigeradora')) return 'pcat_01KTM3C4CDA4REA4AA36AY9PAK';
  if (t.includes('congelador') || t.includes('freezer')) return 'pcat_01KTM3D1AR8CYMBPF6AKJ01H1S3';
  return 'pcat_01KREC246BG0GF8298F3GG0VDY';
}

function getCatByTitle(titulo) {
  const t = titulo.toLowerCase();

  // Cupones — sin categoría
  if (t.includes('cupón') || t.includes('cupon') && t.includes('modo')) return null;

  // Aires Acondicionados
  if (t.includes('aire acondicionado') || t.includes('cortina de aire') || t.includes('minisplit')) return 'pcat_01KSGCP46MDW0BS48P8W9CTB38';

  // Congeladores / Neveras / Lavadoras
  if (t.includes('congelador') || t.includes('freezer')) return 'pcat_01KTM3D1AR8CYMBPF6AKJ01H1S3';
  if (t.includes('refrigerador') || t.includes('nevera')) return 'pcat_01KTM3C4CDA4REA4AA36AY9PAK';
  if (t.includes('lavadora')) return 'pcat_01KTM3B4GGHZGDCT2T2HPKV9ZD';

  // Video / TV
  if (t.includes('tv ') || t.includes(' tv') || t.includes('televisor') || t.includes('smart tv') || t.includes('cled') || t.includes('led ')) return 'pcat_01KTM4QWEKKFNMZVG2Q2WC13WR';

  // Cocinas (artefactos de cocina)
  if (t.includes('cocina de mesa') || t.includes('cocina de induccion') || t.includes('cocina de inducción') ||
      t.includes('tope a gas') || t.includes('estufa') || t.includes('hornilla') ||
      t.includes('cocina portatil') || t.includes('cocina portátil') || t.includes('cocina de piso') ||
      t.includes('freidora') || t.includes('air fryer') || t.includes('horno') || t.includes('microondas') ||
      t.includes('fregadero') || t.includes('lavaplatos') || t.includes('campana') || t.includes('gasco')) return 'pcat_01KTM54XAJS591RN0YTXZ3NR9R';

  // Ferretería (INGCO y herramientas)
  if (t.includes('ingco') || t.includes('martillo') || t.includes('alicate') || t.includes('destornillador') ||
      t.includes('nivel aluminio') || t.includes('broca') || t.includes('disco de corte') ||
      t.includes('disco lijador') || t.includes('disco abrasivo') || t.includes('motosierra') ||
      t.includes('hacha') || t.includes('mazo de acero') || t.includes('cizalla') ||
      t.includes('grapadora industrial') || t.includes('lijadora') || t.includes('pistola de calor') ||
      t.includes('cepillo de alambre') || t.includes('cepillos de cerdas') || t.includes('cinta métrica') ||
      t.includes('cinta metrica') || t.includes('remachadora') || t.includes('corta tubo') ||
      t.includes('marco de segueta') || t.includes('herramientas para jardín') || t.includes('herramientas para jardin')) return 'pcat_01KTWC3P75T9BAWQ7A2XHH0TVH';

  // Audio
  if (t.includes('bocina') || t.includes('parlante') || t.includes('speaker') || t.includes('equipo de sonido') ||
      t.includes('barra de sonido') || t.includes('radio ') || t.includes('radio/') ||
      t.includes('audífonos') || t.includes('audifonos') || t.includes('buds') || t.includes('subwoofer')) return 'pcat_01KTM3GX8D8HBRVRM82ZEMJD6C';

  // Telefonía
  if (t.includes('telefono') || t.includes('celular') || t.includes('smartphone') || t.includes('tablet') ||
      t.startsWith('forro ') || t.includes('forro azul') || t.includes('forro samsung')) return 'pcat_01KTM4WJ2MT7111TKM33Q4WJYR';

  // Tecnología (cables, cargadores, cámaras seguridad, UPS, redes)
  if (t.includes('laptop') || t.includes('computadora') || t.includes('router') || t.includes('smartwatch') ||
      t.includes('cable cargador') || t.includes('cable carga') || t.includes('cable auxiliar') ||
      t.includes('cargador') || t.includes('ups ') || t.includes('power station') ||
      t.includes('respaldo de bater') || t.includes('cámara de seguridad') || t.includes('camara de seguridad') ||
      t.includes('tapo c') || t.includes('timbre inteligente') || t.includes('switch ') && t.includes('puertos') ||
      t.includes('modem para exterior') || t.includes('access point')) return 'pcat_01KTM4ZBPZGFWAGFQPX5P4D081';

  // Línea Hogar — pequeños electrodomésticos del hogar
  if (t.includes('licuadora') || t.includes('batidora') || t.includes('tostadora') || t.includes('cafetera') ||
      t.includes('exprimidor') || t.includes('sandwichera') || t.includes('hervidor') ||
      t.includes('procesador') || t.includes('extractor') || t.includes('máquina de helados') ||
      t.includes('maquina de helados') || t.includes('tosty arepa') || t.includes('tosti arepa') ||
      t.includes('máquina para donuts') || t.includes('olla arrocera') ||
      t.includes('ventilador') || t.includes('plancha de ropa') || t.includes('plancha al vapor') ||
      t.includes('plancha alisadora') || t.includes('rasuradora') || t.includes('máquina de afeitar') ||
      t.includes('maquina de afeitar') || t.includes('secador de cabello') || t.includes('aspiradora')) return 'pcat_01KWAKDF4CVXANSJQ19RENKA9E';

  // Bodegón — utensilios, vajilla, ollas, sartenes (no eléctricos)
  if (t.includes('sartén') || t.includes('sarten') || t.includes('olla') || t.includes('vajilla') ||
      t.includes('plato ') || t.includes('plato plano') || t.includes('plato hondo') || t.includes('plato de postre') ||
      t.includes('plato mediano') || t.includes('plato pequeño') || t.includes('plato para servir') ||
      t.includes('cuchillo') || t.includes('cuchillos') || t.includes('cubierto') ||
      t.includes('tabla de picar') || t.includes('tabla para picar') || t.includes('tabla de quesos') ||
      t.includes('colador') || t.includes('batidor de huevo') || t.includes('set de bowls') || t.includes('bowl') ||
      t.includes('bandeja asadora') || t.includes('bandeja para galletas') || t.includes('porta caliente') ||
      t.includes('cesta coccion') || t.includes('cesta cocción') || t.includes('cesta de cocción') ||
      t.includes('molinillo') || t.includes('servilletero') || t.includes('salero') ||
      t.includes('tazón') || t.includes('tazon') || t.includes('taza') || t.includes('tetera') ||
      t.includes('azucarera') || t.includes('mantequillera') || t.includes('juego de tazas') ||
      t.includes('lonchera') || t.includes('vianda') || t.includes('envase plástico') || t.includes('envase plastico') ||
      t.includes('caja multiusos') || t.includes('contenedor plástico') || t.includes('contenedor plastico') ||
      t.includes('frutero') || t.includes('delantal') || t.includes('guantes para cocina') ||
      t.includes('abrelatas') || t.includes('base para tortas') || t.includes('set de utensilios') ||
      t.includes('juego de utensilios') || t.includes('set utensilios') || t.includes('set de cacerolas') ||
      t.includes('set de plato') || t.includes('punzón') || t.includes('termo ') ||
      t.includes('set para bbq') || t.includes('juego de anillos para servilletas') ||
      t.includes('hielera') || t.includes('toallas microfibra') || t.includes('juego de ollas')) return 'pcat_01KTM5223MHKC9HV1S44A9J0D8';

  // Hogar y Decoración — muebles, textiles, decoración, baño, organización
  if (t.includes('adorno') || t.includes('portavela') || t.includes('candelero') || t.includes('candelabro') ||
      t.includes('vela aromatica') || t.includes('vela aromática') || t.includes('quemador de incienso') ||
      t.includes('cojín') || t.includes('cojin') || t.includes('almohada') ||
      t.includes('cortina de baño') || t.includes('juego de baño') || t.includes('accesorios') && t.includes('baño') ||
      t.includes('set de accesorios baño') || t.includes('dispensador de jabón') || t.includes('dispensador de jabon') ||
      t.includes('jabonera') || t.includes('papelera') || t.includes('basurero') || t.includes('bote de basura') ||
      t.includes('canasta plástica') || t.includes('canasta plastica') || t.includes('canasta organizadora') ||
      t.includes('cesto para ropa') || t.includes('cesto ropa') || t.includes('canasta para ropa') ||
      t.includes('canasta plegable') || t.includes('organizador de baño') || t.includes('organizador de corb') ||
      t.includes('armario de tela') || t.includes('zapatera') || t.includes('estante') || t.includes('estantería') ||
      t.includes('biblioteca') || t.includes('mesa de centro') || t.includes('mesa de noche') ||
      t.includes('carrito de bar') || t.includes('sillón') || t.includes('sillon') ||
      t.includes('silla comedor') || t.includes('silla de bar') || t.includes('silla plástica') ||
      t.includes('silla playera') || t.includes('silla para barra') || t.includes('silla camping') ||
      t.includes('silla infantil') || t.includes('silla fija') || t.includes('set de 4 sillas') ||
      t.includes('banco negro') || t.includes('banco azul') || t.includes('butaca') ||
      t.includes('sofá') || t.includes('sofa seccional') || t.includes('sofa inflable') ||
      t.includes('cama ') || t.includes('base cama') || t.includes('mueble multiusos') || t.includes('mueble de') ||
      t.includes('revestimiento plástico') || t.includes('revestimiento plastico') ||
      t.includes('tubo de cortina') || t.includes('alfombra') || t.includes('tapete') ||
      t.includes('sabana') || t.includes('sábana') || t.includes('colchon') || t.includes('colchón') ||
      t.includes('toalla') || t.includes('edredon') || t.includes('edredón') || t.includes('funda') ||
      t.includes('manta') || t.includes('cortina') || t.includes('ropa de cama') || t.includes('juego de cama') ||
      t.includes('lenceria') || t.includes('lencería') || t.includes('perchero') || t.includes('librero') ||
      t.includes('bandeja dorada') || t.includes('bandeja decorativa') || t.includes('plato decorativo') ||
      t.includes('alcancía') || t.includes('alcancia') || t.includes('caja de libro') ||
      t.includes('maleta') || t.includes('travel') || t.includes('panel ac')) return 'pcat_01KREC2BTSDBBBWF4NE9FMZPZ9Q';

  return null;
}

function getCategoryId(sku, titulo) {
  // Cupones sin categoría
  if (sku.startsWith('CUPON')) return null;

  // Buscar por SKU exacto
  const linea = SKU_LINEA[sku];
  if (linea && linea !== 'UNKNOWN') {
    if (linea === 'BLA') return getCatForBLA(titulo);
    return LINEA_CAT[linea] || getCatByTitle(titulo);
  }

  // Detectar línea por prefijo del SKU (códigos internos no corregidos)
  const skuU = sku.toUpperCase();
  const prefixMap = {
    'BODG': 'BODG', 'HOG': 'HOG', 'LEN': 'LEN', 'MUE': 'MUE',
    'COC': 'COC', 'VID': 'VID', 'COM': 'COM', 'TEL': 'TEL',
    'FER': 'FER', 'SON': 'SON', 'CAR': 'CAR', 'BLA': 'BLA',
    'EM': 'EM', 'NAC': 'NAC',
  };
  for (const [prefix, lineaCode] of Object.entries(prefixMap)) {
    if (skuU.startsWith(prefix)) {
      if (lineaCode === 'BLA') return getCatForBLA(titulo);
      if (LINEA_CAT[lineaCode]) return LINEA_CAT[lineaCode];
      break;
    }
  }

  return getCatByTitle(titulo);
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
    process.stdout.write(`\r  Obtenidos ${products.length} productos...`);
    if (batch.length < limit) break;
    offset += limit;
  }
  console.log('');
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
    const sku = p.variants?.[0]?.sku || '';
    const catId = getCategoryId(sku, p.title);

    if (!catId) {
      sinCategoria++;
      sinCategoriaList.push({ titulo: p.title, sku });
      console.log(`⚠️  [${i+1}/${products.length}] SIN CATEGORÍA: ${p.title.substring(0, 60)}`);
      continue;
    }

    const res = await apiRequest('POST', `/admin/products/${p.id}`, { categories: [{ id: catId }] }, token);
    if (res.status === 200 || res.status === 201) {
      asignados++;
      console.log(`✅ [${i+1}/${products.length}] ${sku} → ${catId}`);
    } else {
      errores++;
      console.log(`❌ [${i+1}/${products.length}] ${sku}: ${JSON.stringify(res.data?.message || res.data).substring(0, 120)}`);
    }

    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🏁 Resultado: ${asignados} asignados, ${sinCategoria} sin categoría, ${errores} errores`);

  if (sinCategoriaList.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'sin_categoria.json'), JSON.stringify(sinCategoriaList, null, 2));
    console.log(`⚠️  Productos sin categoría guardados en sin_categoria.json`);
  }
}

main().catch(console.error);
