import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { database } from "@lib/database";
import PreApodCard from "@components/preApodCard.astro";

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get("q")?.trim() ?? "";
  const mediaType = url.searchParams.get("media_type") ?? "";
  const decade = url.searchParams.get("decade") ?? "";
  const year = url.searchParams.get("year") ?? "";
  const month = url.searchParams.get("month") ?? "";
  const day = url.searchParams.get("day") ?? "";
  const copyright = url.searchParams.get("copyright") ?? "";
  const sort = url.searchParams.get("sort") === "asc" ? true : false;
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "18"), 100);
  const page = Math.max(parseInt(url.searchParams.get("page")  ?? "0"),  0);

  let query = database
    .from("APODs")
    .select("*", { count: "exact" });

  if (q) {
    query = query.textSearch("fts", q, { type: "websearch", config: "english" });
  }

  if (mediaType === "image" || mediaType === "video") {
    query = query.eq("media_type", mediaType);
  }

  if (decade && !year) {
    const decadeNum = parseInt(decade);
    query = query
      .gte("date", `${decadeNum}-01-01`)
      .lte("date", `${decadeNum + 9}-12-31`);
  }

  if (year) {
    query = query
      .gte("date", `${year}-01-01`)
      .lte("date", `${year}-12-31`);
  }

  if (month && day && !year && !decade) {
    const mm = month.padStart(2, "0");
    const dd = day.padStart(2, "0");
    query = query.like("date", `%-${mm}-${dd}`);
  } else if (month && !day && !year && !decade) {
    const mm = month.padStart(2, "0");
    query = query.like("date", `%-${mm}-%`);
  }

  if (copyright === "true") {
    query = query.not("copyright", "is", null);
  } else if (copyright === "false") {
    query = query.is("copyright", null);
  }

  query = query
    .order("date", { ascending: sort })
    .range(page * limit, page * limit + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const container = await AstroContainer.create();
  const htmlChunks = await Promise.all(
    (data ?? []).map((apod) =>
      container.renderToString(PreApodCard, { props: { Apod: apod } })
    )
  );

  return new Response(
    JSON.stringify({ html: htmlChunks.join(""), count, page, limit }),
    { headers: { "Content-Type": "application/json" } }
  );
};