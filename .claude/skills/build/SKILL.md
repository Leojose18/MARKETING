---
name: build
description: Implementa en el repositorio una funcionalidad a partir de una especificación ya escrita en specs/<archivo>.md — típicamente invocado automáticamente por el skill /spec al terminar la entrevista, o directamente por el usuario con /build cuando ya existe un archivo de especificación. Lee el archivo de specs/, construye siguiendo exactamente sus requisitos y restricciones, maneja los casos extremos que enumera, y verifica el trabajo contra su sección "Definición de terminado" antes de darlo por concluido. No lo uses para tareas que no tienen una especificación en specs/ — para eso, corre primero /spec.
---

# Build

Este skill construye a partir de una especificación ya escrita, no a partir de una idea suelta. Si no hay una especificación clara que seguir, este no es el skill correcto — sugiere `/spec` primero.

## Encontrar la especificación

- Si te pasaron una ruta explícita (por ejemplo, porque `/spec` te invocó justo después de guardar `specs/<slug>.md`), úsala directamente.
- Si no te dieron una ruta, mira el directorio `specs/`. Si hay un único archivo `.md`, úsalo. Si hay varios, pregunta al usuario cuál construir — no adivines cuál es el más reciente ni el más relevante.
- Si `specs/` no existe o está vacío, dile al usuario que no hay ninguna especificación guardada y sugiere correr `/spec` primero.

## Antes de construir

Lee la especificación completa antes de escribir código. Presta atención especial a:

- **Restricciones**: tecnología obligatoria o prohibida, convenciones del repo existente, límites de alcance. Revisa el código ya existente en el repo (estructura de carpetas, estilo, dependencias declaradas en `requirements.txt`/`package.json`/etc.) para que lo nuevo encaje con lo que ya hay, en vez de introducir un patrón distinto sin necesidad.
- **Casos extremos**: son parte del contrato, no un extra. Constrúyelos junto con el camino feliz, no como una pasada de pulido al final.

Si al leer la especificación encuentras algo genuinamente ambiguo o contradictorio (no simplemente una decisión de implementación que te corresponde tomar a ti), pregunta al usuario antes de construir sobre esa parte — no rellenes el hueco con una suposición silenciosa que después no se pueda verificar contra la Definición de terminado.

## Construir

Implementa los requisitos de la especificación. Sigue las prácticas normales de buen código: no agregues alcance que la especificación no pidió, no dejes implementaciones a medias, reutiliza lo que ya exista en el repo en vez de duplicarlo.

## Verificar contra la Definición de terminado

Antes de reportar la tarea como completa, recorre cada punto de la sección "Definición de terminado" de la especificación uno por uno y confirma explícitamente si se cumple. Si el punto describe un comando o una prueba concreta, ejecútala de verdad y muestra el resultado — no la des por buena solo porque el código "debería" funcionar. Si algún punto no se puede cumplir tal como está escrito (por ejemplo, requiere un servicio externo no disponible en este entorno), dilo explícitamente en vez de omitirlo en silencio.

Reporta al usuario un resumen breve: qué se construyó, y el estado de cada ítem de la Definición de terminado (cumplido / no cumplido y por qué).
