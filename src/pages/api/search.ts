import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { database } from "@lib/database";
import PreApodCard from "@components/preApodCard.astro";

export const GET: APIRoute = async ({ url }) => {
  const q     = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "18"), 100);
  const page  = Math.max(parseInt(url.searchParams.get("page")  ?? "0"),  0);

  if (!q) {
    return new Response(JSON.stringify({ html: "", count: 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, count, error } = await database
    .from("APODs")
    .select("*", { count: "exact" })
    .textSearch("fts", q, { type: "websearch", config: "english" })
    .order("date", { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const container = await AstroContainer.create();
  const htmlChunks = await Promise.all(
    (data ?? []).map((apod) =>
      container.renderToString(PreApodCard, {
        props: { Apod: apod },
      })
    )
  );
  const html = htmlChunks.join("");

  return new Response(JSON.stringify({ html, count, page, limit }), {
    headers: { "Content-Type": "application/json" },
  });
};