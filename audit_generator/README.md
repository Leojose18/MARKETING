# Marketing Audit Generator

Generates a marketing audit report — same methodology and structure as
`MARKETING-AUDIT.md` (the Krash Depot audit) — for any business, using the
Claude API with prompt caching enabled for the scoring rubric.

## Why prompt caching here

`rubric.py` holds the full scoring methodology (six weighted categories,
grading scale, required output structure). That block is identical on every
audit, so `generate_audit.py` sends it as a `cache_control: {"type":
"ephemeral"}` system block. The first audit in a 5-minute window pays the
(slightly higher) cache-write price; every audit after that reads the
rubric from cache at a fraction of the normal input-token cost instead of
re-sending the full methodology each time.

## Setup

```bash
pip install -r ../requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

This tool does not crawl the target site itself — some sites block bots
entirely (as documented in `MARKETING-AUDIT.md` for Krash Depot). Gather
research notes yourself (page text, social profile stats, competitor notes)
into a text/markdown file and pass it in:

```bash
python generate_audit.py \
  --url https://example.com \
  --business-name "Example Store" \
  --business-type "E-commerce retail" \
  --research-file notes.md \
  --output example-audit.md
```

Without `--research-file`, the model will generate the audit structure but
explicitly flag which categories it couldn't evaluate for lack of data,
rather than inventing findings.

Run it for two different businesses back to back and compare the
`cache_read_input_tokens` line printed to stderr on the second run — it
should show a cache hit on the rubric.

### Flags

| Flag | Required | Description |
| --- | --- | --- |
| `--url` | yes | URL of the business being audited |
| `--business-name` | yes | Business name |
| `--business-type` | no | e.g. "E-commerce retail", "SaaS", "Local service" |
| `--research-file` | no | Path to notes/scraped content grounding the audit |
| `--language` | no | `es` (default) or `en` |
| `--output` | no | Path to write the report (default: stdout) |
| `--model` | no | Claude model id (default `claude-sonnet-5`) |
