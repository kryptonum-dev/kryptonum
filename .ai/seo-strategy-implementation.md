# SEO Strategy — Technical Implementation Plan (2026)

This document extracts **only the technical SEO work** we can implement ourselves from `.ai/seo-strategy-overview.md`.  
It is written in English and ordered from **quick wins** to **more complex changes**. No backlink or content strategy execution is included here (except where technical SEO intersects, e.g. internal linking architecture and indexation control).

---

## Core technical diagnosis (what’s broken)

- **Index bloat & crawl waste**: A lot of URLs are being crawled but not indexed (“Crawled – currently not indexed”), especially:
  - pagination pages,
  - English pages,
  - very similar PL service/local pages.
- **Weak “winners” (pillar URLs)**: the domain is strong, but individual converting pages have weak signals because:
  - too many similar pages compete/cannibalize,
  - sitewide links (footer) spread internal link equity too broadly,
  - Google doesn’t see clear priorities.
- **Technical correctness issues** (observed in the strategy notes):
  - broken `hreflang` link: `https://kryptonum.eunull`,
  - canonical/hreflang and structured data need a full pass.

The technical goal is to **reduce low-value indexation**, **fix correctness (hreflang/canonicals)**, and **concentrate crawl + internal link equity** on pages that should rank and convert.

---

## Principles we will follow

- **PL is the priority for 2026** (EN is not a target). That should be reflected in:
  - what gets indexed,
  - what appears in sitemaps,
  - how hreflang is implemented (or reduced).
- **Only index what we want to rank.** Everything else should be:
  - `noindex,follow` (keep link equity flowing),
  - excluded from sitemaps,
  - optionally blocked from crawling when appropriate (robots).
- **Make priorities explicit**:
  - fewer sitewide links to low-priority pages,
  - stronger internal linking toward pillar pages.

---

## Quick wins (same day → 2 days)

### 1) Fix broken `hreflang` output (`kryptonum.eunull`)

- **What to do**
  - Find where `hreflang` alternate URLs are generated.
  - Fix the logic that produces `https://kryptonum.eunull`.
  - Ensure all `hreflang` entries are valid absolute URLs.
- **Why this helps**
  - Broken hreflang can confuse crawlers, waste crawl budget, and create indexing inconsistencies across language variants.
  - It’s also a “trust” signal: obvious markup bugs reduce confidence in page quality.
- **Acceptance checks**
  - View page source on key pages and confirm `rel="alternate" hreflang="…"` URLs are valid.
  - Crawl a sample (homepage, a service page, a blog post, a local page) and confirm zero malformed hreflang URLs.

### 2) Clean up sitemap output (remove low-value URLs)

You currently have a large sitemap set (example snapshot shows ~300 URLs, including EN and pagination). The strategy explicitly says: “Clean the sitemap”.

- **What to do**
  - Update sitemap generation to include **only indexable URLs**.
  - Exclude:
    - **EN pages** (if they’re `noindex` or not a target),
    - **pagination** pages,
    - filters and “trash” URLs (any parameterized or thin pages),
    - any URL we mark as `noindex`.
- **Why this helps**
  - Sitemap is a priority hint to Google. Removing junk URLs:
    - reduces crawl waste,
    - improves indexation rate for important pages,
    - helps GSC coverage reports become more actionable.
- **Acceptance checks**
  - `sitemap-index.xml` (or the relevant sitemap endpoint) contains:
    - pillar pages,
    - key local pages (only those we actually want indexed),
    - blog posts that are lead-gen / high quality,
    - case studies (if indexable).
  - It does **not** contain EN / pagination / filters.

### 3) Apply `noindex,follow` where appropriate (EN + pagination)

Strategy quick wins mention:
- EN → noindex
- pagination → noindex follow

- **What to do**
  - Add `meta name="robots" content="noindex,follow"` for:
    - EN pages (if we keep them accessible but not indexable),
    - pagination pages.
  - If you have route-based templates, apply this programmatically (so it’s consistent and hard to forget).
- **Why this helps**
  - Prevents index bloat while still allowing Google to crawl through and pass link equity.
  - Especially important if pagination creates many near-duplicate pages.
- **Acceptance checks**
  - Spot-check multiple EN pages and multiple pagination pages:
    - they all output `noindex,follow`,
    - they are excluded from sitemap.

### 4) Reduce sitewide footer links to city/local pages

