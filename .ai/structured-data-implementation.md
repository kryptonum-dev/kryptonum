# Structured Data Implementation Plan

This document outlines the implementation plan for adding structured data (JSON-LD) to improve SEO. Schemas are ordered from highest to lowest priority based on SEO impact and the strategy outlined in `seo-strategy-implementation.md`.

---

## Current Status

| Schema Type            | Status         | Location                                                   |
| ---------------------- | -------------- | ---------------------------------------------------------- |
| BreadcrumbList         | ✅ Implemented | `packages/ui/src/Breadcrumbs.astro`                        |
| FAQPage                | ✅ Implemented | `packages/shared/src/components/Faq.astro`                 |
| Organization           | ✅ Implemented | `apps/www/src/components/schemas/OrganizationSchema.astro` |
| LocalBusiness          | ✅ Implemented | (combined with Organization as ProfessionalService)        |
| AggregateRating/Review | ✅ Implemented | (embedded in ProfessionalService)                          |
| WebSite                | ✅ Implemented | (included in OrganizationSchema @graph)                    |
| Article/BlogPosting    | ✅ Implemented | `apps/www/src/components/schemas/ArticleSchema.astro`      |

---

## ⚡ Implementation Plan: Organization + LocalBusiness (Combined)

### Strategic Decision: Combined Schema Approach

**Question:** Should both Organization and LocalBusiness schemas be sitewide?

**Answer: Yes — using a combined, unified approach.**

Rather than implementing two separate schemas, we use a **single `ProfessionalService`** type which:

- Is a subtype of `LocalBusiness` → which is a subtype of `Organization`
- Inherits ALL properties from both parent types
- Provides maximum SEO benefit with zero redundancy
- Is more specific and accurate for a digital agency

### Why Combined?

| Separate Schemas                        | Combined Schema (Recommended)     |
| --------------------------------------- | --------------------------------- |
| ❌ Redundant data                       | ✅ Single source of truth         |
| ❌ Potential for Google to see as dupes | ✅ Clean entity signal            |
| ❌ More code to maintain                | ✅ One schema to rule them all    |
| ❌ Generic "Organization" type          | ✅ Specific "ProfessionalService" |

### Final Schema Architecture

We'll use a `@graph` structure containing:

1. **`ProfessionalService`** — Main business entity (Organization + LocalBusiness combined)
2. **`WebSite`** — Website metadata with search action potential

Both will be output sitewide via `Head.astro`.

---

## Phase 1: Sanity Schema Enhancement ✅ COMPLETE

### Objective

Extend the `global` document type to capture all data needed for comprehensive structured data.

### File modified

`apps/sanity/schema/singleTypes/global.tsx`

### All available fields

```
✅ OrganizationSchema.name
✅ OrganizationSchema.description
✅ OrganizationSchema.logo          ← NEW
✅ OrganizationSchema.foundingDate  ← NEW
✅ OrganizationSchema.priceRange    ← NEW
✅ OrganizationSchema.areaServed[]  ← NEW (for local SEO)
✅ email
✅ tel
✅ address.addressText
✅ address.mapLink
✅ address.streetAddress            ← NEW
✅ address.addressLocality          ← NEW
✅ address.postalCode               ← NEW
✅ address.addressCountry           ← NEW (default: "PL")
✅ address.geo.latitude             ← NEW
✅ address.geo.longitude            ← NEW
✅ socials.instagram
✅ socials.facebook
✅ socials.tiktok
✅ socials.linkedin
✅ googleData.rating
✅ googleData.user_ratings_total
✅ googleData.url
```

### Implementation checklist — Phase 1

- [x] Add `logo` image field to `OrganizationSchema`
- [x] Add `foundingDate` date field to `OrganizationSchema`
- [x] Add `priceRange` string field with predefined options ($, $$, $$$, $$$$)
- [x] Add `areaServed` array for cities served (supports local SEO strategy)
- [x] Restructure `address` object with individual components:
  - [x] `streetAddress` (string)
  - [x] `addressLocality` (string)
  - [x] `postalCode` (string)
  - [x] `addressCountry` (string with default "PL")
