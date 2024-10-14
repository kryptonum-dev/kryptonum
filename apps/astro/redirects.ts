import type { ValidRedirectStatus } from 'astro';
import sanityFetch from './src/utils/sanity.fetch'

type RedirectData = {
  source: string;
  destination: string;
  isPermanent: boolean;
};

const data = await sanityFetch<RedirectData[]>({
  query: `
    *[_type == "redirects"][0].redirects {
      "source": source.current,
      "destination": destination.current,
      isPermanent,
    }[]
  `
});
const redirects = data ? Object.fromEntries(
  data.map(({ source, destination, isPermanent }) => [
    source, {
      status: (isPermanent ? 301 : 302) as ValidRedirectStatus,
      destination
    }
  ])
) : {};
const permanentRedirects = data ? data.filter(r => r.isPermanent).length : 0;
const temporaryRedirects = data ? data.length - permanentRedirects : 0;
console.log('\x1b[32m%s\x1b[0m', `✅ \x1b[1m${Object.keys(redirects).length}\x1b[0m\x1b[32m redirects added from Sanity (\x1b[1m${permanentRedirects}\x1b[0m\x1b[32m permanent and \x1b[1m${temporaryRedirects}\x1b[0m\x1b[32m temporary)`);

export default redirects;
