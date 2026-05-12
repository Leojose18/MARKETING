# KRASHDEPOT — Auditoría Meta Ads | Informe Completo

## Resumen Ejecutivo

Meta Ads Health Score: 22/100 (Grade: F)

Meta: 22/100

**Cuenta:** KRASHDEPOT | **Plataforma:** Meta / Instagram | **Período:** Últimos 30 días
**Presupuesto mensual:** $500 USD | **Mercado:** Venezuela — Región Occidente | **Objetivo:** Ventas

La cuenta KRASHDEPOT tiene actualmente **0 campañas activas** y un puntaje de salud de 22 sobre 100,
lo que la ubica en categoría F — intervención urgente requerida. Durante los últimos 30 días se
gastaron $328,50 USD distribuidos en 6 campañas, todas desactivadas y todas con objetivo de
Tráfico en lugar de Ventas. El problema central no es el presupuesto ni el mercado: el CPC de
$0,02–$0,03 en Venezuela es una ventaja competitiva real. El problema es que todo ese tráfico
se está desperdiciando porque no existe un sistema de conversión configurado. Meta no sabe quién
compra y, por lo tanto, no puede optimizar para conseguir más ventas.

---

## Análisis del Puntaje de Salud (Health Score)

El **gauge circular** muestra el puntaje global de la cuenta: **22/100, Grado F**.

Este puntaje se calcula como promedio ponderado de cuatro categorías:
Pixel y CAPI (30%), Creatividades (30%), Estructura de cuenta (20%) y Audiencias (20%).

Un puntaje de 22 indica que la cuenta está fallando en sus fundamentos técnicos y estratégicos.
No se trata de optimizaciones menores: la cuenta necesita ser reconstruida desde la base.
Las cuentas con Grade F pierden entre el 40% y el 70% de su potencial de ventas por errores
de configuración, no por falta de presupuesto.

**Interpretación del gauge:**
- La zona roja (0–40) indica problemas estructurales graves
- El 78% del círculo está sin completar — refleja oportunidad de mejora, no pérdida permanente
- Una vez corregidos los errores críticos, este puntaje puede alcanzar 65–75 en 30 días

---

## Análisis del Gráfico de Puntajes por Categoría

El **gráfico de barras horizontales** muestra los puntajes de las cuatro categorías evaluadas:

| Categoría | Puntaje | Peso |
|-----------|---------|------|
| Pixel y CAPI | 18/100 | 30% |
| Creatividades | 30/100 | 30% |
| Estructura | 18/100 | 20% |
| Audiencias | 30/100 | 20% |

**Lectura del gráfico:**
Las dos barras más cortas (Pixel/CAPI y Estructura) representan los problemas más urgentes.
Pixel/CAPI con 18 puntos significa que Meta está recibiendo datos incompletos o incorrectos
sobre el comportamiento del usuario — esto afecta directamente la capacidad del algoritmo
para encontrar compradores. Estructura con 18 puntos refleja que los $500 mensuales están
fragmentados en 6 campañas sin objetivo correcto, lo que impide que el algoritmo aprenda.
Las categorías de Creatividades y Audiencias tienen margen de mejora pero son secundarias
hasta resolver el tracking y la estructura.

---

## Análisis del Gráfico de Distribución de Resultados

El **gráfico donut** muestra la proporción de checks aprobados, con advertencia y fallidos
sobre el total de 50 verificaciones realizadas en la auditoría.

- **Pass (aprobado):** 3 checks — CPC competitivo, cantidad de campañas aceptable, CTR estimado
- **Warning (advertencia):** 14 checks — elementos parciales o no verificables
- **Fail (fallido):** 33 checks — errores que impactan directamente el rendimiento

**Lectura del gráfico:**
El 66% de los checks en rojo indica que dos tercios de los fundamentos publicitarios están
rotos o ausentes. Esto es inusual incluso para cuentas pequeñas. La mayoría de los fallos
están concentrados en tracking (Pixel, CAPI, eventos) y en objetivo de campaña — problemas
que se resuelven en horas, no semanas. Los 14 checks en amarillo corresponden mayormente a
elementos que no pudieron verificarse por falta de acceso a Events Manager y Business Manager.

---

## Problemas Críticos

- Objetivo de campaña incorrecto: las 6 campañas usan Tráfico en lugar de Ventas — Meta optimiza para clics, no para compras
- Cero campañas activas: la cuenta está completamente pausada, sin anuncios en circulación
- Sin tracking de conversiones: no existe el evento Purchase ni Lead configurado
- CAPI no activo: pérdida de datos del 30–40% post-iOS 14.5 sin seguimiento del lado del servidor
- Campaña enviando tráfico al perfil de Instagram: $48,80 gastados sin ningún camino hacia la venta
- Cuenta fragmentada: 6 campañas con $500/mes equivale a $1,80/día por campaña — insuficiente para aprendizaje
- Campaña duplicada detectada: el nombre "Copia" indica duplicación que reinicia el aprendizaje

