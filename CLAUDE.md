# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a marketing analysis repository that stores AI-generated marketing audits and reports for clients. The primary workflow is running `/market audit` (the `market` skill) to produce a structured Markdown audit report, then committing both the `.md` file and any accompanying PDF export.

## Bootstrap / Install

```bash
# Clone and set up from scratch
./install.sh

# Options
./install.sh --prefix /custom/path   # install location (default: ~/.marketing)
./install.sh --ref feature-branch    # git ref to check out (default: main)
./install.sh --repo https://...      # override repo URL

# Environment variable equivalents
MARKETING_PREFIX=... MARKETING_REF=... MARKETING_REPO_URL=... ./install.sh
```

`install.sh` also auto-detects and runs `pnpm / yarn / npm install` if a `package.json` is present, and `pip install` if `requirements.txt` or `pyproject.toml` is present.

## Report Conventions

Reports follow a fixed Spanish-language structure:

1. **Header block** — URL, date, business type, overall score (e.g. `43/100 (Calificación: D)`)
2. **Data-collection caveat** — note any access restrictions (e.g. HTTP 403 blocking crawlers)
3. **Resumen Ejecutivo** — 3–5 paragraph summary with the three highest-impact actions called out explicitly
4. **Desglose de Puntuación** — weighted scoring table across 6 categories
5. **Victorias Rápidas** (this week) — numbered, each with *Qué hacer / Dónde / Por qué / Impacto: Alto|Medio*
6. **Recomendaciones Estratégicas** (this month)
7. **Iniciativas a Largo Plazo** (this quarter)
8. **Análisis Detallado por Categoría** — one `###` section per scored category with Fortalezas, Debilidades, Recomendaciones
9. **Comparación con Competidores** — comparison table vs. 3–5 named competitors
10. **Resumen de Impacto en Ingresos** — table with monthly USD estimate, confidence, and timeline per recommendation
11. **Próximos Pasos** — 3-step numbered list (immediate / this week / this month)
12. **Footer** — `*Generado por AI Marketing Suite — \`/market audit\`*` plus data sources

## File Naming

| File | Pattern |
|------|---------|
| Markdown audit | `MARKETING-AUDIT.md` (single file, overwritten per client engagement) |
| PDF export | `MARKETING-REPORT-<slug>.pdf` where slug is the domain with dots replaced by hyphens |

## Scoring Model

Six categories, each scored `/100`:

| Category | Weight |
|----------|--------|
| Contenido y Mensajería | 25% |
| Optimización de Conversión | 20% |
| SEO y Visibilidad | 20% |
| Posicionamiento Competitivo | 15% |
| Marca y Confianza | 10% |
| Crecimiento y Estrategia | 10% |

Overall score = sum of (category score × weight). Grade scale: A ≥ 75, B ≥ 60, C ≥ 50, D < 50.
