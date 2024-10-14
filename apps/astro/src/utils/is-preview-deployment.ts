export const isPreviewDeployment = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production";
