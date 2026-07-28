# Krash Depot Marketing Content Assistant

Generates ad copy, social posts, and marketing emails for Krash Depot using
the Claude API, with prompt caching enabled for the brand voice / product
catalog context.

## Why prompt caching here

`brand_context.py` holds the Krash Depot brand guidelines (value prop,
catalog, tone, style rules) pulled from `MARKETING-AUDIT.md`. That block is
identical on every call, so `generate.py` sends it as a `cache_control:
{"type": "ephemeral"}` system block. The first call in a 5-minute window
pays the (slightly higher) cache-write price; every call after that reads it
from cache at a fraction of the normal input-token cost instead of
re-sending the full brand context each time.

## Setup

```bash
pip install -r ../requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

```bash
python generate.py --type social --product "licuadoras KENWOOD" --variations 3
python generate.py --type ad --product "neveras SANKEY" --platform facebook
python generate.py --type email --product "temporada de electrodomésticos" --language en
```

Run the script twice in a row (same or different `--product`) and compare
the `cache_read_input_tokens` line printed to stderr — the second call
should show a cache hit on the brand context.

### Flags

| Flag | Required | Description |
| --- | --- | --- |
| `--type` | yes | `ad`, `social`, or `email` |
| `--product` | yes | Product, category, or promotion topic |
| `--platform` | no | Target platform (defaults per content type) |
| `--variations` | no | Number of variations to generate (default 3) |
| `--language` | no | `es` (default) or `en` |
| `--tone` | no | Extra tone guidance for this specific piece |
| `--model` | no | Claude model id (default `claude-sonnet-5`) |
