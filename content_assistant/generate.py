#!/usr/bin/env python3
"""Marketing content assistant for Krash Depot.

Generates ad copy, social posts, and marketing emails using the Claude API.
The brand voice + product catalog context (brand_context.BRAND_GUIDELINES)
rarely changes between calls, so it is sent as a cached system-prompt block
via `cache_control`. Every generation after the first (within the cache TTL)
reads that block from the prompt cache instead of paying full input-token
price for it — see https://docs.claude.com/en/docs/build-with-claude/prompt-caching.

Usage:
    export ANTHROPIC_API_KEY=sk-ant-...
    python generate.py --type social --product "licuadoras KENWOOD" --variations 3
    python generate.py --type ad --product "neveras SANKEY" --platform facebook
    python generate.py --type email --product "temporada de electrodomésticos" --language en
"""

from __future__ import annotations

import argparse
import os
import sys

import anthropic

from brand_context import BRAND_GUIDELINES

DEFAULT_MODEL = "claude-sonnet-5"

CONTENT_TYPE_INSTRUCTIONS = {
    "ad": (
        "Escribe copy publicitario pago (paid ad). Para cada variación entrega: "
        "un titular (max 40 caracteres), texto principal (max 125 caracteres) y "
        "un llamado a la acción. Formatea cada variación numerada."
    ),
    "social": (
        "Escribe una publicación orgánica para redes sociales. Incluye el texto "
        "del post listo para publicar, con emojis moderados y hashtags al final. "
        "Formatea cada variación numerada."
    ),
    "email": (
        "Escribe un email de marketing. Para cada variación entrega: línea de "
        "asunto, preheader corto, y cuerpo del email en viñetas escaneables "
        "terminando en un llamado a la acción claro. Formatea cada variación numerada."
    ),
}

DEFAULT_PLATFORM = {
    "ad": "facebook",
    "social": "facebook/instagram",
    "email": "email",
}


def build_system_blocks() -> list[dict]:
    """Static brand context first, marked as an ephemeral cache breakpoint."""
    return [
        {
            "type": "text",
            "text": BRAND_GUIDELINES,
            "cache_control": {"type": "ephemeral"},
        }
    ]


def build_user_prompt(args: argparse.Namespace) -> str:
    instructions = CONTENT_TYPE_INSTRUCTIONS[args.type]
    platform = args.platform or DEFAULT_PLATFORM[args.type]
    language = "inglés" if args.language == "en" else "español"

    parts = [
        instructions,
        f"Producto o tema: {args.product}",
        f"Plataforma: {platform}",
        f"Cantidad de variaciones: {args.variations}",
        f"Idioma: {language}",
    ]
    if args.tone:
        parts.append(f"Ajuste de tono adicional: {args.tone}")
    return "\n".join(parts)


def generate(args: argparse.Namespace) -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ANTHROPIC_API_KEY is not set. Export it before running this script.")

    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model=args.model,
        max_tokens=1024,
        system=build_system_blocks(),
        messages=[{"role": "user", "content": build_user_prompt(args)}],
    )

    for block in response.content:
        if block.type == "text":
            print(block.text)

    usage = response.usage
    print("\n--- usage ---", file=sys.stderr)
    print(f"input_tokens: {usage.input_tokens}", file=sys.stderr)
    print(f"cache_creation_input_tokens: {usage.cache_creation_input_tokens}", file=sys.stderr)
    print(f"cache_read_input_tokens: {usage.cache_read_input_tokens}", file=sys.stderr)
    print(f"output_tokens: {usage.output_tokens}", file=sys.stderr)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--type", choices=sorted(CONTENT_TYPE_INSTRUCTIONS), required=True, help="Kind of content to generate")
    parser.add_argument("--product", required=True, help="Product, category, or promotion topic")
    parser.add_argument("--platform", help="Target platform (defaults per content type)")
    parser.add_argument("--variations", type=int, default=3, help="Number of variations to generate (default: 3)")
    parser.add_argument("--language", choices=["es", "en"], default="es", help="Output language (default: es)")
    parser.add_argument("--tone", help="Optional extra tone guidance for this specific piece")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model id (default: {DEFAULT_MODEL})")
    return parser.parse_args(argv)


if __name__ == "__main__":
    generate(parse_args())