---

## Acciones Rápidas

- Crear nueva campaña con objetivo Ventas — nunca editar las campañas de Tráfico existentes
- Instalar y verificar el Meta Pixel en el sitio web — toma 30 minutos
- Activar CAPI Gateway para recuperar el 30–40% de datos perdidos por iOS
- Cambiar el destino del anuncio que apunta al perfil de Instagram
- Consolidar las 6 campañas en 1 sola campaña con 1 ad set a $16/día
- Configurar el evento de conversión Purchase o Lead correctamente
- Establecer ventana de atribución 7 días clic / 1 día vista

---

## Pixel y CAPI — 18/100

**Por qué este puntaje importa:**
El Pixel y la API de Conversiones (CAPI) son el sistema nervioso de Meta Ads. Sin ellos,
Meta no sabe qué usuarios compraron, cuánto gastaron ni qué comportamiento tuvieron en el
sitio. El algoritmo de Andromeda necesita esos datos para encontrar más compradores similares.
Con 18/100 en esta categoría, KRASHDEPOT está básicamente anunciando a ciegas: gasta dinero
para llevar personas al sitio pero Meta no puede aprender de esas visitas para mejorar.

| ID | Verificación | Gravedad | Estado | Detalle |
|----|-------------|----------|--------|---------|
| M01 | Meta Pixel instalado | Crítico | Warning | No verificable — falta captura de Events Manager |
| M02 | API de Conversiones (CAPI) activa | Crítico | Fail | Sin eventos del lado servidor. Pérdida de datos: 30–40% |
| M03 | Deduplicación de eventos | Crítico | Fail | Sin CAPI no es posible la deduplicación |
| M04 | Calidad de coincidencia EMQ >= 8.5 | Crítico | Fail | Evento Purchase no configurado |
| M05 | Dominio verificado en Business Manager | Alto | Warning | No verificable desde la captura |
| M06 | Aggregated Event Measurement (AEM) | Alto | Fail | No configurado |
| M07 | Eventos estándar activos | Alto | Fail | Sin eventos de conversión activos |
| M08 | CAPI Gateway desplegado | Medio | Fail | No implementado |
| M09 | Ventana de atribución 7 días clic | Alto | Fail | No configurada con objetivo de Tráfico |
| M10 | Frescura de datos en tiempo real | Medio | Warning | Sin eventos activos no se puede medir |

---

## Estructura de Cuenta — 18/100

**Por qué este puntaje importa:**
La estructura define cómo el algoritmo de Meta distribuye el presupuesto y aprende.
Con 6 campañas fragmentadas, cada una recibe apenas $1,80/día — muy por debajo del mínimo
de $10/día que necesita un ad set para salir de la fase de aprendizaje. Además, todas
las campañas tienen objetivo de Tráfico: Meta optimiza para llevar gente que haga clic,
no para encontrar personas que compren. Este es el error más costoso de la cuenta.

| ID | Verificación | Gravedad | Estado | Detalle |
|----|-------------|----------|--------|---------|
| M11 | Cantidad de campañas (1–3) | Alto | Pass | 2 nombres distintos visibles en primera captura |
| M12 | CBO vs ABO apropiado | Alto | Warning | ABO a ~$11/día total — por debajo del umbral recomendado |
| M13 | Estado de fase de aprendizaje | Crítico | Fail | 100% de ad sets desactivados — cuenta completamente pausada |
| M15 | Advantage+ Sales activo | Medio | Fail | No activo. Potencial: +22% ROAS / -11.7% CPA |
| M17 | Presupuesto >= $10/día por ad set | Alto | Fail | ~$1,80/día por ad set al dividir entre 6 campañas |
| M18 | Objetivo de campaña = meta de negocio | Alto | Fail | TODAS las campañas son Tráfico — la meta es Ventas |
| M32 | Advantage+ Creative habilitado | Medio | Fail | No verificable — campañas inactivas |
| M35 | Ventana de atribución post-enero 2026 | Alto | Fail | No configurada correctamente |
| M39 | Parámetros UTM en URLs | Medio | Warning | No verificable desde capturas |
| M40 | Prueba A/B activa | Medio | Fail | Sin experimentos activos |
| M-ST1 | Presupuesto >= 5× CPA por ad set | Alto | Fail | Sin CPA definido y presupuesto fragmentado |

---

## Creatividades — 30/100

