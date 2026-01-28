# Strony Internetowe — Pillar Page Strategy

> **Project:** KryptoSEO  
> **Last Updated:** 2026-01-28  
> **Status:** In Progress — Hero Section Update  
> **URL:** `/pl/programowanie/strony-internetowe`

---

## Overview

The "Strony Internetowe" page is being transformed into a **pillar page** — a high-value, lead-generating "winner" URL that will anchor the content spider-web strategy for Kryptonum's 2026 SEO push.

### Strategic Context

Based on the SEO diagnosis (January 2026):

- **Problem:** Kryptonum has strong domain authority (DR ~49) but no strong individual pages. High impressions, low CTR (0.2–0.3%).
- **Solution:** Create focused pillar pages that consolidate authority, attract backlinks, and convert visitors into leads.
- **3 Pillars for 2026:**
  1. Strony Internetowe (websites)
  2. Sklepy Internetowe (e-commerce)
  3. Marketing

This document focuses on **Pillar 1: Strony Internetowe**.

---

## Page Architecture

### Funnel Structure

| Stage                       | Sections                                           | Goal                                 |
| --------------------------- | -------------------------------------------------- | ------------------------------------ |
| **TOFU** (Top of Funnel)    | Hero, Social Proof, Diagnoza, Scenariusze          | Interest + Understanding             |
| **MOFU** (Middle of Funnel) | Jak Dowozimy, Case Studies, Break CTA, Technologie | Trust + Proof + Mechanism            |
| **BOFU** (Bottom of Funnel) | Timeline/Współpraca, FAQ, Kontakt                  | Decision + Risk Reduction + CTA      |
| **Post-BOFU**               | Blog Hub                                           | Nurture (for those not buying today) |

---

## Section-by-Section Architecture

### 1. Hero Section (UPDATED STRATEGY)

**Component:** `NetworkedShowcase.astro` (extended with backwards-compatible flags)

**Goal:** In 10–12 seconds, the user understands the difference: "a sales system, not a business card" + knows what to do next.

#### Backwards Compatibility

The component will remain fully backwards compatible via boolean flags:

| Flag            | Default | Effect                                                                              |
| --------------- | ------- | ----------------------------------------------------------------------------------- |
| `showVideo`     | `false` | When `false`: show existing networked services. When `true`: show vertical video    |
| `showCityLinks` | `false` | When `false`: no cities shown. When `true`: show infinite scroll ticker with cities |

#### Layout (When Video Mode Enabled)

**Left side (header):**

- Tags (animated vertical slider) — existing
- Status pill — existing
- Heading (H1, catchy, 1 sentence) — framing "website as a system"
- Paragraph (1–2 sentences) — custom + headless CMS + UX/SEO/analytics from the start
- **2 CTAs:**
  - Primary: "Umów darmową konsultację" → `#kontakt`
  - Secondary: "Zobacz realizacje" → `#case-studies`
- Google Rating — existing
- **Cities infinite scroll ticker** (when `showCityLinks: true`)

**Right side:**

- **Vertical video** (9:16 aspect ratio, TikTok-style)

#### Video Specifications

| Property               | Value                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| **Aspect Ratio**       | 9:16 (vertical/TikTok format)                                         |
| **Desktop Position**   | Right column, max-width ~320px                                        |
| **Mobile Behavior**    | Full width, below heading+CTA (heading+CTA must stay above the fold)  |
| **Initial State**      | Auto-loop preview (configurable 5–7s segment, muted)                  |
| **On Click (Desktop)** | Open modal/lightbox, play full with audio                             |
| **On Click (Mobile)**  | Play inline with native controls, audio enabled                       |
| **Styling**            | Gradient border (`--primary-gradient-400`), subtle glow effect behind |

#### Why Vertical Video?

- TikTok/Reels format grabs attention in 2026
- Shows real people talking (builds trust)
- Preview loop creates curiosity → click to watch full
- Works great on mobile (full-width takeover)

#### Cities Infinite Scroll

| Property              | Value                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| **Display**           | Can show 8 cities, only link 3 (configurable per-city)                       |
| **Linked cities**     | Underline animation on hover (matches `.link` class), scroll pauses on hover |
| **Non-linked cities** | Plain text, lower opacity (0.6), no interaction                              |
| **Animation**         | Smooth infinite horizontal scroll, pauses when hovering linked cities        |
| **Purpose**           | SEO internal linking to local pages (Warszawa, Łódź, Kraków to start)        |

---

### 2. Social Proof Bar

**Component:** Existing (no changes for MVP)

**Content:**

