import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import icon from "@/assets/icon.png";
import { BACKGROUND_COLOR, DEFAULT_DESCRIPTION, DEFAULT_TITLE, THEME_COLOR } from "@/global/constants";

const sizes = [192, 512];

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    sizes.map(async size => {
      const { src, options: { format, width, height } } = await getImage({
        src: icon,
        width: size,
        height: size,
        format: "png",
      });
      return {
        src: src,
        type: `image/${format}`,
        sizes: `${width}x${height}`,
      };
    })
  );

  const manifest = JSON.stringify({
    start_url: "/",
    display: "standalone",
    name: DEFAULT_TITLE,
    short_name: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons,
  });

  return new Response(manifest, {
    headers: { "Content-Type": "application/manifest+json" },
  });
};