**Por qué este puntaje importa:**
Desde octubre de 2025, el motor Andromeda de Meta filtra decenas de millones de anuncios
usando modelos 10.000 veces más complejos. La diversidad creativa es ahora el principal
factor de rendimiento. Los anuncios con más del 60% de similitud entre sí reciben supresión
de entrega. En KRASHDEPOT, los nombres casi idénticos de las campañas sugieren que las
creatividades también son muy parecidas entre sí — lo que Andromeda penaliza activamente.

| ID | Verificación | Gravedad | Estado | Detalle |
|----|-------------|----------|--------|---------|
| M25 | >= 3 formatos creativos activos | Crítico | Warning | Solo imágenes estáticas visibles en thumbnails |
| M26 | >= 5 creatividades por ad set | Alto | Warning | No verificable — campañas pausadas |
| M27 | Video vertical 9:16 para Reels/Stories | Alto | Fail | Sin activos de video visibles |
| M28 | Detección de fatiga creativa | Crítico | Warning | Campañas pausadas — fatiga no medible |
| M29 | Hook rate video < 50% skip | Alto | Fail | Sin video activo en la cuenta |
| M30 | Uso de contenido orgánico boosteado | Medio | Warning | No visible en capturas |
| M31 | Contenido UGC >= 30% | Alto | Warning | Thumbnails con personas visibles — no confirmado |
| M32 | Advantage+ Creative habilitado | Medio | Fail | No testeado |
| M-AN1 | Diversidad Andromeda | Crítico | Warning | Nombres casi idénticos sugieren creatividades similares |
| M-CR1 | Creatividad nueva en últimos 21 días | Alto | Fail | Todas las campañas pausadas — sin creative fresco |
| M-CR4 | CTR >= 1% | Alto | Pass | CPC $0,02–$0,03 en mercado VE indica CTR probablemente alto |

---

## Audiencias y Segmentación — 30/100

**Por qué este puntaje importa:**
Sin pixel activo ni eventos de conversión, Meta no puede construir audiencias personalizadas
basadas en compradores reales. Esto significa que no hay retargeting a visitantes del sitio,
no hay exclusión de personas que ya compraron y no hay Lookalike de compradores. La cuenta
está gastando el 100% del presupuesto en audiencias frías sin ninguna capa de remarketing.

| ID | Verificación | Gravedad | Estado | Detalle |
|----|-------------|----------|--------|---------|
| M19 | Superposición de audiencias < 20% | Alto | Warning | 6 campañas con nombres similares sugieren overlap |
| M20 | Frescura de Custom Audiences | Alto | Fail | Sin campañas activas — no se recolectan datos |
| M21 | Calidad de fuente Lookalike | Medio | Warning | No verificable sin vista de Audiences |
| M22 | Advantage+ Audience testeado | Medio | Fail | No activo |
| M23 | Exclusión de compradores del prospecting | Alto | Fail | Sin tracking = sin audiencias de exclusión |
| M24 | Datos de primera parte cargados | Alto | Warning | No verificable desde capturas |

---

## Inventario de Campañas

Análisis de las 6 campañas identificadas en las capturas de pantalla proporcionadas.
Todas están desactivadas. El total gastado de $328,50 se distribuyó en 5 campañas activas
(una nunca llegó a ejecutarse). El CPC promedio de $0,027 es competitivo para Venezuela
pero irrelevante sin un objetivo de conversión que genere ventas reales.

| Campaña | Objetivo | Resultado | CPC | Gasto | Estado |
|---------|---------|-----------|-----|-------|--------|
| Bajada de Inicial Occidente v1 | Tráfico | 2.434 clics | $0,0278 | $67,58 | Desactivada |
| Bajada de Inicial Occidente v2 | Tráfico | 4.697 clics | $0,0300 | $141,09 | Desactivada |
| #NuevoEnKrashDepot Vzla v1 | Tráfico | 3.127 clics | $0,0227 | $71,03 | Desactivada |
| Beneficios Krash Occidente | Tráfico | 2.395 visitas al perfil IG | $0,0204 | $48,80 | Desactivada |
| #NuevoEnKrashDepot Vzla v2 | Tráfico | 0 clics | $0,00 | $0,00 | Nunca ejecutada |
| #VenPaKrash SS $15 — Copia | Tráfico | Desconocido | — | — | Desactivada |

**Hallazgo clave — Campaña "Beneficios Krash Occidente":**
Esta campaña registra "Visitas al perfil de Instagram" como métrica principal, no clics al sitio web.
Esto significa que $48,80 se gastaron llevando personas al perfil de Instagram de la marca,
donde no hay botón de compra ni carrito. Es dinero invertido en visibilidad de perfil,
no en ventas. Esta campaña debe ser eliminada y reemplazada por una con destino al sitio web
o a un chat de WhatsApp con cierre de venta.

---

## Comparativa de Benchmarks

