import { impressum } from "@/legal/impressum";

export const metadata = {
  title: "Impressum | ResQBrain",
  robots: "index, follow",
};

const body = impressum.replace(/^Impressum\s*\n+/, "").trim();

export default function ImpressumPage() {
  return (
    <main className="section">
      <div className="container">
        <article
          style={{
            maxWidth: "min(100%, 42rem)",
            marginInline: "auto",
          }}
        >
          <h1
            style={{
              margin: "0 0 clamp(1rem, 3vw, 1.5rem)",
              fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
              lineHeight: 1.15,
            }}
          >
            Impressum
          </h1>
          <div
            style={{
              whiteSpace: "pre-line",
              lineHeight: 1.65,
            }}
          >
            {body}
          </div>
        </article>
      </div>
    </main>
  );
}
