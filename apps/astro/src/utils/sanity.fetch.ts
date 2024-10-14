import { createClient, type QueryParams } from '@sanity/client'
import { isPreviewDeployment } from './is-preview-deployment';
import { loadEnv } from "vite";

const { SANITY_API_TOKEN } = loadEnv(process.env.SANITY_API_TOKEN!, process.cwd(), "");

if (isPreviewDeployment && !SANITY_API_TOKEN) {
  throw new Error("The `SANITY_API_TOKEN` environment variable is required.");
}

export const client = createClient({
  projectId: 'k3p1raj0',
  dataset: 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  perspective: isPreviewDeployment ? 'previewDrafts' : 'published',
  ...(isPreviewDeployment && { token: SANITY_API_TOKEN }),
})

export default async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
}): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params);
}