- [x] Add `geo` object with `latitude` and `longitude` number fields
- [x] Keep `addressText` for display purposes (human-readable)
- [x] Keep `mapLink` for UI usage

### Next step: Populate data in Sanity Studio

After deploying this schema, populate the following fields:

| Field                             | Value                        |
| --------------------------------- | ---------------------------- |
| `OrganizationSchema.logo`         | Upload Kryptonum logo        |
| `OrganizationSchema.foundingDate` | 2020-01-01 (or actual date)  |
| `OrganizationSchema.priceRange`   | $$ (Moderate)                |
| `OrganizationSchema.areaServed`   | Warszawa, Kraków, Wrocław... |
| `address.streetAddress`           | Żwirki i Wigury 15/9         |
| `address.addressLocality`         | Warszawa                     |
| `address.postalCode`              | 02-143                       |
| `address.addressCountry`          | PL                           |
| `address.geo.latitude`            | **52.1890**                  |
| `address.geo.longitude`           | **20.9768**                  |

---

## Phase 2: Organization Schema Component ✅ COMPLETE

### Objective

Create a dedicated `OrganizationSchema.astro` component that queries Sanity and outputs JSON-LD.

### Files created/modified

| File                                                       | Action   | Status |
| ---------------------------------------------------------- | -------- | ------ |
| `apps/www/src/components/schemas/`                         | Created  | ✅     |
| `apps/www/src/components/schemas/OrganizationSchema.astro` | Created  | ✅     |
| `apps/www/src/layout/Layout.astro`                         | Modified | ✅     |

### Component features

The `OrganizationSchema.astro` component:

1. ✅ Fetches global data from Sanity (language-aware)
2. ✅ Builds `ProfessionalService` schema with all properties
3. ✅ Builds `WebSite` schema linked to organization
4. ✅ Outputs `@graph` structure with both schemas
5. ✅ Filters empty social links from `sameAs` array
6. ✅ Includes `areaServed` for local SEO
7. ✅ Gracefully handles missing optional fields

