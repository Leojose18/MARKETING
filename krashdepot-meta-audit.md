# KRASHDEPOT — Meta Ads Audit Report

## Executive Summary

Meta Ads Health Score: 22/100 (Grade: F)

Meta: 22/100

Account: KRASHDEPOT | Platform: Meta / Instagram | Period: Last 30 days
Monthly Budget: $500 USD | Market: Venezuela (Occidente) | Goal: Sales

All 6 campaigns are currently deactivated. Both campaigns use Traffic objective
instead of Sales/Conversions. One campaign sends users to Instagram profile instead
of a sales page. No conversion tracking configured. Total spend analyzed: $328.50.

---

## Critical Issues

- Campaign objective mismatch: All 6 campaigns use Traffic instead of Sales — Meta optimizes for clicks NOT purchases
- Zero active campaigns: Account is completely paused with no live ads running
- No conversion tracking: Without Purchase or Lead events, Meta cannot optimize for sales
- CAPI not configured: 30-40% data loss post-iOS 14.5 with no server-side tracking
- Campaign sending to Instagram Profile: $48.80 spent driving visitors to IG profile with no purchase path
- Over-fragmentation: 6 campaigns at $500/month = ~$55/campaign, below viable learning threshold
- Duplicate campaign detected: "#VenPaKrash SS $15 - Copia" resets learning phase every time it is activated

---

## Quick Wins

- Create new campaign with Sales/Conversions objective (do NOT edit existing Traffic campaigns)
- Install Meta Pixel on website and verify in Events Manager — takes 30 minutes
- Activate CAPI via CAPI Gateway to recover 30-40% of lost conversion data
- Change ad destination from Instagram Profile to website or WhatsApp
- Consolidate all 6 campaigns into 1 campaign with 1 ad set at $16/day
- Configure event deduplication with event_id between Pixel and CAPI
- Set attribution window to 7-day click / 1-day view in ad set settings

---

## Pixel / CAPI Health — 18/100

| ID | Check | Severity | Status | Detail |
|----|-------|----------|--------|--------|
| M01 | Meta Pixel installed | Critical | Warning | Not verifiable — no Events Manager screenshot provided |
| M02 | Conversions API (CAPI) active | Critical | Fail | No server-side events. 30-40% data loss post-iOS 14.5 |
| M03 | Event deduplication | Critical | Fail | No CAPI = no deduplication possible |
| M04 | EMQ Purchase >= 8.5 | Critical | Fail | Purchase event not configured — Traffic campaigns do not track purchases |
| M05 | Domain verification | High | Warning | Cannot confirm — Business Manager not visible |
| M06 | Aggregated Event Measurement (AEM) | High | Fail | Not configured |
| M07 | Standard events vs custom | High | Fail | No conversion events active |
| M08 | CAPI Gateway | Medium | Fail | Not deployed |
| M09 | iOS attribution window 7-day click | High | Fail | Not configured with Traffic objective |
| M10 | Data freshness | Medium | Warning | No events firing in real-time |

---

## Account Structure — 18/100

| ID | Check | Severity | Status | Detail |
|----|-------|----------|--------|--------|
| M11 | Campaign count 1-3 | High | Pass | 2 campaign names visible in first screenshot |
| M12 | CBO vs ABO appropriateness | High | Warning | ABO at ~$11/day total — below $100/day threshold |
| M13 | Learning phase status | Critical | Fail | 100% of ad sets deactivated — account is paused |
| M15 | Advantage+ Sales Campaign | Medium | Fail | Not active. Potential: +22% ROAS / -11.7% CPA |
| M17 | Budget >= $10/day per ad set | High | Fail | ~$1.80/day per ad set after 6-way split |
| M18 | Campaign objective matches goal | High | Fail | ALL 6 campaigns are Traffic — goal is Sales |
| M32 | Advantage+ Creative | Medium | Fail | Not testable — campaigns inactive |
| M35 | Attribution window post-Jan 2026 | High | Fail | Not configured |
| M39 | UTM parameters | Medium | Warning | Not verifiable from screenshot |
| M40 | A/B testing active | Medium | Fail | No active experiments |
| M-ST1 | Budget >= 5x CPA per ad set | High | Fail | No CPA defined and budget fragmented |

---

## Creative Diversity and Fatigue — 30/100

