import { datenschutz } from "@/legal/datenschutz";

export const metadata = {
  title: "Datenschutz | ResQBrain",
  robots: "index, follow",
};

const body = datenschutz.replace(/^Datenschutzerklaerung\s*\n+/, "").trim();

export default function DatenschutzPage() {
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
            Datenschutz
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
