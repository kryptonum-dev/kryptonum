# Header Navigation Update — Implementation Strategy

This document outlines the strategy for implementing the new pillar-first header navigation. The goal is to develop everything on the **staging environment** without affecting the **production site** until we're ready to merge.

---

## Current Setup (Prerequisites Complete)

### Dual Studio Architecture

| Environment | Studio URL | Dataset | Branch |
|-------------|-----------|---------|--------|
| **Production** | kryptonum.sanity.studio | production | `main` |
| **Staging** | kryptonum-staging.sanity.studio | production (shared) | `PillarPages` |

**Key insight:** Both studios share the same dataset. The difference is in the **schema** (defined in code), not the data.

### Deployment Commands

```bash
# Deploy to production studio (from main branch)
cd apps/sanity && bun run deploy

# Deploy to staging studio (from PillarPages branch)
cd apps/sanity && bun run deploy:staging
```

---

## What We're Building

### Current Header (Mega Menu)
```
Usługi (dropdown)
├── Web Development (icon)
│   ├── Strony internetowe
│   ├── Aplikacje webowe
│   └── ...
├── E-commerce (icon)
│   ├── Sklepy internetowe
│   └── ...
├── Design (icon)
│   └── ...
└── Marketing (icon)
    └── ...
```

### New Header (Pillar-First)
```
Usługi (dropdown)
├── LEFT PANEL (list)
│   ├── Strony internetowe (pillar) → "Strony, które prowadzą do decyzji..."
│   ├── Sklepy internetowe (pillar) → "E-commerce szyty pod proces..."
│   ├── Marketing & Performance (pillar) → "Leady, które da się policzyć..."
│   ├── ── divider ──
│   └── Wszystkie usługi (hub) → /uslugi
│
└── RIGHT PANEL (preview)
    ├── Image (changes on hover)
    ├── Description (2 lines)
    └── Mini-CTA: "Masz cel? 15 min rozmowy."
```

---

## Implementation Phases

### Phase 1: Schema Changes (Sanity) ✅ COMPLETE

**Files modified:**
- `apps/sanity/schema/singleTypes/global.tsx`
- `apps/sanity/schema/collectionTypes/Service_Collection.tsx`

#### Service_Collection Changes

Added `description` field for dropdown microcopy:

```typescript
defineField({
  name: 'description',
  type: 'text',
  title: 'Short Description',
  description: 'Short description shown in header dropdown',
  rows: 2,
  validation: Rule => Rule.max(120).warning('Keep it under 120 characters'),
}),
```

#### Global Nav Changes

**1. Pillars array** (simple Service_Collection references):

```typescript
defineField({
  name: 'pillars',
  type: 'array',
  title: 'Pillar Services (Dropdown)',
  description: 'Select 1-4 pillar services to show in header services dropdown.',
  of: [{
    type: 'reference',
    to: [{ type: 'Service_Collection' }],
    options: {
      disableNew: true,
      filter: 'language == $lang && !defined(mainPage)',  // Main services only
    }
  }],
  validation: Rule => [
    Rule.required(),
    Rule.min(1).max(4),
    Rule.unique(),
  ]
}),
```

**2. Services Hub CTA** (single button):

```typescript
defineField({
  name: 'servicesHubCta',
  type: 'cta',
  title: 'Services Hub CTA',
  description: 'Button shown in services dropdown preview panel.',
  validation: Rule => Rule.required(),
}),
```

#### Key Simplifications

- ✅ **No nested objects** - Just reference Service_Collection documents
- ✅ **Reuse existing fields** - Uses `img` from Service_Collection for preview
- ✅ **Single CTA** - One button instead of separate hub link + CTA
- ✅ **Future-proof** - When you reduce to 6-7 services, just update references

**Why this is safe:**
- Production studio (main branch) doesn't have these fields in schema
- When we add data via staging studio, production studio ignores it
- Production Header.astro doesn't query these fields

**Staging studio deployed:**
```bash
✅ https://kryptonum-staging.sanity.studio/
```

---

### Phase 2: Header Component Changes (Astro)

**Files to modify:**
- `apps/www/src/layout/Header.astro`

**Changes needed:**

#### 1. Update TypeScript types

```typescript
// Add new types for pillar navigation
pillars: Array<{
  name: string
  slug: string
  description: string
  previewImage: ImageDataProps
}>
servicesHub: {
  text: string
  description: string
  url: string
}
servicesCta?: {
  text: string
  link: ButtonDataProps
}
```

#### 2. Update GROQ query

```groq
// Replace old services query
"services": *[_type == "Service_Collection" && !defined(mainPage)...

// With new pillars query
"pillars": nav.pillars[]-> {
  name,
  "slug": slug.current,
  description,
  ${ImageDataQuery('icon')}     // Icon for list item
  ${ImageDataQuery('img')}      // Featured image for preview panel
},
${ButtonDataQuery('nav.servicesHubCta', 'servicesHubCta')}
```

#### 3. Update dropdown HTML structure