| ID | Check | Severity | Status | Detail |
|----|-------|----------|--------|--------|
| M25 | >= 3 creative formats active | Critical | Warning | Only static image visible in thumbnails — likely 1 format |
| M26 | >= 5 creatives per ad set | High | Warning | Cannot confirm — campaigns paused |
| M27 | 9:16 vertical video for Reels/Stories | High | Fail | No video assets visible |
| M28 | Creative fatigue detection | Critical | Warning | Campaigns paused — fatigue cannot be measured |
| M29 | Hook rate video < 50% skip | High | Fail | No video assets present |
| M30 | Social proof / organic boosting | Medium | Warning | Not visible |
| M31 | UGC content >= 30% | High | Warning | Some UGC-style thumbnails visible but unconfirmed |
| M32 | Advantage+ Creative enabled | Medium | Fail | Not tested |
| M-AN1 | Andromeda creative diversity | Critical | Warning | Near-identical campaign names suggest similar creatives |
| M-CR1 | New creative tested within 21 days | High | Fail | All campaigns paused — no fresh creative |
| M-CR4 | CTR benchmark >= 1% | High | Pass | CPC $0.02-$0.03 in VE market suggests high CTR |

---

## Audience and Targeting — 30/100

| ID | Check | Severity | Status | Detail |
|----|-------|----------|--------|--------|
| M19 | Audience overlap < 20% | High | Warning | 6 campaigns with similar names suggest audience overlap |
| M20 | Custom Audience freshness | High | Fail | No active campaigns = no audience data being collected |
| M21 | Lookalike source quality | Medium | Warning | Cannot confirm without Audiences view |
| M22 | Advantage+ Audience tested | Medium | Fail | Not active |
| M23 | Purchaser exclusions from prospecting | High | Fail | No conversion tracking = no exclusion audiences possible |
| M24 | First-party data uploaded | High | Warning | Not verifiable from screenshot |

---

## Campaign Inventory

| Campaign | Objective | Clicks / Visits | CPC | Spend | Status |
|----------|-----------|-----------------|-----|-------|--------|
| Bajada de Inicial Occidente v1 | Traffic | 2,434 link clicks | $0.0278 | $67.58 | Deactivated |
| Bajada de Inicial Occidente v2 | Traffic | 4,697 link clicks | $0.0300 | $141.09 | Deactivated |
| #NuevoEnKrashDepot Vzla v1 | Traffic | 3,127 link clicks | $0.0227 | $71.03 | Deactivated |
| Beneficios Krash Occidente | Traffic | 2,395 IG profile visits | $0.0204 | $48.80 | Deactivated |
| #NuevoEnKrashDepot Vzla v2 | Traffic | 0 (never spent) | $0.00 | $0.00 | Never run |
| #VenPaKrash SS $15 Copia | Traffic | — | — | — | Deactivated |

---

## Performance Benchmarks

| Metric | KRASHDEPOT | Meta LatAm Benchmark | Status |
|--------|-----------|----------------------|--------|
| CPC (link clicks) | $0.022–$0.030 | $0.03–$0.08 | Pass |
| Campaign objective | Traffic | Sales/Conversions | Fail |
| Active campaigns | 0 | >= 1 | Fail |
| CAPI active | No | Required | Fail |
| Creative formats | 1 (est.) | >= 3 | Fail |
| Budget per ad set/day | ~$1.80 | >= $10 | Fail |

---

## Recommended Account Structure

| Element | Current | Recommended |
|---------|---------|-------------|
| Campaigns | 6 (all paused) | 1 active |
| Objective | Traffic | Sales or Leads |
| Ad Sets | 6+ fragmented | 1 consolidated |
| Daily budget | ~$11 split 6 ways | $16/day in 1 ad set |
| Ad destination | Website + IG Profile | Website or WhatsApp |
| Creative formats | 1 (image) | 3 (image, video, carousel) |
| Pixel + CAPI | Not confirmed | Required |

---

## Priority Action Plan

| Priority | Action | Time | Impact |
|----------|--------|------|--------|
| Critical | Create new Sales campaign — do NOT reuse Traffic campaigns | 15 min | High |
| Critical | Install and verify Meta Pixel on website | 30 min | High |
| Critical | Activate CAPI Gateway | 15 min | High |
| Critical | Change ad destination — remove IG Profile campaigns | 10 min | High |
| High | Consolidate 6 campaigns into 1 ad set at $16/day | 20 min | High |
| High | Configure Purchase or Lead conversion event | 20 min | High |
| High | Add vertical video (9:16) for Reels and Stories placement | 1-2 days | Medium |
| High | Set attribution window 7-day click / 1-day view | 2 min | Medium |
| Medium | Test Advantage+ Audience vs manual targeting | 1 week | Medium |
| Medium | Add UTM parameters to all ad URLs | 5 min | Medium |

---

## Special Ad Category Warning

Campaigns reference installment plans (Cuotas), down payment reductions (Bajada de Inicial),
and payment modes. If KRASHDEPOT offers financing, credit, or installment products, the
Financial Products Special Ad Category (enforced by Meta since January 2025) must be declared
before campaign creation. Failure to declare results in campaign disapproval.
Restrictions include: no ZIP code targeting, age 18-65+ only, no Lookalike Audiences.
