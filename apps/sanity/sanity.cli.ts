import { defineCliConfig } from 'sanity/cli'

const studioHost = process.env.SANITY_STUDIO_HOST || 'kryptonum';
const stagingAppId = process.env.SANITY_STUDIO_STAGING_APP_ID;
const productionAppId = process.env.SANITY_STUDIO_PRODUCTION_APP_ID ?? 'vsofytliubmw5ltwl91fii9m';

export default defineCliConfig({
  api: {
    projectId: 'k3p1raj0',
    dataset: 'production'
  },
  studioHost: studioHost,
  deployment: {
    appId: studioHost === 'kryptonum-staging' ? stagingAppId : productionAppId,
  },
})