```astro
<!-- OLD: 4-column mega menu -->
<div class="item" data-tab="services">
  <div class="item-expand">
    <div class="max-width">
      {data.services.map(({ name, slug, icon, list }) => (
        <div>
          <a href={slug} class="title">...</a>
          <ul>{list.map(...)}</ul>
        </div>
      ))}
    </div>
  </div>
</div>

<!-- NEW: 2-panel layout -->
<div class="item" data-tab="services">
  <div class="item-expand">
    <div class="max-width services-dropdown">
      <div class="pillars-list">
        {data.pillars.map(({ name, slug, description }) => (
          <a href={slug} class="pillar-item">
            <span class="pillar-name">{name}</span>
            <span class="pillar-description">{description}</span>
          </a>
        ))}
        <div class="divider" />
        <a href={data.servicesHub.url} class="hub-link">
          <span>{data.servicesHub.text}</span>
          <span class="hub-description">{data.servicesHub.description}</span>
        </a>
      </div>
      <div class="preview-panel">
        <div class="preview-images">
          {data.pillars.map(({ previewImage }) => (
            <Image {...previewImage} sizes="..." />
          ))}
        </div>
        <div class="preview-cta">
          {data.servicesCta && (
            <>
              <p>{data.servicesCta.text}</p>
              <Button {...data.servicesCta.link} />
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 4. Update SCSS styles

Adapt existing `[data-tab='services']` styles for new 2-panel layout.

**Why this is safe:**
- Header.astro changes are in `PillarPages` branch
- Production site uses `main` branch with old Header.astro
- Vercel preview deploys from `PillarPages` branch

---

### Phase 3: Content Configuration (Sanity Studio)

**Where:** kryptonum-staging.sanity.studio

**What to configure:**

1. **Global → Navigation → Pillars**
   - Add "Strony internetowe" service reference
     - Description: "Strony, które prowadzą do decyzji i generują leady."
     - Preview image: Upload relevant mockup/image
   - Add "Sklepy internetowe" service reference
     - Description: "E-commerce szyty pod proces sprzedaży, nie pod szablon."
     - Preview image: Upload relevant mockup/image
   - Add "Marketing & Performance" service reference
     - Description: "Leady, które da się policzyć. Bez przepalania budżetu."
     - Preview image: Upload relevant mockup/image

2. **Global → Navigation → Services Hub**
   - Text: "Wszystkie usługi"
   - Description: "Zobacz pełną listę (audyt, branding, analityka…)."
   - URL: "/pl/uslugi"

3. **Global → Navigation → Services CTA**
   - Text: "Masz cel? 15 min rozmowy."
   - Link: Configure to point to consultation page

**Important:** Click **Publish** after configuration. This saves to production dataset but:
- Production studio doesn't see these fields (different schema)
- Production Header.astro doesn't query these fields (different code)

---

## Testing Strategy

### Where to Test

| Test Location | URL | What You See |
|---------------|-----|--------------|
| **Vercel Preview** | `kryptonum-git-pillarpages-*.vercel.app` | New header with pillars |
| **Production** | `kryptonum.eu` | Old header (mega menu) |
| **Staging Studio** | `kryptonum-staging.sanity.studio` | New pillar fields |
| **Production Studio** | `kryptonum.sanity.studio` | No pillar fields |

### Test Checklist

- [ ] Pillars display correctly in dropdown
- [ ] Preview images change on hover
- [ ] Links navigate to correct pillar pages
- [ ] "Wszystkie usługi" links to /uslugi
- [ ] Mini-CTA works in preview panel
- [ ] Mobile navigation works
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] No regressions in other header sections (Projects, Team, Blog)

---

## Merge & Go-Live Strategy

### When Ready to Launch

1. **Final review on Vercel preview**
   - All stakeholders approve new header

2. **Create Pull Request**
   ```bash
   git checkout PillarPages
   gh pr create --title "Pillar-first header navigation" --body "..."
   ```

3. **Merge to main**
   - GitHub Actions auto-deploys Sanity studio (with new schema)
   - Vercel auto-deploys www (with new Header.astro)

4. **Verify production**
   - Check kryptonum.eu shows new header
   - Check kryptonum.sanity.studio shows pillar fields
   - Verify pillar content is visible (already published in staging)

### Rollback Plan

If issues arise after merge:

```bash
# Option 1: Revert merge commit
git revert <merge-commit-hash>
git push origin main

# Option 2: Quick fix forward
# Fix issue in new commit, push to main
```

---

## File Summary

| File | Changes | Branch |
|------|---------|--------|
| `apps/sanity/schema/singleTypes/global.tsx` | Add pillar fields to nav | PillarPages |
| `apps/www/src/layout/Header.astro` | New dropdown structure + query | PillarPages |
| `apps/sanity/sanity.cli.ts` | Staging host support | PillarPages ✅ |
| `apps/sanity/sanity.config.ts` | Staging title indicator | PillarPages ✅ |
| `apps/sanity/package.json` | deploy:staging script | PillarPages ✅ |

---

## Timeline

| Phase | Tasks | Status |
|-------|-------|--------|
| **Setup** | Dual studio configuration | ✅ Complete |
| **Phase 1** | Schema changes (Service_Collection + global) | ✅ Complete |
| **Phase 2** | Header component (Header.astro) | ⏳ Pending |
| **Phase 3** | Content configuration (Sanity) | ⏳ Pending |
| **Testing** | Vercel preview testing | ⏳ Pending |
| **Launch** | Merge to main | ⏳ Pending |

---

## Questions to Resolve

1. **Preview images:** Use existing Service_Collection.img or upload new images specific to dropdown?
2. **Mobile navigation:** Keep same simplified structure (3 pillars + hub) or different mobile layout?
3. **Animation:** Keep current hover transitions or design new ones for 2-panel layout?
4. **Localization:** EN version of header - same pillar structure or different?