### Schema output structure

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://kryptonum.eu/#organization",
      "name": "Kryptonum",
      "description": "...",
      "url": "https://kryptonum.eu",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://kryptonum.eu/#logo",
        "url": "https://kryptonum.eu/logo.png",
        "contentUrl": "https://kryptonum.eu/logo.png",
        "caption": "Kryptonum"
      },
      "image": "https://kryptonum.eu/#logo",
      "email": "...",
      "telephone": "...",
      "foundingDate": "2020-01-01",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "...",
        "addressLocality": "...",
        "postalCode": "...",
        "addressCountry": "PL"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 52.189,
        "longitude": 20.9768
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "100",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://www.instagram.com/kryptonum/",
        "https://www.facebook.com/kryptonum/",
        "https://www.linkedin.com/company/kryptonum/",
        "https://www.tiktok.com/@kryptonum",
        "https://g.page/kryptonum"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://kryptonum.eu/#website",
      "url": "https://kryptonum.eu",
      "name": "Kryptonum",
      "publisher": {
        "@id": "https://kryptonum.eu/#organization"
      },
      "inLanguage": ["pl", "en"]
    }
  ]
}
```

### Implementation checklist — Phase 2

- [x] Create `apps/www/src/components/schemas/` folder
- [x] Create `OrganizationSchema.astro` component
- [x] Define TypeScript types for Sanity response
- [x] Write GROQ query to fetch all required global data
- [x] Build `ProfessionalService` schema object
- [x] Build `WebSite` schema object
- [x] Implement `sameAs` array builder (filter out empty social links)
- [x] Add JSON-LD script output
- [x] Import and render in `Layout.astro`

---

## Phase 3: Integration & Testing

### Objective

Ensure structured data is correctly output on all pages and passes validation.

### Testing checklist

- [ ] Verify JSON-LD appears in page source on homepage
- [ ] Verify JSON-LD appears on subpages (blog, services, etc.)
- [ ] Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate with [Schema.org Validator](https://validator.schema.org/)
- [ ] Check for console errors
- [ ] Verify all Sanity fields render correctly
- [ ] Test with empty optional fields (graceful handling)

### Deployment checklist

- [ ] Deploy Sanity schema changes
- [ ] Populate new fields in Sanity Studio
- [ ] Deploy frontend changes
- [ ] Monitor Google Search Console for structured data issues
- [ ] Re-validate after deployment

---

## Detailed Schema Reference

### Priority 1: Organization Schema (via ProfessionalService)

#### What is it?

Organization schema tells search engines about your business entity — who you are, what you do, and where you exist across the web. It's the foundation of **entity SEO**.

#### Why it matters

- **Entity recognition**: Helps Google understand Kryptonum as a distinct entity in their Knowledge Graph
- **Brand connections**: Links your website to social profiles, Google Business Profile, and other web presences via `sameAs`
- **Trust signals**: Establishes legitimacy and authority
- **Rich results**: Can enable knowledge panel features and enhanced brand presence in SERPs

### Priority 2: LocalBusiness Schema (via ProfessionalService)

#### What is it?

LocalBusiness schema provides detailed information about a local business, including location, contact details, and aggregate ratings. Using `ProfessionalService` (a subtype) is more specific for agencies.

#### Why it matters

- **Local SEO**: Critical for appearing in local search results and Google Maps
- **Rich snippets**: Enables star ratings, review counts, and contact info directly in SERPs
- **Google Business Profile connection**: Links your website to your GBP via `sameAs`
- **Trust & CTR**: Star ratings in search results dramatically improve click-through rates

#### Important notes

- `aggregateRating` uses Google review data — valid because Google Business Profile is a legitimate third-party source
- `geo` coordinates enhance local search visibility
- `priceRange` indicates pricing tier ("$" to "$$$$")

---

## Phase 4: Article Schema Implementation

### What is it?

Article schema provides information about blog posts and editorial content. It helps search engines understand the content, author, publication date, and context.

### Why it matters

- **Rich results**: Enables article carousels, author info, and enhanced listings in search results
- **Author attribution**: Connects content to real authors (E-E-A-T signal)
- **Content freshness**: `datePublished` and `dateModified` help Google understand content recency
- **Entity connection**: Links articles to your Organization via `publisher`

---

### Step 1: Analyze Current Data Structure

**Sanity Schema:** `BlogPost_Collection` (`apps/sanity/schema/collectionTypes/BlogPost_Collection/index.tsx`)

| Field             | Type        | Available? | Notes                    |
| ----------------- | ----------- | ---------- | ------------------------ |
| `name`            | string      | ✅         | Article headline         |
| `slug.current`    | string      | ✅         | URL path                 |
| `img`             | image       | ✅         | Featured image           |
| `publishedDate`   | datetime    | ✅         | Optional override        |
| `_createdAt`      | datetime    | ✅         | Fallback date            |
| `_updatedAt`      | datetime    | ✅         | Last modified            |
| `author[]`        | reference[] | ✅         | Array of TeamMember refs |
| `seo.description` | string      | ✅         | Meta description         |
| `category`        | reference   | ✅         | Blog category            |

**Current Query** (`apps/www/src/templates/blog/[slug].astro`):

- Already fetches: `name`, dates via `Hero_Query`, `author` via `Metadata_Query`
- Missing: `seo.description` (fetched separately via `metadataFetch`)

---

### Step 2: Create ArticleSchema Component

**File to create:** `apps/www/src/components/schemas/ArticleSchema.astro`

**Props needed:**

```typescript
type ArticleSchemaProps = {
  headline: string // From page.name
  description: string // From metadata.description
  image: string // From page.hero.img.asset.url
  datePublished: string // From page.hero._createdAt
  dateModified: string // From page.hero._updatedAt
  author: {
    name: string
    slug: string
  }
  slug: string // Full URL path
}
```

**Component will output:**

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://kryptonum.eu/pl/blog/article-slug#article",
  "headline": "Article Title",
  "description": "Meta description...",
  "image": "https://cdn.sanity.io/.../image.jpg",
  "datePublished": "2024-01-15T10:00:00.000Z",
  "dateModified": "2024-01-20T14:30:00.000Z",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://kryptonum.eu/pl/zespol/author-slug"
  },
  "publisher": {
    "@id": "https://kryptonum.eu/#organization"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://kryptonum.eu/pl/blog/article-slug"
  },
  "isPartOf": {
    "@id": "https://kryptonum.eu/#website"
  }
}
```

