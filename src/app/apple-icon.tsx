import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#172123",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            fontSize: 88,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
          }}
        >
          <span style={{ color: "#ffffff" }}>m</span>
          <span style={{ color: "#758d91" }}>c</span>
        </div>
        <span
          style={{
            marginTop: 12,
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#5b7074",
            fontWeight: 800,
          }}
        >
          Maison Calvé
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
