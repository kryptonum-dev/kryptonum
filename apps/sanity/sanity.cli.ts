import { defineCliConfig } from 'sanity/cli'

const studioHost = process.env.SANITY_STUDIO_HOST || 'kryptonum';
const isStaging = studioHost === 'kryptonum-staging';

export default defineCliConfig({
  api: {
    projectId: 'k3p1raj0',
    dataset: 'production'
  },
  studioHost: studioHost,
  deployment: {
    // Different app IDs for different studio hosts
    appId: isStaging ? 'dkhnqp27a111zv00vkuw5nh1' : undefined,
  },
})