---

### Step 3: Modify Blog Post Template

**File to modify:** `apps/www/src/templates/blog/[slug].astro`

**Changes needed:**

1. **Extend GROQ query** to fetch image URL for schema:

```groq
"hero": {
  ...existing fields...
  "imageUrl": img.asset -> url,  // ADD: Direct URL for schema
},
```

2. **Import ArticleSchema component**
3. **Pass props and render** in Layout's Head slot

---

### Step 4: Detailed Implementation Plan

#### 4.1 Create ArticleSchema.astro

| Task                 | Details                                               |
| -------------------- | ----------------------------------------------------- |
| Create file          | `apps/www/src/components/schemas/ArticleSchema.astro` |
| Define Props type    | headline, description, image, dates, author, slug     |
| Build JSON-LD object | Use `BlogPosting` type (more specific than Article)   |
| Reference publisher  | Use `@id` to link to Organization                     |
| Output script tag    | `<script type="application/ld+json">`                 |

#### 4.2 Modify [slug].astro Query

| Task                         | Details                          |
| ---------------------------- | -------------------------------- |
| Add `imageUrl` to Hero_Query | `"imageUrl": img.asset -> url`   |
| Pass data to ArticleSchema   | From page + metadata props       |
| Render in Head slot          | Use Astro's `<slot name="Head">` |

#### 4.3 Handle Edge Cases

| Scenario            | Solution                        |
| ------------------- | ------------------------------- |
| Missing author      | Null-safe: omit author property |
| Missing image       | Null-safe: omit image property  |
| Missing description | Use fallback or omit            |

---

### Step 5: Expand portable-text-to-html.ts (Optional but Recommended)

**File:** `packages/ui/src/portable-text/portable-text-to-html.ts`

#### Current coverage

| Supported                        | Not Supported        |
| -------------------------------- | -------------------- |
| ✅ block (h1-h4, p, blockquote)  | ❌ Quote             |
| ✅ lists (bullet, number)        | ❌ ListWithIcon      |
| ✅ marks (strong, em, underline) | ❌ NumberedStepsList |
| ✅ links (internal/external)     | ❌ ProsAndCons       |
| ✅ image (basic)                 | ❌ DoAndDonts        |
|                                  | ❌ Faq               |
|                                  | ❌ Video (skip)      |
|                                  | ❌ Author (skip)     |
|                                  | ❌ CTAs (skip)       |

#### Recommendation: Selective expansion

Only add support for **text-containing** components:

| Component                  | Action  | Reason                   |
| -------------------------- | ------- | ------------------------ |
| `Quote`                    | ✅ Add  | Extract quote text       |
| `ListWithIcon`             | ✅ Add  | Extract list items text  |
| `NumberedStepsList`        | ✅ Add  | Extract steps text       |
| `ProsAndCons`              | ✅ Add  | Extract pros/cons text   |
| `DoAndDonts`               | ✅ Add  | Extract do/don't text    |
| `Faq`                      | ✅ Add  | Extract Q&A text         |
| `Video`                    | ❌ Skip | Not textual content      |
| `Author`                   | ❌ Skip | Not article body content |
| `ImageCta`                 | ❌ Skip | CTA, not content         |
| `SimpleCenteredCtaSection` | ❌ Skip | CTA, not content         |
| `LargeAdvantagesCta`       | ❌ Skip | CTA, not content         |

