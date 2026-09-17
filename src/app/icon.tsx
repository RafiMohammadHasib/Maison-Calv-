import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#172123",
          borderRadius: 18,
          border: "2px solid #3a4b4e",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>m</span>
          <span style={{ color: "#758d91" }}>c</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
