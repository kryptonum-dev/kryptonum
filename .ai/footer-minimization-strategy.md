# Footer Minimization Strategy

**Goal:** Reduce footer link dilution from ~70 links to ~10 links, focusing on Services (pillars) and Contact as primary conversion paths.

---

## Current State

The footer contains:
- Services mega menu (all services + sub-services) ~25 links
- Case Studies section ~5 links
- Team members with photos ~10 links
- Blog link
- Contact info
- Interactive map with location pages ~20 links
- Credits (privacy, terms, socials)

**Problem:** Sitewide link dilution undermines Pillar-First SEO strategy.

---

## Target State

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  USŁUGI           FIRMA              KONTAKT             │
│  ─────────        ──────────         ────────────        │
│  ○ Pillar 1       Portfolio          Address             │
│  ○ Pillar 2       Team                                   │
│  ○ Pillar 3       Blog               email [copy]        │
│  ○ Pillar 4       (2-4 links)        phone [copy]        │
│                                                          │
│  [Services CTA]                      [Contact CTA]       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Privacy  Terms  [socials]                    © 2026     │
└──────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Sanity Schema
**Status:** ✅ Complete

- [x] Add `footer` object with:
  - `pillars` (type: array of references) - 1-4 pillar services (same pattern as header)
  - `links` (type: array of cta) - 2-4 company/hub page links (Portfolio, Team, Blog, etc.)
  - `servicesCta` (type: cta) - configurable button for services section
  - `contactCta` (type: cta) - configurable button for contact section
- [x] Footer has its own `pillars` field (independent from header, but can select same services)
- [x] Legacy `caseStudies` field hidden (backward compatible)
- [ ] Deploy staging studio (part of batch deployment)

### Phase 2: Frontend (Footer.astro)
**Status:** ✅ Complete

- [x] Update GROQ query to fetch:
  - `pillars` (from footer.pillars)
  - `links` (from footer.links - company/hub pages)
  - `footer.servicesCta`
  - `footer.contactCta`
  - `contact` (address, email, tel)
  - `privacyPolicy`, `terms` (keep)
- [x] Removed from query:
  - `services` (full list)
  - `caseStudies`
  - `team`
  - `blog`
  - `locationPages`
- [x] Updated HTML structure (three-column: Services | Company | Contact)
- [x] Updated SCSS (12-column grid system, spacious layout)
- [x] Credits section kept unchanged
- [x] Removed map script and cities logic

### Phase 3: Content Configuration
**Status:** ⬜ Not Started

- [ ] In Sanity staging, configure:
  - `pillars` (if not already set from header work)
  - `footer.servicesCta` → link to /pl/uslugi (or similar hub)
  - `footer.contactCta` → link to /pl/kontakt

### Phase 4: Testing & QA
**Status:** ⬜ Not Started

- [ ] Desktop layout
- [ ] Mobile responsive
- [ ] All links work correctly
- [ ] Copy buttons functional
- [ ] Verify link count reduction

### Phase 5: Merge & Go-Live
**Status:** ⬜ Not Started

- [ ] Final review
- [ ] Merge with header changes (batch deployment)
- [ ] Production content update

---

## Removed Elements

| Element | Reason |
|---------|--------|
| Services mega menu | Link dilution - replaced by pillars only |
| Case Studies | Not primary navigation |
| Team members | Not conversion path |
| Blog link | Not essential for footer |
| Location pages map | Explicitly flagged in SEO strategy |

---

## Dependencies

- Reuses `pillars` from header (already in nav schema)
- New `footer.servicesCta` and `footer.contactCta` fields
- Part of PillarPages branch (batch merge with header)

---

## Notes

- CTAs are fully configurable from Sanity (not hardcoded URLs)
- Backward compatibility: if pillars not configured, show minimal contact-only footer
- Credits section stays identical (already approved)