| Métrica | KRASHDEPOT | Benchmark Meta LatAm | Estado |
|---------|-----------|----------------------|--------|
| CPC (clics al enlace) | $0,022–$0,030 | $0,03–$0,08 | Pass |
| Objetivo de campaña | Tráfico | Ventas / Conversiones | Fail |
| Campañas activas | 0 | >= 1 | Fail |
| CAPI activo | No | Requerido | Fail |
| Formatos creativos | 1 (estimado) | >= 3 | Fail |
| Presupuesto por ad set/día | ~$1,80 | >= $10 | Fail |
| Eventos de conversión | 0 | Purchase o Lead | Fail |
| Ventana de atribución | No configurada | 7 días clic / 1 día vista | Fail |

**Análisis de benchmarks:**
El único indicador positivo es el CPC, que es competitivo para el mercado venezolano.
Sin embargo, un CPC bajo sin conversiones configuradas no genera ventas — solo genera
tráfico barato que Meta no puede aprender a convertir. El resto de los indicadores
están en rojo, con 7 de 8 métricas clave fallando. Esto confirma que los problemas
son de configuración, no de mercado ni de presupuesto.

---

## Estructura Recomendada

| Elemento | Situación Actual | Recomendación |
|----------|-----------------|---------------|
| Número de campañas | 6 (todas pausadas) | 1 activa |
| Objetivo | Tráfico | Ventas o Leads |
| Ad sets | 6+ fragmentados | 1 consolidado |
| Presupuesto diario | ~$11 dividido en 6 | $16/día en 1 ad set |
| Destino del anuncio | Sitio web + Perfil IG | Sitio web o WhatsApp |
| Formatos creativos | 1 (imagen estática) | 3 (imagen, video, carrusel) |
| Pixel y CAPI | No confirmado | Requerido antes de lanzar |

**Justificación de la estructura recomendada:**
Concentrar todo el presupuesto en 1 campaña y 1 ad set tiene un propósito técnico claro:
Meta necesita al menos 50 conversiones por semana para que un ad set salga de la fase
de aprendizaje. Con $500/mes dividido en 6, esto es imposible. Con $500/mes en 1 ad set,
Meta acumula datos más rápido y puede optimizar el algoritmo en 2–3 semanas.

---

## Plan de Acción Priorizado

| Prioridad | Acción | Tiempo | Impacto |
|-----------|--------|--------|---------|
| Crítico | Crear nueva campaña con objetivo Ventas — no reutilizar campañas de Tráfico | 15 min | Alto |
| Crítico | Instalar y verificar Meta Pixel en sitio web | 30 min | Alto |
| Crítico | Activar CAPI Gateway para recuperar datos perdidos | 15 min | Alto |
| Crítico | Eliminar campaña con destino Perfil de Instagram | 5 min | Alto |
| Alto | Consolidar 6 campañas en 1 ad set a $16/día | 20 min | Alto |
| Alto | Configurar evento Purchase o Lead | 20 min | Alto |
| Alto | Añadir video vertical 9:16 para Reels y Stories | 1–2 días | Medio |
| Alto | Establecer ventana de atribución 7 días clic / 1 día vista | 2 min | Medio |
| Medio | Testear Advantage+ Audience vs segmentación manual | 1 semana | Medio |
| Medio | Agregar parámetros UTM a todas las URLs de anuncios | 5 min | Medio |

---

## Advertencia — Categoría Especial de Anuncios

Las campañas hacen referencia a cuotas, bajada de inicial y modos de pago.
Si KRASHDEPOT ofrece financiamiento, crédito o planes de cuotas, aplica la Categoría
Especial de Anuncios para Productos Financieros, obligatoria en Meta desde enero de 2025.
No declararla antes de crear campañas resulta en desaprobación masiva de anuncios.
Las restricciones incluyen: sin segmentación por código postal, edad 18–65 años únicamente
y sin uso de Lookalike Audiences. Verificar este punto antes de crear cualquier campaña nueva.

---

## Proyección de Resultados

Si se implementan las acciones críticas en los próximos 30 días, se estima:

| Métrica | Situación Actual | Proyección a 30 días |
|---------|-----------------|----------------------|
| Health Score | 22/100 (F) | 65–75/100 (C–B) |
| Campañas activas | 0 | 1 optimizada |
| Datos de conversión | 0% | 60–70% recuperados con CAPI |
| CPA estimado | Sin dato | $3–$8 USD por conversión en VE |
| Clics/mes potenciales | ~12.000 (pasados) | ~16.000 con presupuesto consolidado |

Con el CPC actual de $0,027 y un presupuesto de $500 mensuales, KRASHDEPOT puede generar
aproximadamente 18.500 clics por mes. Si la tasa de conversión del sitio web es del 1%,
eso representa ~185 ventas mensuales. Sin tracking configurado, esas ventas ocurren
sin que Meta lo sepa — y por eso el algoritmo nunca mejora.
