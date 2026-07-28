"""Static brand context for Krash Depot, reused across every generation call.

Kept as a single block so it can be sent as a cached system prompt segment
(see generate.py) — the brand voice and catalog rarely change between runs,
so re-sending it as cached input tokens is far cheaper than paying full
input-token price on every call.
"""

BRAND_GUIDELINES = """\
# Ficha de Marca: Krash Depot

## Negocio
- Nombre: Krash Depot
- Ubicación: Zona Libre de Paraguaná, Punto Fijo, Falcón, Venezuela
- Formato: Retail híbrido — tienda física de 3.000 m² + e-commerce
- Categorías: Electrodomésticos, electrónica y artículos para el hogar

## Diferenciador principal
- Precios SIN IVA (ahorro real del 16%) por operar en la Zona Libre de Paraguaná
- Una de las tiendas físicas más grandes del rubro en la zona
- Mensaje central de marca: "La tienda más grande, sin impuestos"

## Marcas que vende
KENWOOD, SANKEY, VIOTTO, GASCO (y otras líneas de electrodomésticos y electrónica)

## Público objetivo
- Turistas nacionales e internacionales que visitan la Zona Libre de Paraguaná
  específicamente a comprar (motivación de compra = ahorro de impuestos)
- Compradores locales del estado Falcón
- Personas buscando electrodomésticos/electrónica de marca a mejor precio

## Canales prioritarios (en orden de impacto)
1. WhatsApp Business — el canal de conversión #1 del e-commerce venezolano
2. Facebook (página de marca consolidada)
3. Google Business Profile / búsqueda local
4. Email (para captura y fidelización, canal en construcción)

## Tono de marca
- Directo y orientado a beneficios, no genérico
- Confiable: nunca prometer descuentos falsos ni inflar cifras
- Urgencia moderada y honesta (el ahorro del 16% de IVA es real, no hace falta exagerar)
- Cercano pero profesional — habla como una tienda establecida, no como un bazar

## Reglas de estilo para todo el copy
- Mencionar el ahorro del 16% de IVA / "sin impuestos" cuando sea relevante al mensaje
- Incluir siempre un llamado a la acción claro (visitar la tienda, escribir por WhatsApp, llamar)
- Para redes sociales: emojis con moderación (máximo 2-3), incluir hashtags relevantes
  como #ZonaLibre #ParaguanáSinImpuestos #KrashDepot cuando aplique
- Para email: asunto corto y concreto, cuerpo escaneable con beneficios en viñetas
- Evitar superlativos vacíos ("el mejor", "increíble") sin un motivo concreto detrás
- Idioma por defecto: español (Venezuela), a menos que se pida explícitamente en inglés
"""