The strategy notes say the sitewide footer links to all services + all local pages “dilute importance”.

- **What to do**
  - Remove or heavily reduce “all cities” sitewide links in the footer.
  - Prefer:
    - linking cities only from relevant pillar pages,
    - or linking a smaller curated set (top cities) from a single hub page.
- **Why this helps**
  - Sitewide links massively influence internal PageRank distribution.
  - Reducing them concentrates equity on pages we care about, improving rankings for “winner” URLs.
- **Acceptance checks**
  - Footer no longer contains huge “city directory” sections on every page.
  - Key pillar pages now have cleaner, more intentional internal linking.

### 5) Ensure `kryptonum.eu` redirects to `/pl`

The strategy suggests redirecting the root domain to `/pl`.

- **What to do**
  - Implement a consistent redirect rule:
    - `https://kryptonum.eu/` → `https://kryptonum.eu/pl` (or `/pl/` depending on your canonical trailing slash policy).
  - Decide and enforce trailing slash policy sitewide.
- **Why this helps**
  - Avoids splitting signals between multiple “home” URLs.
  - Makes PL the default entry point for both users and crawlers.
- **Acceptance checks**
  - Visiting the bare domain always ends up on `/pl` with a single 301.
  - Canonical tag on the destination matches the final URL.

---

## Short-term (3 days → 2 weeks)

### 6) Canonical strategy: “one URL = one indexable version”

The strategy says “fix canonicals”.

- **What to do**
  - Define rules for:
    - trailing slash vs no trailing slash,
    - http → https,
    - host canonicalization (www vs non-www),
    - language variants (`/pl` vs `/en`),
    - query params (UTM, filters) canonicalized to clean URL.
  - Ensure:
    - indexable pages have a correct self-referencing canonical,
    - `noindex` pages do not accidentally canonical to something harmful (generally ok to canonical to the main version, but be intentional).
- **Why this helps**
  - Reduces duplicate-content signals and consolidates ranking signals onto one canonical URL.
  - Particularly important when you have many similar local pages.
- **Acceptance checks**
  - Run a small crawl (or systematic spot checks) verifying:
    - no canonical points to a 404,
    - canonicals are absolute, correct, and consistent,
    - no cross-language canonical mistakes.

### 7) Structured data baseline (Organization / LocalBusiness / FAQ / Article / Reviews)

The strategy lists these schema types explicitly.

- **What to do**
  - Implement JSON-LD for:
    - **Organization** (sitewide),
    - **LocalBusiness** (if applicable) including `sameAs` links (Google Business Profile, Facebook, etc.),
    - **FAQ** (on pages that truly contain FAQ content),
    - **Article** (blog posts),
    - **Review / AggregateRating** (if you have legitimate review sources and can comply with Google’s guidelines).
- **Why this helps**
  - Improves entity understanding and can unlock enhanced SERP features (rich results) when eligible.
  - Supports trust, clarity, and potentially CTR.
- **Acceptance checks**
  - Validate JSON-LD with Google Rich Results Test (or schema validator).
  - Ensure schema matches on-page visible content (avoid spammy markup).

### 8) Headings & above-the-fold SEO hygiene

The strategy mentions fixing headings and “SEO above the fold”.

- **What to do**
  - Standardize H1 usage:
    - one clear H1 per page,
    - H2/H3 structure aligned to page intent.
  - Ensure above-the-fold includes:
    - the primary topic (service keyword),
    - a clear value proposition,
    - a visible CTA (technical SEO indirectly supports conversion + engagement).
- **Why this helps**
  - Helps relevance and reduces ambiguity for both users and crawlers.
  - Better UX → better engagement signals, lower pogo-sticking risk.
- **Acceptance checks**
  - Template-level review ensures consistent heading structure across page types.

### 9) Image alt text and media hygiene

The strategy mentions reviewing alts.

- **What to do**
  - Ensure meaningful alt text where images convey information.
  - Use empty alt (`alt=""`) for decorative images to avoid noise.
  - Optimize image sizes and formats (you likely already do; just verify).
- **Why this helps**
  - Accessibility + image search relevance.
  - Better perceived quality and potential minor ranking/CTR improvements.
- **Acceptance checks**
  - Spot-check key templates for correct alt usage and no missing required alts.

---

## Medium complexity (2 → 6 weeks)

