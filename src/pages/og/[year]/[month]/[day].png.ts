import { ImageResponse } from "@vercel/og";
import { database } from "@lib/database";

export const prerender = false;

export async function GET({ params }) {
  const { year, month, day } = params;
  const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const { data } = await database
    .from("APODs")
    .select("title, url")
    .eq("date", dateStr)
    .single();

  const title = data?.title || "Astronomy Picture of the Day";
  const bgUrl = data?.url || "https://your-default-bg.jpg";

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          position: "relative",
        },
        children: [
          {
            type: "img",
            props: {
              src: bgUrl,
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px",
                textAlign: "center",
                color: "#fff",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              },
              children: [
                {
                  type: "div",
                  props: {
                    children: "astroDaily",
                    style: {
                      fontSize: 30,
                      color: "white",
                      marginBottom: 20,
                      fontWeight: "bold",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    children: title,
                    style: { fontSize: 60, fontWeight: "bold" },
                  },
                },
                {
                  type: "div",
                  props: {
                    children: dateStr,
                    style: { fontSize: 24, marginTop: 40, opacity: 0.8 },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 },
  );
}