#### Why bother with articleBody?

- **AI Overviews**: Google may use full content for AI-generated summaries
- **Featured snippets**: Better content extraction
- **Future-proofing**: More data = more potential rich results

---

### Step 6: Additional Schema Fields

Fields to add that were initially missing:

| Field            | Source                  | Why                                      |
| ---------------- | ----------------------- | ---------------------------------------- |
| `inLanguage`     | `lang` param            | Helps Google understand content language |
| `wordCount`      | Calculate from content  | Useful metadata signal                   |
| `articleSection` | `category.name`         | Content categorization                   |
| `keywords`       | Optional: from category | Additional context                       |

Updated schema output:

```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "description": "...",
  "image": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": { ... },
  "publisher": { "@id": "https://kryptonum.eu/#organization" },
  "mainEntityOfPage": { ... },
  "isPartOf": { "@id": "https://kryptonum.eu/#website" },
  "inLanguage": "pl",
  "wordCount": 1250,
  "articleSection": "Technology",
  "articleBody": "<p>Full article content as HTML...</p>"
}
```

---

### Step 7: Implementation Checklist

#### Phase 4.1: Expand portable-text-to-html.ts ✅ COMPLETE

- [x] Read existing component schemas to understand data structure
- [x] Add handler for `Quote` type
- [x] Add handler for `ListWithIcon` type
- [x] Add handler for `NumberedStepsList` type
- [x] Add handler for `ProsAndCons` type
- [x] Add handler for `DoAndDonts` type
- [x] Add handler for `Faq` type
- [x] Skip CTAs and non-text components gracefully
- [x] Added `calculateWordCount` utility function
- [ ] Test with real blog post content

#### Phase 4.2: Create ArticleSchema.astro ✅ COMPLETE

- [x] Create `apps/www/src/components/schemas/ArticleSchema.astro`
- [x] Define TypeScript Props interface
- [x] Build `BlogPosting` schema object
- [x] Include `inLanguage` from lang param
- [x] Include `articleSection` from category
- [x] Calculate and include `wordCount`
- [x] Generate `articleBody` using expanded portable-text-to-html
- [x] Reference Organization via `@id` for publisher
- [x] Reference WebSite via `@id` for isPartOf
- [x] Null-proof all optional fields

#### Phase 4.3: Integrate with Blog Template ✅ COMPLETE

- [x] Modify queries to fetch all required data:
  - [x] Add `imageUrl` to Hero_Query
  - [x] Add `content` for articleBody generation
  - [x] Add `category.name` for articleSection
- [x] Import ArticleSchema in `[slug].astro`
- [x] Pass all required props
- [x] Render via `<slot name="Head">`

#### Phase 4.4: Testing (YOUR TURN)

- [ ] Test on local dev server
- [ ] Validate with Google Rich Results Test
- [ ] Verify all fields render correctly
- [ ] Test with various blog posts (with/without all components)
- [ ] Check articleBody HTML is valid

---

### Files to Create/Modify

| File                                                     | Action                                | Status |
| -------------------------------------------------------- | ------------------------------------- | ------ |
| `packages/ui/src/portable-text/portable-text-to-html.ts` | Expand (add custom component support) | ✅     |
| `packages/ui/src/portable-text/index.ts`                 | Export calculateWordCount             | ✅     |
| `apps/www/src/components/schemas/ArticleSchema.astro`    | Create                                | ✅     |
| `apps/www/src/components/Blog/Post/Hero.astro`           | Modify (add imageUrl)                 | ✅     |
| `apps/www/src/templates/blog/[slug].astro`               | Modify (integrate schema)             | ✅     |

---

### Schema Type Decision: `BlogPosting` vs `Article`

Using **`BlogPosting`** instead of generic `Article` because:

