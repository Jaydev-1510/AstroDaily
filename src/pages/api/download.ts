import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get("url");
  const imageTitle = url.searchParams.get("title");

  if (!imageUrl) {
    return new Response("Missing URL", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=${imageTitle}`,
      },
    });
  } catch (err) {
    return new Response("Download failed", { status: 500 });
  }
};
