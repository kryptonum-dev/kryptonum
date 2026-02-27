/**
 * Global declaration of the domain for the application.
 * This constant is used for constructing full URLs and determining external links.
 * @constant
 * @type {string}
 */
export const DOMAIN: string = "https://kryptonum.eu";

/**
 * Preview domains for different subdomains.
 * Environment variables should contain the full URL including protocol (https://)
 * but without trailing slash. Example: "https://preview.kryptonum.eu"
 * @constant
 * @type {Record<string, string>}
 */
export const PREVIEW_DOMAINS: Record<string, string> = {
  // Main domain (default)
  main: process.env.SANITY_STUDIO_PREVIEW_DOMAIN ?? DOMAIN,
  // Links subdomain for Links_Page and LandingPage_Collection
  links: process.env.SANITY_STUDIO_PREVIEW_LINKS_DOMAIN ?? "https://l.kryptonum.eu",
  // Learn subdomain for ShopProduct_Collection
  learn: process.env.SANITY_STUDIO_PREVIEW_LEARN_DOMAIN ?? "https://learn.kryptonum.eu"
} as const;