| Criteria             | Article  | BlogPosting                  |
| -------------------- | -------- | ---------------------------- |
| Specificity          | Generic  | Specific to blogs ✅         |
| Google support       | ✅       | ✅                           |
| Rich results         | Standard | Better for blog carousels ✅ |
| Schema.org hierarchy | Parent   | Child of Article             |

`BlogPosting` inherits all Article properties and is more semantically accurate for blog content.

---

## AggregateRating Schema

> **Status:** Will be embedded within ProfessionalService schema (not standalone)

### What is it?

AggregateRating provides a summary of multiple reviews (average rating, count). It's embedded within the ProfessionalService schema rather than standalone.

### Why it matters

- **Star ratings in SERPs**: The most visible rich result — yellow stars dramatically improve CTR
- **Social proof**: Displays review count and rating directly in search results
- **Trust signals**: Third-party reviews (especially from Google) add credibility

### Implementation approach

✅ **Embedded in ProfessionalService** (already planned in Phase 2)

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "100",
  "bestRating": "5",
  "worstRating": "1"
}
```

### Important notes

⚠️ **Google's Review Guidelines:**

- Reviews must be about the **business itself**, not products/services sold
- Reviews must be from **verifiable sources** (Google Business Profile is ideal)
- Using Google reviews data is acceptable since it's a legitimate third-party source

---

## Implementation Order Summary

| Priority | Schema                             | Status      | Phase |
| -------- | ---------------------------------- | ----------- | ----- |
| 1        | **ProfessionalService** (combined) | ✅ Complete | 1, 2  |
| —        | ↳ Organization properties          | ✅ Included | —     |
| —        | ↳ LocalBusiness properties         | ✅ Included | —     |
| —        | ↳ AggregateRating (embedded)       | ✅ Included | —     |
| 2        | **WebSite**                        | ✅ Complete | 2     |
| 3        | **BlogPosting** (blog posts)       | ✅ Complete | 4     |

---

## Validation Resources

After implementing each schema:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **View page source** and verify JSON-LD output
4. **Monitor GSC** for structured data issues after deployment

---

## Files Summary

| Phase | File                                                       | Action                        | Status |
| ----- | ---------------------------------------------------------- | ----------------------------- | ------ |
| 1     | `apps/sanity/schema/singleTypes/global.tsx`                | Extend with new fields        | ✅     |
| 2     | `apps/www/src/components/schemas/OrganizationSchema.astro` | Create new component          | ✅     |
| 2     | `apps/www/src/layout/Layout.astro`                         | Import OrganizationSchema     | ✅     |
| 4.1   | `packages/ui/src/portable-text/portable-text-to-html.ts`   | Expand with custom components | ✅     |
| 4.1   | `packages/ui/src/portable-text/index.ts`                   | Export calculateWordCount     | ✅     |
| 4.2   | `apps/www/src/components/schemas/ArticleSchema.astro`      | Create new component          | ✅     |
| 4.3   | `apps/www/src/components/Blog/Post/Hero.astro`             | Add imageUrl to query         | ✅     |
| 4.3   | `apps/www/src/templates/blog/[slug].astro`                 | Integrate ArticleSchema       | ✅     |

---

## Sanity Schema Changes Summary ✅ IMPLEMENTED

### Fields ADDED to `global.tsx`

```typescript
// In OrganizationSchema object:
logo: image // Organization logo ✅
foundingDate: date // Company founding date ✅
priceRange: string // Price tier indicator ($, $$, $$$, $$$$) ✅
areaServed: array // Cities served (for local SEO) ✅

// Restructured address object:
address: {
  addressText: string // Keep (human-readable, for UI) ✅
  mapLink: url // Keep (for UI) ✅
  streetAddress: string // NEW - Street name and number ✅
  addressLocality: string // NEW - City ✅
  postalCode: string // NEW - Postal code ✅
  addressCountry: string // NEW - Country code (default: "PL") ✅
  geo: {
    latitude: number // NEW - GPS latitude ✅
    longitude: number // NEW - GPS longitude ✅
  }
}
```
