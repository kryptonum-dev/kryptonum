import { definePlugin } from 'sanity'
import { DOMAIN } from '../constants';

export const showProductionUrl = definePlugin({
  name: 'Production URL',
  document: {
    productionUrl: async (_, { document }) => {
      const slug = (document.slug as { current?: string })?.current
      if (!slug) return;
      return `${DOMAIN}${slug}`;
    }
  }
})
