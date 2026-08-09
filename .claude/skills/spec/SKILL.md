---
name: spec
description: Entrevista al usuario, una pregunta enfocada a la vez, para definir por completo una funcionalidad o aplicación antes de escribir ninguna línea de código, y guarda el resultado como una especificación en specs/<slug>.md. Úsalo siempre que el usuario invoque /spec, o cuando diga cosas como "quiero construir X", "ayúdame a definir Y", "necesito planear una nueva función", "antes de programar esto, aclaremos qué hace falta". No uses este skill si el usuario ya trae una especificación completa y solo quiere que se construya — en ese caso ve directo a /build.
---

# Spec

Este skill convierte una idea vaga en una especificación completa y verificable, **sin escribir ni una línea de implementación**. La especificación es el contrato: si queda ambigua, quien construya (incluido el skill `/build`) tendrá que adivinar, y adivinar es lo que este skill existe para evitar.

## Regla principal: una pregunta a la vez

Nunca lances una lista de preguntas ni un formulario. Haz **una sola pregunta enfocada**, espera la respuesta del usuario, y recién entonces decide cuál es la siguiente pregunta según lo que acabas de aprender. Esto es una conversación, no un cuestionario — deja que la respuesta anterior guíe la siguiente pregunta en vez de seguir un guion fijo.

No empieces a construir, no propongas código, no crees archivos de implementación ni menciones estructura de carpetas del proyecto final durante la entrevista. Tu único entregable en esta fase es entendimiento, y al final, el archivo de especificación.

## Qué necesitas descubrir

Antes de poder escribir la especificación, necesitas tener claridad real (no solo una respuesta cualquiera) sobre:

1. **Objetivo** — qué problema resuelve esto y para quién. Qué cambia en el mundo cuando esto exista.
2. **Requisitos obligatorios** — qué tiene que hacer sí o sí. Distingue lo indispensable de lo "estaría bien tenerlo".
3. **Restricciones** — tecnología a usar u obligatoria a evitar, integraciones existentes, límites de tiempo/presupuesto, compatibilidad con lo que ya existe en el repo, requisitos de estilo o formato de marca, etc.
4. **Casos extremos** — qué debe pasar ante entradas vacías, datos inválidos, fallos de red/API, permisos insuficientes, concurrencia, valores límite, etc. Pregunta específicamente por esto; el usuario casi nunca los menciona espontáneamente.
5. **Definición de "terminado"** — cómo alguien que no participó en la conversación podría verificar, paso a paso, que la construcción cumple con lo pedido. Esto debe ser concreto y comprobable (comandos a correr, resultados esperados, pantallas o outputs específicos), no una frase vaga como "que funcione bien".

No avances de tema a tema mecánicamente: si una respuesta revela una restricción nueva o un caso extremo no contemplado, pregunta por eso antes de seguir. Empieza casi siempre por el objetivo (el "por qué"), porque todo lo demás se entiende mejor una vez que sabes para quién y para qué es esto.

## Cuándo dejar de preguntar

Deja de entrevistar cuando puedas escribir cada sección de la especificación (ver plantilla abajo) con contenido específico y sin rellenar huecos con suposiciones. Si notas que estás a punto de inventar un requisito porque el usuario no lo mencionó, esa es la señal de que falta una pregunta más, no de que debas rellenarlo tú.

Antes de escribir el archivo, resume en 3-5 líneas lo que entendiste (objetivo, requisitos clave, restricciones, definición de terminado) y confírmalo con el usuario. Si corrige algo, ajusta y vuelve a confirmar brevemente antes de guardar.

## Escribir la especificación

Determina un slug corto en kebab-case a partir del nombre de la función o app (por ejemplo, "dashboard de métricas de campañas" → `dashboard-metricas-campanas`). Crea el directorio `specs/` si no existe, y guarda el archivo en `specs/<slug>.md`. Si ya existe un archivo con ese slug, pregunta al usuario si quiere sobrescribirlo, versionarlo (`<slug>-2.md`) o si en realidad es una función distinta.

Usa esta estructura exacta:

```markdown
# <Nombre de la función/aplicación>

## Objetivo
<Qué problema resuelve, para quién, y por qué importa. 2-4 frases.>

## Requisitos
<Lista exacta y verificable de lo que el sistema debe hacer. Cada ítem debe poder marcarse como cumplido o no cumplido sin ambigüedad. Separa requisitos obligatorios de los deseables si los hay.>

## Restricciones
<Tecnología, integraciones, límites, convenciones del repo, requisitos de estilo/marca, cosas explícitamente fuera de alcance.>

## Casos extremos
<Lista de situaciones límite o de error que la construcción debe manejar explícitamente, y qué debe pasar en cada una.>

## Definición de "terminado"
<Lista de verificación concreta y accionable: pasos, comandos, entradas de prueba y resultados esperados que cualquier persona (o el skill /build) pueda usar para confirmar que la construcción cumple la especificación.>
```

No dejes secciones vacías ni con placeholders genéricos — si algo no aplica, dilo explícitamente ("Sin restricciones de tecnología") en vez de omitir la sección.

## Entregar y pasar el relevo a /build

Una vez guardado el archivo:

1. Dile al usuario en una línea dónde quedó guardada la especificación (`specs/<slug>.md`).
2. Invoca inmediatamente el skill `build`, pasándole la ruta del archivo de especificación como argumento, para que comience la construcción a partir de ese documento. No esperes confirmación adicional del usuario para este paso — "cuando tengas toda la info, activa /build" es parte del flujo, no un paso opcional.
