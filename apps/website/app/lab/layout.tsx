import type { PropsWithChildren } from "react";

export default function LabLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div
        style={{
          backgroundColor: "#7f1d1d",
          borderBottom: "1px solid #991b1b",
          color: "#fee2e2",
          fontFamily: "var(--font-instrument-sans), sans-serif",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            maxWidth: "72rem",
            padding: "0.75rem 1.5rem",
          }}
        >
          <strong style={{ display: "block", fontSize: "0.95rem" }}>Interner Lab-Bereich</strong>
          <span style={{ fontSize: "0.875rem", opacity: 0.92 }}>
            Diese Route ist nur fuer interne Tests gedacht und gehoert nicht zur oeffentlichen Produktflaeche.
          </span>
        </div>
      </div>
      {children}
    </>
  );
}