- Logo bar (6–10 strong clients, curated)
- Monochrome/muted for consistency
- No buttons, no links (don't pull from funnel)
- Optional label: "Zaufali nam" / "Pracowaliśmy dla"

**Reference:** Third component on [kryptonum.eu/pl](https://kryptonum.eu/pl)

---

### 3. Diagnoza (Symptoms) — NEW COMPONENT

**Goal:** Quick "that's me" recognition + engaging format (click/expand), no wall of text.

**Layout:**

- Panel: "Check-up Twojej strony"
- 6 symptom chips (short headlines)
- On click: Expanded panel with:
  - 1 sentence consequence (business impact)
  - 3 short bullet points "Co to zwykle oznacza"

**Example:**

> **Symptom:** "Mamy ruch, ale brak zapytań"
>
> **Consequence:** Ruch jest, ale strona nie prowadzi do decyzji — więc przepalasz budżet i czas.
>
> **What it usually means:**
>
> - Brakuje ścieżki „co dalej" (CTA jest za późno albo ginie w treści)
> - Treść nie odpowiada na realne pytania użytkownika („czy to dla mnie?")
> - Dowody (case'y/liczby) pojawiają się dopiero wtedy, kiedy user już wyszedł

**Below the panel:** Mini-diagram showing:

- "Strona jako projekt" → ✗
- "Strona jako system" → ✓
- 4 pillars: UX/IA • Content/SEO • Analityka • CMS/Performance

---

### 4. Scenariusze (After Diagnosis)

**Component:** `Rich List and CTA` (existing in Sanity)

**Goal:** Translate symptoms from section 3 into 3–4 common business directions (effect language).

**Format:**

- Left column (sticky): Heading + 1 sentence intro
- Right column: 4 static cards (no accordions, no clicks)

**Cards:**

1. **Strona, która dowozi leady** (B2B sales)
2. **Wzrost przez SEO i content** (spider-web)
3. **Ekspansja / wielojęzyczność** (new markets)
4. **Integracje i mierzalność** (CRM / automations)

**Each card contains:**

- 1-line description (business language)
- "Naprawia:" 2–3 chips referencing symptoms from section 3
- "Odblokowuje:" 2–3 chips of effects (business outcomes)

---

### 5. Jak Dowozimy (How We Deliver)

**Component:** `Grouped Elements` (existing in Sanity)

**Goal:** Show the delivery mechanism in 2 clear blocks (decisions → execution).

**Format:** 2 large cards side by side (desktop) / stacked (mobile)

**Layer A: Fundament (Decisions That Make a Difference)**

- Information architecture and user paths for conversion
- Content/SEO plan (spider-web + priorities) BEFORE "pretty design"
- Measurement plan: goals, events, lead definitions
- Quality criteria and scope — what must the site deliver

**Layer B: Dowiezienie (Implementation That Doesn't Limit Growth)**

- Implementation and UX in code — no tool compromises
- Headless CMS and content model for painless scaling
- Performance / stability / security as standard
- Ready for iteration: easy changes, tests, growth

---

### 6. Case Studies — NEW COMPONENT

**Goal:** Hard proof of quality and results before moving forward.

**Format:** 3 large cards (Audiofast / Fabryka Atrakcji / SITS) stacked vertically (no slider)

**Each card structure:**

1. Large visual (1 main screenshot in context)
2. Result-focused headline (catchy, about the effect)
3. Short text (2–3 sentences): Problem → Solution → Effect (business language)
4. Metrics (2–3 max) as small chips (credible and specific)
5. Client opinion (1–2 sentence quote; expand for full version optional)
6. Micro-row (optional):
   - City badge (if applicable; micro-link to location page)
   - Mini tech icons (3–5 max, very subtle)
7. CTA: "Zobacz case study" button (to full case page)

**Note:** Audiofast doesn't have a Case Study page yet — needs to be created.

---

### 7. Pill CTA (Break CTA after cases)

**Component:** Existing (large button CTA with full-width image)

**Goal:** Catch users "warmed up" after case studies and give them a simple step to contact.

---

### 8. Technologie & CMS

**Component:** Existing (no COPY changes for now)

**Goal:** Technical authority without "logo wall" chaos.

**Future:** Create technology hub (/technologie) with individual pages for Next.js, Astro, Sanity, etc.

---

### 9. Timeline / Współpraca

**Component:** `Stages Accordion` (existing)

**Goal:** Defuse "how long does it take" and calm the collaboration process.

**Format:**

- Heading + 1 intro sentence
- Time range: "Typowo 6–12 tygodni"
- 3 scope variables as chips: integracje / liczba typów podstron / migracja & języki
- 4 tabs (one visible at a time):
  - Strategia
  - Branding
  - Design
  - Development

**Each tab contains:**

- Layer A (default): 1 sentence "why this module" + 3 bullet points "what we do" + 1 line "what you get"
- Layer B (collapsible): "What it depends on / what usually blocks" (2–3 points)

**Rules:**

- 3–5 stages max
- Effect language, not ceremony/process lists
- No external CTAs

---

### 10. FAQ

**Component:** Existing (no video for now)

**Goal:** Close objections in scannable format.

**Rules:**

- Max 10 questions
- Use existing FAQ from Sanity for now
- Add more as needed later
- Video FAQ is a future enhancement

---

### 11. Kontakt (Contact)

**Component:** Existing (no changes for now, but COPY needs adjustment)

**Content:**

- Photo + contact data (tel/email)
- Contact form (main CTA)
- 3 bullet points: "Co dostaniesz po kontakcie" (fit + levers + next step)

**Copy needs:** Adjust to match user journey on this pillar page.

---

### 12. Lokalizacyjne HUB

**Status:** OUT for now

Local pages will be linked from the Hero section infinite scroll instead.

---

### 13. Blog HUB

**Component:** Existing blog section (needs expansion)

**Changes needed:**

- Add support for more than 2 articles
- Copy adjustment for user journey
- Priority: Articles related to this pillar page (biggest context)

**Format:**

- Carousel 6–10 slots (dynamically from CMS)
- Each slot: title + 1 line "why it's worth reading"
- No dates/authors
- Text links only (no CTA buttons)

---

## Component Status Summary

| #   | Section          | Status      | Notes                                                               |
| --- | ---------------- | ----------- | ------------------------------------------------------------------- |
| 1   | Hero             | 🟡 UPDATE   | Extend `NetworkedShowcase` with `showVideo` + `showCityLinks` flags |
| 2   | Social Proof Bar | 🟢 Existing | No changes for MVP                                                  |
| 3   | Diagnoza         | 🔴 NEW      | New interactive symptom-check component                             |
| 4   | Scenariusze      | 🟢 Existing | Use `RichListAndCtaBox` from Sanity                                 |
| 5   | Jak Dowozimy     | 🟢 Existing | Use `GroupedElements` from Sanity                                   |
| 6   | Case Studies     | 🔴 NEW      | New vertical card layout with glow effects                          |
| 7   | Pill CTA         | 🟢 Existing | Use `PillCtaSection`                                                |
| 8   | Technologie      | 🟢 Existing | No COPY changes for now                                             |
| 9   | Timeline         | 🟢 Existing | Use `StagesAccordion`                                               |
| 10  | FAQ              | 🟢 Existing | Use existing FAQ, max 10 questions                                  |
| 11  | Kontakt          | 🟢 Existing | COPY adjustment needed for user journey                             |
| 12  | Lokalizacje HUB  | ⚫ OUT      | Cities moved to Hero infinite scroll                                |
| 13  | Blog HUB         | 🟡 UPDATE   | Support more than 2 articles                                        |

---

## Roadmap (SEO Team Roles)

### Oliwier (Architecture & Implementation)

- [x] Information architecture for Pillar 1 (this document)
- [ ] **TODAY:** Update Hero section
- [ ] Update Blog section
- [ ] Integrate ready content, video, and design to Staging
- [ ] Navigation changes (Header/Footer) at publish time

### Kuba (Content & Video)

- [ ] Brain dump for local pages
- [ ] Hero video recording
- [ ] FAQ video recording (scripts from Aneta)

### Aneta (Copywriting)

- [ ] Full copy for Pillar 1
- [ ] Local pages copy
- [ ] Video scripts

### Sasha (Design & UI)

- [ ] Design new modules (video, case studies, contact)
- [ ] Hub page design
- [ ] New Header/Footer design

---

## Technical Implementation Notes

### Design Tokens Reference

All styling must use the established CSS variables from `packages/shared/src/global.scss`:

```scss
// Backgrounds
--neutral-900: #000103; // Primary background (near-black)
--neutral-800: #202025; // Elevated surfaces
--neutral-200: #f0f7f7; // Primary text (off-white)

// Primary palette (teal range)
--primary-500: #064040; // Borders, subtle accents
--primary-600: #042b2b; // Card backgrounds
--primary-700: #021d1d; // Darker surfaces
--primary-900: #001414; // Deepest teal-black

// Gradients
--primary-gradient-400: linear-gradient(266deg, #2dd282, #90f4e8); // Accent gradient
--primary-gradient-900: linear-gradient(266deg, #0b0f0d, #011310, #001f1b); // Dark gradient for cards

// Animation
--easing: cubic-bezier(0.08, 0.82, 0.17, 1); // Smooth, slightly springy

// Typography
--typography-body-m: 0.875rem; // 14px - buttons, small text
--typography-body-s: 0.75rem; // 12px - tags, labels
--typography-heading-2xl: clamp(1.75rem, calc(2.25vw / 0.48), 2.25rem); // H1
```

### Hero Section Implementation

**Current Component:** `packages/shared/src/components/NetworkedShowcase.astro`

**Approach:** Extend existing component with backwards-compatible boolean flags.

#### Component Structure (Updated)

```
NetworkedShowcase
├── header (left side)
│   ├── .wrapper
│   │   ├── .tags (animated vertical slider) — existing
│   │   └── .status (availability pill) — existing
│   ├── heading (H1/H2 via PortableText) — existing
│   ├── paragraph (PortableText) — existing
│   ├── .cta-wrapper
│   │   ├── buttons (2 CTAs) — existing
│   │   └── .rating (Google) — existing
│   └── [NEW] .cities-ticker (infinite horizontal scroll)
│
└── [CONDITIONAL: showVideo boolean]
    ├── FALSE → .pages (existing networked service cards)
    └── TRUE  → .video-showcase (vertical video player)
```

#### New Sanity Schema Fields

```typescript
// Add to NetworkedShowcase schema
{
  // --- Cities/Localization ---
  name: 'showCityLinks',
  title: 'Show City Links',
  type: 'boolean',
  initialValue: false,
  description: 'Enable infinite scroll ticker with city links'
},
{
  name: 'cities',
  title: 'Cities',
  type: 'array',
  hidden: ({ parent }) => !parent?.showCityLinks,
  of: [{
    type: 'object',
    fields: [
      { name: 'name', type: 'string', title: 'City Name' },
      { name: 'localPage', type: 'reference', to: [{ type: 'localPage' }], title: 'Local Page (optional)' },
      { name: 'isLinked', type: 'boolean', initialValue: false, title: 'Enable Link' }
    ]
  }]
},

// --- Video Mode ---
{
  name: 'showVideo',
  title: 'Show Video (instead of services)',
  type: 'boolean',
  initialValue: false,
  description: 'Replace networked services with vertical video'
},
{
  name: 'video',
  title: 'Hero Video',
  type: 'object',
  hidden: ({ parent }) => !parent?.showVideo,
  fields: [
    { name: 'asset', type: 'mux.video', title: 'Video Asset' },
    { name: 'poster', type: 'image', title: 'Poster Image' },
    { name: 'loopStart', type: 'number', title: 'Loop Start (seconds)', initialValue: 0 },
    { name: 'loopEnd', type: 'number', title: 'Loop End (seconds)', initialValue: 7 }
  ]
}
```

#### Cities Infinite Scroll — Styling Spec

```scss
.cities-ticker {
  // Container
  overflow: hidden;
  margin-top: clamp(1.5rem, calc(2vw / 0.48), 2rem);

  // Inner scrolling wrapper
  .ticker-track {
    display: flex;
    gap: 1.5rem;
    animation: ticker-scroll 20s linear infinite;

    // Pause on hover when cities are linked
    &:hover {
      animation-play-state: paused;
    }
  }

  // City items
  .city {
    font-size: var(--typography-body-s, 0.75rem);
    white-space: nowrap;
    color: var(--neutral-200, #f0f7f7);
    opacity: 0.6;
    transition: opacity 300ms var(--easing);

    // Linked cities
    &[data-linked='true'] {
      opacity: 1;
      cursor: pointer;

      // Underline animation (matches .link class pattern)
      background-image: linear-gradient(currentColor, currentColor);
      background-position: 100% 100%;
      background-repeat: no-repeat;
      background-size: 0% 0.5px;
      transition:
        opacity 300ms var(--easing),
        background-size 500ms var(--easing);

      &:hover {
        background-size: 100% 0.5px;
      }
    }
  }

  @keyframes ticker-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    } // Scroll by half (content duplicated)
  }
}
```

#### Video Player — Styling Spec

```scss
.video-showcase {
  position: relative;
  aspect-ratio: 9 / 16;
  max-width: 320px; // Reasonable desktop size
  border-radius: 4px;
  overflow: hidden;

  // Gradient border (signature Kryptonum pattern)
  background:
    linear-gradient(var(--neutral-900), var(--neutral-900)) padding-box,
    var(--primary-gradient-400) border-box;
  border: 1px solid rgba(255, 255, 255, 0);

  // Glow effect behind video
  &::before {
    content: '';
    position: absolute;
    inset: -20%;
    background: radial-gradient(
      ellipse at center,
      rgba(45, 210, 130, 0.15) 0%,
      // #2dd282 with opacity
      transparent 70%
    );
    z-index: -1;
    filter: blur(40px);
    pointer-events: none;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // Play button overlay (preview state)
  .play-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0, 1, 3, 0.3); // --neutral-900 with opacity
    opacity: 0;
    transition: opacity 300ms var(--easing);
    cursor: pointer;

    .play-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--primary-gradient-400);
      display: grid;
      place-items: center;
      transition: transform 300ms var(--easing);

      svg {
        width: 24px;
        height: 24px;
        fill: var(--neutral-900, #000103);
        margin-left: 4px; // Optical centering for play triangle
      }
    }

    &:hover .play-icon {
      transform: scale(1.1);
    }
  }

  // Show overlay on video hover
  &:hover .play-overlay {
    opacity: 1;
  }

  // Playing state
  &[data-playing='true'] {
    .play-overlay {
      opacity: 0;
      pointer-events: none;
    }
  }

  // Mobile: full width
  @media (max-width: 62rem) {
    max-width: 100%;
    aspect-ratio: 9 / 16;
    margin: 0 auto;
  }
}
```

#### Video Player — Behavior Spec

```typescript
// Video states
type VideoState = 'preview' | 'playing' | 'paused'

// Preview state (default)
// - Video plays muted, looping between loopStart and loopEnd
// - Play overlay hidden until hover
// - On hover: show play overlay with gradient play button

// On click (desktop)
// - Open modal/lightbox with darkened backdrop
// - Video plays from beginning with audio
// - Click outside or X to close, video pauses

// On click (mobile)
// - Play inline (video already full-width)
// - Show native controls
// - Audio enabled
```

#### Modal (Desktop Video Playback)

```scss
.video-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;

  // Backdrop
  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 1, 3, 0.9); // --neutral-900 at 90%
    backdrop-filter: blur(8px);
  }

  // Video container
  .modal-video {
    position: relative;
    z-index: 1;
    max-height: 85vh;
    aspect-ratio: 9 / 16;
    border-radius: 8px;
    overflow: hidden;

    // Gradient border
    background:
      linear-gradient(var(--neutral-900), var(--neutral-900)) padding-box,
      var(--primary-gradient-400) border-box;
    border: 2px solid rgba(255, 255, 255, 0);

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // Close button
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary-600, #042b2b);
    border: 1px solid var(--primary-500, #064040);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 300ms var(--easing);

    &:hover {
      background: var(--primary-500, #064040);
    }

    svg {
      width: 20px;
      height: 20px;
      stroke: var(--neutral-200, #f0f7f7);
    }
  }
}
```

#### CTAs Configuration

For the pillar page hero, use 2 CTAs:

| CTA       | Label                      | Destination     | Theme                     |
| --------- | -------------------------- | --------------- | ------------------------- |
| Primary   | "Umów darmową konsultację" | `#kontakt`      | `primary` (gradient text) |
| Secondary | "Zobacz realizacje"        | `#case-studies` | `secondary` (pill shape)  |

---

## Hero Implementation — Step by Step

### Phase 1: Sanity Schema Updates

#### Step 1.1: Update NetworkedShowcase Schema

**File:** `apps/sanity/schema/components/NetworkedShowcase.ts`

Add the following fields to the existing schema:

```typescript
// After existing fields (tags, status, heading, paragraph, ctas, etc.)

// --- CITIES CONFIGURATION ---
{
  name: 'showCityLinks',
  title: 'Show City Links',
  type: 'boolean',
  initialValue: false,
  description: 'Enable infinite scroll ticker with city/localization links in the header',
  group: 'cities',
},
{
  name: 'cities',
  title: 'Cities',
  type: 'array',
  group: 'cities',
  hidden: ({ parent }) => !parent?.showCityLinks,
  of: [
    {
      type: 'object',
      name: 'cityItem',
      title: 'City',
      fields: [
        {
          name: 'name',
          title: 'City Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'localPage',
          title: 'Local Page',
          type: 'reference',
          to: [{ type: 'WebDevelopment_LocalPage' }], // Adjust to actual type
          description: 'Link to local page (optional)',
        },
        {
          name: 'isLinked',
          title: 'Enable Link',
          type: 'boolean',
          initialValue: false,
          description: 'If true, city will be clickable with hover effects',
        },
      ],
      preview: {
        select: {
          title: 'name',
          isLinked: 'isLinked',
        },
        prepare({ title, isLinked }) {
          return {
            title,
            subtitle: isLinked ? '🔗 Linked' : 'Text only',
          };
        },
      },
    },
  ],
},

// --- VIDEO CONFIGURATION ---
{
  name: 'showVideo',
  title: 'Show Video Mode',
  type: 'boolean',
  initialValue: false,
  description: 'Replace the networked services showcase with a vertical video',
  group: 'video',
},
{
  name: 'video',
  title: 'Hero Video',
  type: 'object',
  group: 'video',
  hidden: ({ parent }) => !parent?.showVideo,
  fields: [
    {
      name: 'asset',
      title: 'Video File',
      type: 'mux.video', // Or 'file' if using direct upload
      description: 'Vertical video (9:16 aspect ratio recommended)',
    },
    {
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      description: 'Thumbnail shown before video loads',
      options: { hotspot: true },
    },
    {
      name: 'loopStart',
      title: 'Loop Start (seconds)',
      type: 'number',
      initialValue: 0,
      description: 'Start time for the preview loop',
    },
    {
      name: 'loopEnd',
      title: 'Loop End (seconds)',
      type: 'number',
      initialValue: 7,
      description: 'End time for the preview loop (5-7s recommended)',
    },
  ],
},
```

#### Step 1.2: Add Field Groups

Add groups to organize the schema fields:

```typescript
groups: [
  { name: 'content', title: 'Content', default: true },
  { name: 'cities', title: 'Cities/Localization' },
  { name: 'video', title: 'Video Mode' },
],
```

#### Step 1.3: Update the GROQ Query

**File:** `packages/shared/src/components/NetworkedShowcase.astro`

Update the query export:

```typescript
export const NetworkedShowcase_Query = `
  _type == "NetworkedShowcase" => {
    tags[],
    status,
    ${PortableTextQuery('heading')}
    ${PortableTextQuery('paragraph')}
    ${ButtonDataQuery('ctas[]')}
    showRating,
    scrollToSectionId,
    "googleData": *[_type == "global"][0].googleData {
      rating,
      url,
    },
    // Existing pages query (for backwards compatibility)
    pages[] -> {
      ${ImageDataQuery('img')}
      name,
      "slug": slug.current,
    },
    // NEW: Cities configuration
    showCityLinks,
    cities[] {
      name,
      isLinked,
      "slug": localPage->slug.current,
    },
    // NEW: Video configuration
    showVideo,
    video {
      "playbackId": asset->playbackId,
      "poster": poster.asset->url,
      loopStart,
      loopEnd,
    },
  },
`
```

#### Step 1.4: Deploy Schema

```bash
cd apps/sanity
npx sanity deploy
```

---

### Phase 2: Component Implementation

#### Step 2.1: Update TypeScript Props

**File:** `packages/shared/src/components/NetworkedShowcase.astro`

Update the Props type:

```typescript
type CityItem = {
  name: string
  isLinked: boolean
  slug?: string
}

type VideoData = {
  playbackId: string
  poster?: string
  loopStart: number
  loopEnd: number
}

type Props = {
  index: number
  sectionId?: string
  tags?: string[]
  status?: string
  heading: PortableTextValue
  paragraph: PortableTextValue
  ctas: ButtonDataProps[]
  showRating: boolean
  scrollToSectionId?: string
  googleData: {
    rating: number
    url: string
  }
  // Existing (for backwards compatibility)
  pages: {
    img: ImageDataProps
    name: string
    slug: string
  }[]
  // NEW
  showCityLinks?: boolean
  cities?: CityItem[]
  showVideo?: boolean
  video?: VideoData
}
```

#### Step 2.2: Destructure New Props

```typescript
const {
  index,
  sectionId,
  tags,
  status,
  heading,
  paragraph,
  ctas,
  showRating,
  scrollToSectionId: _scrollToSectionId,
  googleData,
  pages,
  // NEW
  showCityLinks = false,
  cities = [],
  showVideo = false,
  video,
} = Astro.props
```

#### Step 2.3: Add Cities Ticker to Header

After the `.cta-wrapper` div, add:

```astro
{showCityLinks && cities.length > 0 && (
  <div class="cities-ticker">
    <div class="ticker-track">
      {/* Duplicate cities array for seamless infinite scroll */}
      {[...cities, ...cities].map((city) => (
        city.isLinked && city.slug ? (
          <a href={city.slug} class="city" data-linked="true">
            {city.name}
          </a>
        ) : (
          <span class="city" data-linked="false">
            {city.name}
          </span>
        )
      ))}
    </div>
  </div>
)}
```

#### Step 2.4: Add Conditional Right Column

Replace the existing `.pages` div with conditional rendering:

```astro
{showVideo && video ? (
  <div class="video-showcase" data-playing="false">
    <video
      src={`https://stream.mux.com/${video.playbackId}/high.mp4`}
      poster={video.poster}
      muted
      loop
      playsinline
      autoplay
      data-loop-start={video.loopStart}
      data-loop-end={video.loopEnd}
    />
    <div class="play-overlay">
      <div class="play-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
  </div>
) : (
  <div class="pages">
    {/* Existing pages/services markup */}
    <ul>
      {pages.map(({ img, name, slug }) => (
        <li>
          <a href={slug} class="item">
            <Image {...img} sizes="128px" loading={index === 0 ? 'eager' : 'lazy'} />
            <p>{name}</p>
          </a>
        </li>
      ))}
    </ul>
    {/* Existing SVG decoration */}
  </div>
)}
```

#### Step 2.5: Add Video Modal Component

Create a new file: `packages/shared/src/components/VideoModal.astro`

```astro
---
type Props = {
  id?: string
}
const { id = 'video-modal' } = Astro.props
---

<div class="video-modal" id={id} data-open="false">
  <div class="backdrop"></div>
  <div class="modal-content">
    <video controls playsinline></video>
    <button class="close-btn" aria-label="Close video">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
</div>

<style lang="scss">
  /* Modal styles from the spec above */
</style>
```

---

### Phase 3: Styling Implementation

#### Step 3.1: Add Cities Ticker Styles

Add to the `<style>` block in `NetworkedShowcase.astro`:

```scss
.cities-ticker {
  overflow: hidden;
  margin-top: clamp(1.5rem, calc(2vw / 0.48), 2rem);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);

  .ticker-track {
    display: flex;
    gap: 2rem;
    width: max-content;
    animation: ticker-scroll 25s linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  .city {
    font-size: var(--typography-body-s, 0.75rem);
    white-space: nowrap;
    color: var(--neutral-200, #f0f7f7);

    &[data-linked='false'] {
      opacity: 0.5;
    }

    &[data-linked='true'] {
      opacity: 0.8;
      cursor: pointer;
      text-decoration: none;
      background-image: linear-gradient(currentColor, currentColor);
      background-position: 0% 100%;
      background-repeat: no-repeat;
      background-size: 0% 1px;
      transition:
        opacity 300ms var(--easing),
        background-size 500ms var(--easing);

      &:hover {
        opacity: 1;
        background-size: 100% 1px;
      }
    }
  }

  @keyframes ticker-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
}
```

#### Step 3.2: Add Video Showcase Styles

```scss
.video-showcase {
  position: relative;
  aspect-ratio: 9 / 16;
  max-width: 320px;
  border-radius: 8px;
  overflow: hidden;
  background:
    linear-gradient(var(--neutral-900), var(--neutral-900)) padding-box,
    var(--primary-gradient-400) border-box;
  border: 1px solid rgba(255, 255, 255, 0);

  // Glow effect
  &::before {
    content: '';
    position: absolute;
    inset: -30%;
    background: radial-gradient(ellipse at center, rgba(45, 210, 130, 0.12) 0%, transparent 60%);
    z-index: -1;
    filter: blur(60px);
    pointer-events: none;
    animation: video-glow 4s ease-in-out infinite alternate;
  }

  @keyframes video-glow {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0, 1, 3, 0.2);
    opacity: 0;
    transition: opacity 300ms var(--easing);
    cursor: pointer;

    .play-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--primary-gradient-400);
      display: grid;
      place-items: center;
      transition: transform 300ms var(--easing);
      box-shadow: 0 8px 32px rgba(45, 210, 130, 0.3);

      svg {
        width: 28px;
        height: 28px;
        fill: var(--neutral-900, #000103);
        margin-left: 4px;
      }
    }
  }

  &:hover .play-overlay {
    opacity: 1;
  }

  &:hover .play-overlay .play-icon {
    transform: scale(1.05);
  }

  &:active .play-overlay .play-icon {
    transform: scale(0.98);
  }

  // Mobile: full width
  @media (max-width: 62rem) {
    max-width: 280px;
    margin: 2rem auto 0;
  }

  @media (max-width: 34rem) {
    max-width: 100%;
  }
}
```

---

### Phase 4: Client-Side JavaScript

#### Step 4.1: Add Video Interaction Script

Add before the closing `</section>` tag:

```astro
<script>
  function initVideoShowcase() {
    const showcase = document.querySelector('.video-showcase');
    if (!showcase) return;

    const video = showcase.querySelector('video') as HTMLVideoElement;
    const overlay = showcase.querySelector('.play-overlay');
    const loopStart = parseFloat(video.dataset.loopStart || '0');
    const loopEnd = parseFloat(video.dataset.loopEnd || '7');

    // Handle loop boundaries
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= loopEnd) {
        video.currentTime = loopStart;
      }
    });

    // Click to open modal (desktop) or play inline (mobile)
    overlay?.addEventListener('click', () => {
      const isMobile = window.innerWidth < 992;

      if (isMobile) {
        // Play inline on mobile
        video.muted = false;
        video.controls = true;
        video.currentTime = 0;
        video.loop = false;
        showcase.setAttribute('data-playing', 'true');
      } else {
        // Open modal on desktop
        openVideoModal(video.src);
      }
    });
  }

  function openVideoModal(src: string) {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    const modalVideo = modal.querySelector('video') as HTMLVideoElement;
    const backdrop = modal.querySelector('.backdrop');
    const closeBtn = modal.querySelector('.close-btn');

    modalVideo.src = src;
    modal.setAttribute('data-open', 'true');
    document.documentElement.classList.add('no-scroll');
    modalVideo.play();

    const closeModal = () => {
      modal.setAttribute('data-open', 'false');
      document.documentElement.classList.remove('no-scroll');
      modalVideo.pause();
      modalVideo.src = '';
    };

    backdrop?.addEventListener('click', closeModal, { once: true });
    closeBtn?.addEventListener('click', closeModal, { once: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    }, { once: true });
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', initVideoShowcase);
</script>
```

---

### Phase 5: Testing Checklist

#### Functionality Tests

- [ ] **Backwards Compatibility**
  - [ ] Homepage still works without `showVideo` or `showCityLinks`
  - [ ] Existing pages show networked services as before
- [ ] **Cities Ticker**
  - [ ] Infinite scroll animates smoothly
  - [ ] Scroll pauses on hover
  - [ ] Linked cities show underline on hover
  - [ ] Non-linked cities have lower opacity, no interaction
  - [ ] Links navigate to correct local pages
- [ ] **Video Preview**
  - [ ] Video auto-plays on load (muted)
  - [ ] Loop stays within defined boundaries
  - [ ] Play overlay appears on hover
  - [ ] Gradient border displays correctly
  - [ ] Glow effect visible behind video
- [ ] **Video Modal (Desktop)**
  - [ ] Click opens modal with backdrop
  - [ ] Video plays with audio
  - [ ] Click backdrop closes modal
  - [ ] Close button works
  - [ ] ESC key closes modal
  - [ ] Scroll locked when modal open
- [ ] **Video Inline (Mobile)**
  - [ ] Click plays video inline
  - [ ] Native controls appear
  - [ ] Audio enabled
  - [ ] Full-width on mobile

#### Responsive Tests

- [ ] Desktop (1280px+): Two-column layout, video in right column
- [ ] Tablet (768-1279px): Two-column or stacked, video smaller
- [ ] Mobile (<768px): Single column, video full-width below header

#### Performance Tests

- [ ] Video poster loads quickly
- [ ] Video doesn't block page load (lazy loading)
- [ ] No layout shift when video loads
- [ ] Animation performance (60fps ticker scroll)

---

### Phase 6: Sanity Studio Preview Image

After implementation, capture a screenshot of the new component variant and save as:

```
apps/sanity/static/components/NetworkedShowcase-Video.webp
```

---

## References

- **Notion Project:** KryptoSEO
- **Architecture Notes:** "Strony Internetowe" page in Notion
- **Meeting Notes:** "Obudowanie filarów", "Diagnoza problemu i omówienie strategii na 2026"
- **Roadmap:** "Roadmapa SEO" in Notion
- **Live Reference:** [kryptonum.eu/pl](https://kryptonum.eu/pl) (homepage as base for hero)

---

## Next Steps

1. ✅ Document strategy (this file)
2. ✅ **Update Hero section** (completed 2026-01-28)
   - ✅ Modified/extended `NetworkedShowcase.astro`
   - ✅ Added vertical video support with modal (desktop) and inline playback (mobile)
   - 🔜 Add localization infinite scroll (cities ticker - Phase 2)
3. Update Blog section
4. Create Diagnoza component
5. Create Case Studies component
6. Finalize copy with Aneta
7. Record video with Kuba
8. Deploy to staging
9. Final review and publish
