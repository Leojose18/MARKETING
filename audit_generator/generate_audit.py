#!/usr/bin/env python3
"""Marketing audit generator.

Produces a marketing audit report (same methodology/structure as
MARKETING-AUDIT.md) for a given business, using the Claude API. The scoring
rubric + output format (rubric.AUDIT_RUBRIC) never changes between runs, so
it's sent as a cached system-prompt block via `cache_control`. Every audit
generated after the first (within the cache TTL) reads that block from the
prompt cache instead of paying full input-token price for it — see
https://docs.claude.com/en/docs/build-with-claude/prompt-caching.

This tool does not crawl the target site itself (many sites block bots, as
noted in the Krash Depot audit). Feed it research notes — scraped page text,
social profile data, competitor notes — via --research-file, and Claude will
synthesize the audit from that material.

Usage:
    export ANTHROPIC_API_KEY=sk-ant-...
    python generate_audit.py \\
        --url https://example.com \\
        --business-name "Example Store" \\
        --business-type "E-commerce retail" \\
        --research-file notes.md \\
        --output example-audit.md
"""

from __future__ import annotations

import argparse
import os
import sys

import anthropic

from rubric import AUDIT_RUBRIC

DEFAULT_MODEL = "claude-sonnet-5"


def build_system_blocks() -> list[dict]:
    """Static rubric + output format first, marked as an ephemeral cache breakpoint."""
    return [
        {
            "type": "text",
            "text": AUDIT_RUBRIC,
            "cache_control": {"type": "ephemeral"},
        }
    ]


def build_user_prompt(args: argparse.Namespace, research_notes: str) -> str:
    language = "inglés" if args.language == "en" else "español"
    parts = [
        f"Nombre del negocio: {args.business_name}",
        f"URL: {args.url}",
        f"Tipo de negocio: {args.business_type or 'no especificado'}",
        f"Idioma de salida: {language}",
    ]
    if research_notes.strip():
        parts.append("\nNotas de investigación disponibles:\n" + research_notes.strip())
    else:
        parts.append(
            "\nNo se proporcionaron notas de investigación. Genera la auditoría "
            "señalando explícitamente qué categorías no pudiste evaluar con "
            "confianza por falta de datos, en vez de inventar hallazgos."
        )
    parts.append("\nGenera la auditoría completa siguiendo la metodología del system prompt.")
    return "\n".join(parts)


def generate(args: argparse.Namespace) -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ANTHROPIC_API_KEY is not set. Export it before running this script.")

    research_notes = ""
    if args.research_file:
        try:
            with open(args.research_file, "r", encoding="utf-8") as f:
                research_notes = f.read()
        except OSError as e:
            sys.exit(f"Could not read --research-file: {e}")

    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model=args.model,
        max_tokens=4096,
        system=build_system_blocks(),
        messages=[{"role": "user", "content": build_user_prompt(args, research_notes)}],
    )

    report_text = "\n".join(block.text for block in response.content if block.type == "text")

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(report_text)
        print(f"Audit written to {args.output}", file=sys.stderr)
    else:
        print(report_text)

    usage = response.usage
    print("\n--- usage ---", file=sys.stderr)
    print(f"input_tokens: {usage.input_tokens}", file=sys.stderr)
    print(f"cache_creation_input_tokens: {usage.cache_creation_input_tokens}", file=sys.stderr)
    print(f"cache_read_input_tokens: {usage.cache_read_input_tokens}", file=sys.stderr)
    print(f"output_tokens: {usage.output_tokens}", file=sys.stderr)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--url", required=True, help="URL of the business being audited")
    parser.add_argument("--business-name", required=True, help="Business name")
    parser.add_argument("--business-type", help='e.g. "E-commerce retail", "SaaS", "Local service"')
    parser.add_argument("--research-file", help="Path to a text/markdown file with scraped content, social data, or research notes")
    parser.add_argument("--language", choices=["es", "en"], default="es", help="Output language (default: es)")
    parser.add_argument("--output", help="Path to write the generated audit (default: print to stdout)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model id (default: {DEFAULT_MODEL})")
    return parser.parse_args(argv)


if __name__ == "__main__":
    generate(parse_args())
