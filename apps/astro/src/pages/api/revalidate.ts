export const prerender = false;

import sanityFetch from "@/utils/sanity.fetch";

const SANITY_REVALIDATE_BEARER = import.meta.env.SANITY_REVALIDATE_BEARER || process.env.SANITY_REVALIDATE_BEARER;

type RequestType = {
  tag: string;
  id?: string;
};

export async function POST({ request }: { request: Request }) {
  const authorizationHeader = request.headers.get('Authorization');

  if (authorizationHeader !== `Bearer ${SANITY_REVALIDATE_BEARER}`) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const { tag, id } = (await request.json()) as RequestType;


  const query = async (tag: string, id?: string) => {
    let queryHeader = `*[_type == "${tag}"][0]`;
    if (id) queryHeader = `*[_type == "${tag}" && _id == "${id}"][0]`;
    return await sanityFetch<{ references: string[] }>({
      query: /* groq */ `
        ${queryHeader}{
          "references": *[references(^._id)]._type,
        }
      `,
    });
  };

  console.log(request.headers.get("Authorization"));
  console.log(process.env.VERCEL_DEPLOYMENT_ID);
  console.log(await request.json());
  console.log(await query(tag, id));

  return new Response(JSON.stringify({ revalidated: false, timestamp: Date.now() }), { status: 200 });
}
