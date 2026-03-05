import type { APIRoute } from "astro";
import { ImageResponse } from "@vercel/og";
import { database } from "@lib/database";

export const GET: APIRoute = async ({ params }) => {
  try {
    const [geistRegularResponse, geistBoldResponse] = await Promise.all([
      fetch(
        "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.ttf",
      ),
      fetch(
        "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.ttf",
      ),
    ]);

    const geistRegular = await geistRegularResponse.arrayBuffer();
    const geistBold = await geistBoldResponse.arrayBuffer();

    const { date } = params;
    const day = date ? date.replace(/-/g, " ") : "1995-06-16";
    const { data: Apod } = await database
      .from("APODs")
      .select("*")
      .eq("date", day)
      .single();
    
    if (Apod?.url && ! Apod?.url.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i)) {
      return Response.redirect("/banner.png", 302);
    }
    
    return new ImageResponse(
      {
        type: "div",
        props: {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            backgroundColor: "#000000",
            position: "relative",
            fontFamily: "sans-serif",
          },
          children: [
            ...(Apod?.url
              ? [
                  {
                    type: "img",
                    props: {
                      src: Apod?.url,
                      style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    },
                  },
                ]
              : []),
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
              },
            },
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        backgroundImage:
                          "linear-gradient(to top, rgb(0, 0, 0) 5%, rgba(0, 0, 0, 0))",
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            style: {
                              fontSize: 28,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.25em",
                              color: "rgba(255, 255, 255)",
                            },
                            children: Apod?.date,
                          },
                        },
                        {
                          type: "h2",
                          props: {
                            style: {
                              fontSize: 72,
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                              color: "#ffffff",
                            },
                            children: Apod?.title,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      } as any,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Geist",
            data: geistRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Geist",
            data: geistBold,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch {return Response.redirect("/banner.png", 302);}
};
