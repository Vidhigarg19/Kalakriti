# Kalakriti+

**A Zero-Typing AI Cataloging and Selling Assistant for Artisans**

> Smart India Hackathon 2026 — Problem Statement SIH26090
> Ministry of Social Justice & Empowerment (MoSJE)

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange)]()
[![PS Number](https://img.shields.io/badge/PS-26090-blue)]()
[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()

---

## 📖 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Our Differentiator](#our-differentiator)
- [How It Works (MVP Closed Loop)](#how-it-works-mvp-closed-loop)
- [Key Features](#key-features)
- [Pricing Methodology](#pricing-methodology)
- [AI Guardrails](#ai-guardrails)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Design Direction](#design-direction)
- [Trust & Verification](#trust--verification)
- [Data Privacy](#data-privacy)
- [Onboarding Strategy](#onboarding-strategy)
- [Business Model](#business-model)
- [Measuring Success (KPIs)](#measuring-success-kpis)
- [MVP vs Future Scope](#mvp-vs-future-scope)
- [License](#license)

---

## Overview

**Kalakriti+** is a zero-typing AI cataloging and selling assistant for marginalized artisans and weavers. Instead of requiring photography skills, English writing ability, or e-commerce knowledge, artisans simply **show their product and speak about it** — the platform's AI handles enhancement, listing, and pricing, then publishes it to Kalakriti+'s own catalog where buyers can discover and inquire directly.

Built for artisans who currently depend on occasional government-organized fairs (Shilp Samagam, Surajkund Mela, Dilli Haat) for income, Kalakriti+ gives them continuous access to a digital sales channel.

---

## Problem Statement

Government-supported artisans and micro-entrepreneurs struggle to transition to digital commerce due to:

- Low digital literacy
- Language barriers (limited English proficiency)
- Lack of technical skills to photograph, price, and catalog products professionally

As a result, they remain dependent on periodic physical exhibitions instead of having continuous market access — despite receiving financial support to build their craft businesses.

---

## Our Solution

Kalakriti+ removes every technical barrier between *"I made something beautiful"* and *"it's listed for sale online."*

An artisan shows their product and speaks about it in their own regional language. Kalakriti+'s AI:
1. Enhances the photo (background, lighting, crop — not the product itself)
2. Extracts stated product facts and generates a bilingual (English/Hindi), SEO-friendly listing
3. Suggests a defensible price **range** based on comparable products and stated attributes
4. Publishes to Kalakriti+'s own catalog, where buyers can discover the product and send an inquiry/order

No typing. No English required. No design skills needed.

---

## Our Differentiator

We don't teach artisans to become e-commerce sellers. **We make e-commerce adapt to the way artisans naturally communicate.**

**Traditional e-commerce onboarding:**
`TYPE → WRITE → EDIT PHOTO → PRICE → LIST`

**Kalakriti+:**
`SHOW → SPEAK → AI → CONFIRM → SELL`

> We don't claim to be the only platform addressing artisan digital literacy — our differentiation is this specific zero-typing, photo-and-voice-only workflow, combined end-to-end in one seamless flow rather than as separate disconnected tools.

---

## How It Works (MVP Closed Loop)

Earlier drafts of this project ended at "published listing → marketplace / B2B / govt e-marketplace" — which isn't an actual implementation plan. The MVP below is a **complete closed loop**, with external marketplace integrations explicitly scoped as future work.

```
Artisan visits website
   → Takes/uploads product photo
      → AI enhances (background, lighting, crop — product itself untouched)
   → Records voice note (regional language)
      → Speech-to-text → Fact extraction (type, material, color, size, technique, origin, artisan's story)
      → AI generates bilingual listing from extracted facts only
   → Pricing engine suggests a price RANGE based on comparable products + stated attributes
   → Artisan reviews: original transcript + generated listing + facts used + price range
      → Can edit fields or re-record voice note before approving
   → Artisan confirms → Published to Kalakriti+ Catalog
   → Buyer browses catalog → sends inquiry/order
   → Artisan receives and responds to inquiry
```

**Future (not MVP):** direct GeM integration, B2B buyer API connections, other marketplace syndication.

---

## Key Features

### Core (MVP)

| Feature | Description |
|---|---|
| **AI Photo Enhancement** | Background removal, lighting correction, crop, sharpness — restricted to presentation only, never alters product color/geometry/material |
| **Voice-to-Listing (Multilingual)** | Converts a regional-language voice note into a structured set of product facts, then a bilingual (English/Hindi) SEO-friendly description generated only from those facts |
| **Price Range Suggestion** | Compares stated attributes against reference/comparable product data to suggest a defensible price range, not a single "correct" price |
| **Listing Review & Approval** | Artisan sees original transcript + extracted facts + generated listing + price range, can edit or re-record before publishing |
| **Kalakriti+ Catalog** | Own marketplace where published listings are discoverable by buyers |
| **Buyer Inquiry/Order Flow** | Buyers browsing the catalog can send a direct inquiry or order request to the artisan |
| **Artisan Profile** | Name, craft story, location/cluster, verification status — builds buyer trust |

### Planned / Future Scope

| Feature | Description |
|---|---|
| GeM / B2B marketplace integration | Direct connection to government e-marketplace and larger B2B buyers |
| Offline-first capture | Capture photo/voice offline, sync when connectivity returns |
| Payments & logistics integration | Currently scoped as inquiry/order coordination only in MVP |
| Sales analytics dashboard | Views, inquiries, conversion, repeat buyers |
| Bhashini integration | Government-built multilingual AI as a future upgrade path |
| Additional regional languages | Expand beyond initial launch language set |

---

## Pricing Methodology

We do not claim a trained ML pricing model unless one is actually built and validated. The MVP pricing approach is a transparent, explainable methodology:

```
Product attributes (material, size, craft technique, complexity)
        ↓
Comparable products (reference price dataset)
        ↓
Adjustment factors (production effort, regional market context)
        ↓
Suggested price RANGE (never a single number)
```

**Example:**
> Similar terracotta products: ₹900–₹1,400
> Estimated production/material adjustment: +₹150
> **Suggested selling range: ₹1,100–₹1,350**

> **AI provides decision support, not a guaranteed market price.** The artisan always retains final control over the listed price.

---

## AI Guardrails

A key risk: voice-generated descriptions could invent details the artisan never said (wrong material, false certifications, invented origin claims). Kalakriti+ prevents this with a strict fact-extraction boundary:

```
Voice Input
     ↓
Fact Extraction (structured fields only):
  • Product type
  • Material
  • Color
  • Size
  • Craft technique
  • Location
  • Artisan-provided story
     ↓
AI Description (generated ONLY from extracted facts — no invented claims)
     ↓
Fact validation (shown to artisan for confirmation)
     ↓
Artisan approval
     ↓
Publish
```

This also applies to photo enhancement: AI is restricted to **background removal, lighting correction, cropping, and sharpness** — it does not regenerate or alter the product's actual appearance, color, or geometry. This is positioned as **AI-assisted product photography enhancement**, not product image generation.

---

## Tech Stack

*Chosen for AI-assisted ("vibe coding") development — fewer moving pieces, well-documented tools, fast integration, and an AI abstraction layer so no single API is a single point of failure.*

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React + Vite | Team's strongest existing skillset, fast build/iteration cycle |
| **Styling/UI** | Tailwind CSS + shadcn/ui | Pre-built, customizable components — fast to style with the project's earthy color palette |
| **Backend logic / Secure API calls** | Supabase Edge Functions | Keeps API keys server-side (Claude, remove.bg, Google) without standing up a separate backend server |
| **Database, Auth, Storage** | Supabase | One tool covers database, artisan/buyer accounts, and image storage |
| **Photo Enhancement** | remove.bg API | Background removal only — no product regeneration |
| **Speech-to-Text + Translation** | Google Cloud Speech-to-Text + Google Translate API | Widely documented, reliable for AI-assisted integration |
| **Fact Extraction + Listing Generation** | Claude API | Extracts structured facts from transcript, then generates description strictly from those facts |
| **Pricing Suggestion** | Claude API (prompted with attributes + reference price dataset) | Transparent, explainable range — not an opaque trained model |
| **Hosting** | Vercel (frontend) + Supabase (backend/edge functions) | Fast, low-config deployment |

**AI abstraction layer:** all external AI calls route through a single internal service layer, so any individual API (pricing, translation, image enhancement) can be swapped without touching the rest of the app if one becomes unreliable, rate-limited, or too costly at scale.

---

## System Architecture

```
                     ARTISAN
                        │
              ┌─────────┴─────────┐
              ↓                   ↓
          📷 PHOTO             🎙️ VOICE
              │                   │
              ↓                   ↓
        IMAGE AI            SPEECH + LANGUAGE AI
     (enhancement only)      (transcription + translation)
              │                   │
              └─────────┬─────────┘
                        ↓
                 FACT EXTRACTION
              (structured fields only)
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
       DESCRIPTION AI        PRICING ENGINE
      (facts → listing)    (comparables → range)
              │                   │
              └─────────┬─────────┘
                        ↓
                LISTING PREVIEW
           (transcript + facts + listing + price shown)
                        ↓
                ARTISAN APPROVAL
                        ↓
              KALAKRITI+ CATALOG
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
           BUYERS            B2B BUYERS
        (inquiry/order)      (future: GeM/API)
```

---

## Design Direction

**Mood/Vibe:** Warm & handmade — earthy, craft-authentic, boutique-studio feel. The site should feel like it was made *with* artisans, not just *for* them.

**Interaction principle:** the entire artisan-facing flow is reducible to **3 primary actions** — Camera → Mic → Confirm — with large buttons and voice guidance/tutorials, since zero-typing doesn't automatically mean zero digital-literacy friction.

**Color Palette:**

| Role | Color | Hex (approx.) |
|---|---|---|
| Background | Warm Ivory | `#F0EAE0` |
| Secondary background | Warm Taupe | `#C4B7A6` |
| Primary accent | Terracotta | `#C1502E` |
| Secondary accent | Olive Green | `#5C6E4A` |
| Text / Headers | Walnut Brown | `#3D2B1F` |

**References:** None — fully original visual direction.

---

## Trust & Verification

Buyers browsing handmade products from unfamiliar sellers need reasons to trust a listing. Each artisan profile includes:

- Name, craft story, location/cluster
- Optional verified status (via artisan cluster/SHG/organization or document verification)
- Material, dimensions, production time, and authenticity information per listing

This also addresses seller-authenticity risk — verification is tied to cluster/organization partnerships, not self-declaration alone.

---

## Data Privacy

- Authentication for artisan and buyer accounts
- Encrypted data in transit
- Minimal data collection — only fields required for listing and contact
- Role-based access (artisan, buyer, admin)
- Secure storage via Supabase, with deletion/consent controls for artisan data

---

## Onboarding Strategy

"Just visit the website" is not a realistic onboarding path for this target audience. Kalakriti+'s onboarding is designed around **assisted onboarding**, not self-serve discovery:

- Partnerships with artisan clusters, Self-Help Groups (SHGs), government skilling programs, and NGOs
- On-ground or assisted first-listing sessions during onboarding
- In-app voice guidance/tutorials for repeat use afterward

---

## Business Model

**Initial model (MVP-aligned):**
- Government/NGO/cluster-sponsored onboarding (no cost to artisan)
- Small transaction commission on completed sales through the platform

**Future revenue (not MVP):**
- Premium analytics or catalog placement for artisans/clusters wanting more visibility
- B2B/bulk order facilitation fees once GeM/B2B integrations exist

This addresses the marketplace chicken-and-egg problem by building catalog supply first through cluster/government partnerships, before pursuing broader buyer acquisition.

---

## Measuring Success (KPIs)

Rather than claiming unproven outcomes like "increases artisan income," Kalakriti+ measures what the MVP can actually demonstrate, with income impact reserved for future pilot validation:

| Metric | Current (Manual Process) | Target (Kalakriti+) |
|---|---:|---:|
| Time to create a listing | Manual, hours | < 2 minutes |
| Typing required | High | **0** |
| Languages supported | Limited | Hindi + English |
| Photo editing | Manual/none | AI-assisted |
| Pricing approach | Guesswork | Suggested range |
| Selling channel | Periodic fairs | Continuous digital catalog |

Additional KPIs to track post-launch: listings created, listing completion/approval rate, buyer inquiries per listing, inquiry-to-order conversion, repeat artisan usage.

> Income improvement claims will be validated through pilot deployment data, not asserted upfront.

---

## MVP vs Future Scope

**MVP — Kalakriti+ = a zero-typing AI cataloging and selling assistant for artisans:**

1. 📷 Take/upload photo
2. 🎙️ Speak in regional language
3. ✨ AI enhances photo (presentation only)
4. 📝 AI extracts facts → generates bilingual listing
5. ₹ AI suggests a price range
6. 👤 Artisan reviews and approves
7. 🛍️ Publish to Kalakriti+ Catalog
8. 📩 Buyer inquiry/order

**Future Scope (explicitly out of MVP):**
- GeM and B2B marketplace API integrations
- Payments and logistics
- Offline-first capture
- Bhashini integration
- Analytics dashboard
- Additional regional languages
- Community/cluster features

---


<p align="center">Built for SIH 2026 — Helping every artisan's craft find its market, every day of the year.</p>