### 10) Indexation audit: classify every route type

The strategy calls for clarifying indexation rules (“Ustalenie indeksowania obecnych stron”).

- **What to do**
  - Make a route inventory (by template/type), and decide for each:
    - index / noindex,
    - include in sitemap / exclude,
    - canonical behavior,
    - hreflang behavior.
  - Typical categories:
    - pillar service pages (index + sitemap),
    - local service pages (index only for selected “top” cities; otherwise noindex),
    - blog posts (index only lead-gen/high quality),
    - case studies (index if useful and unique),
    - pagination (noindex,follow),
    - filters/search (noindex or robots disallow),
    - EN pages (noindex or removed from crawl path).
- **Why this helps**
  - Removes ambiguity and prevents “accidental index bloat” as the site grows.
  - Makes sitemap and internal linking strategy coherent.
- **Acceptance checks**
  - Every route type has an explicit rule and it’s enforced in code/templates.

### 11) Internal linking architecture: pillar-first linking (technical execution)

The strategy says internal linking is key and mentions a pillar/cluster approach.

- **What to do (technical)**
  - Implement internal linking patterns that:
    - link clusters → pillar pages,
    - link pillar pages → selected supporting pages (cities, relevant blog posts, case studies),
    - keep cross-linking limited and intentional.
  - Reduce sitewide navigation to only truly important sections.
  - If you have a CMS (Sanity), consider:
    - explicitly modeling “related pages” / “pillar target” fields,
    - rendering them consistently in templates.
- **Why this helps**
  - Concentrates internal PageRank on “winner” pages.
  - Reduces keyword cannibalization and clarifies topical authority.
- **Acceptance checks**
  - Pillar pages gain more internal links from relevant clusters than from unrelated pages.
  - Crawl shows a clear hub-and-spoke structure.

---

## Advanced / most complex (6 weeks+)

### 12) Consolidation & de-duplication strategy for near-identical local pages (technical side)

The strategy identifies many similar PL local pages as a core issue. While content uniqueness is a content task, there are technical levers:

- **What to do**
  - Decide per local page:
    - keep and make truly unique (content),
    - or **de-index** (`noindex,follow`) and remove from sitemap,
    - or consolidate via redirects (only if safe and intentional).
  - Consider a “top city” shortlist that stays indexable; de-index the rest until unique content exists.
- **Why this helps**
  - Reduces “Crawled – currently not indexed” by removing pages Google doesn’t want.
  - Prevents cannibalization: fewer similar pages competing for the same queries.
- **Acceptance checks**
  - GSC coverage improves (fewer low-quality URLs attempted).
  - Pillar pages improve in average position and impressions for core queries.

### 13) Continuous monitoring loop (GSC + crawl diagnostics)

The strategy says to monitor indexing in GSC after cleaning the sitemap.

- **What to do**
  - In Google Search Console:
    - submit cleaned sitemap,
    - track Coverage/Indexing reports and Crawl stats,
    - monitor “Crawled – currently not indexed” and “Duplicate, Google chose different canonical”.
  - Establish a weekly checklist:
    - new pages indexation correctness,
    - sitemap diffs,
    - top query CTR and page-level performance.
- **Why this helps**
  - SEO recovery is iterative. Monitoring prevents regressions and validates changes.
- **Acceptance checks**
  - Trend: fewer excluded low-value URLs, more indexed high-value URLs.
  - Fewer canonical/hreflang errors over time.

---

## Implementation checklist (summary)

- **Fix** broken `hreflang` output (`kryptonum.eunull`)
- **Sitemap**: include only indexable URLs; remove EN/pagination/filters/noindex
- **Robots meta**: EN + pagination → `noindex,follow`
- **Footer**: remove city sitewide links; re-route linking via pillar pages
- **Redirect** bare domain → `/pl` (define trailing slash policy)
- **Canonicals**: single canonical per page, consistent rules
- **Schema**: Organization, LocalBusiness (+sameAs), FAQ, Article, Reviews (where valid)
- **Headings**: consistent H1/H2 structure + above-the-fold basics
- **Alt text**: meaningful alt for informative images; empty alt for decorative
- **Indexation rules**: per route type (index/noindex, sitemap yes/no)
- **Internal linking**: pillar-first architecture
- **Local pages**: de-index or consolidate near-duplicates unless truly unique
- **Monitoring**: GSC + crawl loop

