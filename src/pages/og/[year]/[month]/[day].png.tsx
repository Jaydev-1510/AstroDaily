import { database } from "@lib/database";
import { ImageResponse } from "@vercel/og";

export const prerender = false;

export async function GET({
  params,
}: {
  params: { year: string; month: string; day: string };
}) {
  const { year, month, day } = params;
  const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const { data: Apod } = await database
    .from("APODs")
    .select("*")
    .eq("date", dateStr)
    .single();

  const title = Apod?.title || "Astronomy Picture of the Day";
  const bgUrl = Apod?.url;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      <img
        src={bgUrl || ""}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.6,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px",
          textAlign: "center",
          color: "#fff",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            fontSize: 30,
            color: "white",
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          astroDaily
        </div>

        <div
          style={{
            fontSize: 60,
            fontWeight: "bold",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 24,
            marginTop: 40,
            opacity: 0.8,
          }}
        >
          {dateStr}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
