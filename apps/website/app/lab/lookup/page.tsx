import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  getAlgorithmDetail,
  getLookupApiErrorMessage,
  getMedicationDetail,
  listAlgorithms,
  listMedications,
  searchLookup,
} from "@/lib/lookup-api/client";
import type {
  LookupAlgorithmListItem,
  LookupMedicationListItem,
  LookupSearchResultItem,
} from "@/lib/lookup-api/types";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";

export const metadata: Metadata = {
  title: "Lab Lookup",
  description: "Interne, nicht oeffentlich verlinkte Lookup-Testoberflaeche",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "Lab Lookup",
    description: "Interne Testoberflaeche, kein Produktbereich",
    url: "/lab/lookup",
    siteName: "ResQBrain",
    type: "website",
  },
  alternates: {
    canonical: "/lab/lookup",
  },
};

type PageSearchParams = Promise<{
  q?: string;
  organizationId?: string;
  regionId?: string;
  stationId?: string;
  selectedType?: string;
  selectedId?: string;
}>;

const panelStyle = {
  border: "1px dashed rgba(148, 163, 184, 0.45)",
  borderRadius: "1rem",
  padding: "1rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  backgroundColor: "rgba(15, 23, 42, 0.04)",
  color: "inherit",
};

const listStyle = { listStyle: "none", margin: 0, padding: 0 } as const;

function normalizeSearchParams(params: Awaited<PageSearchParams>) {
  return {
    q: params.q?.trim() ?? "",
    organizationId: params.organizationId?.trim() || "pilot-wache-001",
    regionId: params.regionId?.trim() || "",
    stationId: params.stationId?.trim() || "",
    selectedType: params.selectedType === "medication" ? "medication" : params.selectedType === "algorithm" ? "algorithm" : "",
    selectedId: params.selectedId?.trim() || "",
  };
}

function buildLookupHref(
  params: ReturnType<typeof normalizeSearchParams>,
  nextValues: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();
  const mergedValues = {
    q: params.q,
    organizationId: params.organizationId,
    regionId: params.regionId,
    stationId: params.stationId,
    selectedType: params.selectedType,
    selectedId: params.selectedId,
    ...nextValues,
  };

  for (const [key, value] of Object.entries(mergedValues)) {
    if (value && value.trim().length > 0) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `/lab/lookup?${query}` : "/lab/lookup";
}

function SearchAndFiltersForm({
  q,
  organizationId,
  regionId,
  stationId,
}: {
  q: string;
  organizationId: string;
  regionId: string;
  stationId: string;
}) {
  return (
    <form method="GET">
      <Stack gap="sm">
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div>
            <label htmlFor="lab-lookup-q" className="small-text muted-text" style={{ display: "block", marginBottom: "0.5rem" }}>
              Search
            </label>
            <input
              id="lab-lookup-q"
              name="q"
              type="text"
              defaultValue={q}
              placeholder="z. B. Reanimation, Adrenalin"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              htmlFor="lab-lookup-organization-id"
              className="small-text muted-text"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              organizationId
            </label>
            <input
              id="lab-lookup-organization-id"
              name="organizationId"
              type="text"
              defaultValue={organizationId}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="lab-lookup-region-id" className="small-text muted-text" style={{ display: "block", marginBottom: "0.5rem" }}>
              regionId
            </label>
            <input id="lab-lookup-region-id" name="regionId" type="text" defaultValue={regionId} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="lab-lookup-station-id" className="small-text muted-text" style={{ display: "block", marginBottom: "0.5rem" }}>
              stationId
            </label>
            <input id="lab-lookup-station-id" name="stationId" type="text" defaultValue={stationId} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <button
            type="submit"
            className="button-link"
            style={{ cursor: "pointer", justifyContent: "center" }}
          >
            Laden
          </button>
          <Link className="button-link button-link--secondary" href="/lab/lookup">
            Reset
          </Link>
        </div>
      </Stack>
    </form>
  );
}

async function SearchResultsPanel({
  q,
  organizationId,
  regionId,
  stationId,
}: {
  q: string;
  organizationId: string;
  regionId: string;
  stationId: string;
}) {
  if (!q) {
    return <p className="small-text muted-text">Kein aktiver Suchbegriff. Suche ist optional.</p>;
  }

  let results: LookupSearchResultItem[] = [];

  try {
    results = await searchLookup({
      searchTerm: q,
      organizationId,
      regionId: regionId || undefined,
      stationId: stationId || undefined,
    });
  } catch (error) {
    return <p className="small-text" style={{ color: "#fca5a5", margin: 0 }}>{getLookupApiErrorMessage(error)}</p>;
  }

  if (results.length === 0) {
    return <p className="small-text muted-text">Keine Suchtreffer fuer den aktuellen Begriff.</p>;
  }

  return (
    <ul style={listStyle}>
      {results.map((item) => (
        <li key={item.id} style={{ padding: "0.55rem 0", borderBottom: "1px solid rgba(148, 163, 184, 0.16)" }}>
          <strong>{item.title}</strong>
          <span className="small-text muted-text" style={{ display: "block" }}>
            {item.id}
          </span>
          {item.summary ? (
            <span className="small-text muted-text" style={{ display: "block", marginTop: "0.35rem" }}>
              {item.summary}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

async function AlgorithmListPanel({ params }: { params: ReturnType<typeof normalizeSearchParams> }) {
  let items: LookupAlgorithmListItem[] = [];

  try {
    const response = await listAlgorithms({
      organizationId: params.organizationId,
      regionId: params.regionId || undefined,
      stationId: params.stationId || undefined,
      searchTerm: params.q || undefined,
    });
    items = response.items;
  } catch (error) {
    return <p className="small-text" style={{ color: "#fca5a5", margin: 0 }}>{getLookupApiErrorMessage(error)}</p>;
  }

  if (items.length === 0) {
    return <p className="small-text muted-text">Keine Algorithmen gefunden.</p>;
  }

  return (
    <ul style={listStyle}>
      {items.map((item) => {
        const isSelected = params.selectedType === "algorithm" && params.selectedId === item.id;

        return (
          <li key={item.id} style={{ padding: "0.55rem 0", borderBottom: "1px solid rgba(148, 163, 184, 0.16)" }}>
            <Link
              href={buildLookupHref(params, { selectedType: "algorithm", selectedId: item.id })}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <strong>{item.title}</strong>
              <span className="small-text muted-text" style={{ display: "block" }}>
                {item.id}
              </span>
              {item.summary ? (
                <span className="small-text muted-text" style={{ display: "block", marginTop: "0.35rem" }}>
                  {item.summary}
                </span>
              ) : null}
              <span
                className="small-text"
                style={{ display: "block", marginTop: "0.35rem", color: isSelected ? "#cbd5e1" : "#94a3b8" }}
              >
                {isSelected ? "Ausgewaehlt" : "Detail laden"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

async function MedicationListPanel({ params }: { params: ReturnType<typeof normalizeSearchParams> }) {
  let items: LookupMedicationListItem[] = [];

  try {
    const response = await listMedications({
      organizationId: params.organizationId,
      regionId: params.regionId || undefined,
      stationId: params.stationId || undefined,
      searchTerm: params.q || undefined,
    });
    items = response.items;
  } catch (error) {
    return <p className="small-text" style={{ color: "#fca5a5", margin: 0 }}>{getLookupApiErrorMessage(error)}</p>;
  }

  if (items.length === 0) {
    return <p className="small-text muted-text">Keine Medikamente gefunden.</p>;
  }

  return (
    <ul style={listStyle}>
      {items.map((item) => {
        const isSelected = params.selectedType === "medication" && params.selectedId === item.id;

        return (
          <li key={item.id} style={{ padding: "0.55rem 0", borderBottom: "1px solid rgba(148, 163, 184, 0.16)" }}>
            <Link
              href={buildLookupHref(params, { selectedType: "medication", selectedId: item.id })}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <strong>{item.name}</strong>
              <span className="small-text muted-text" style={{ display: "block" }}>
                {item.id}
              </span>
              {item.summary ? (
                <span className="small-text muted-text" style={{ display: "block", marginTop: "0.35rem" }}>
                  {item.summary}
                </span>
              ) : null}
              <span
                className="small-text"
                style={{ display: "block", marginTop: "0.35rem", color: isSelected ? "#cbd5e1" : "#94a3b8" }}
              >
                {isSelected ? "Ausgewaehlt" : "Detail laden"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

async function DetailPanel({ params }: { params: ReturnType<typeof normalizeSearchParams> }) {
  if (!params.selectedType || !params.selectedId) {
    return (
      <div style={panelStyle}>
        <p className="small-text muted-text" style={{ margin: 0 }}>
          Kein Datensatz ausgewaehlt. Ein Klick auf einen Algorithmus oder ein Medikament laedt die Detailansicht.
        </p>
      </div>
    );
  }

  try {
    const detail =
      params.selectedType === "algorithm"
        ? await getAlgorithmDetail(params.selectedId, {
            organizationId: params.organizationId,
            regionId: params.regionId || undefined,
            stationId: params.stationId || undefined,
          })
        : await getMedicationDetail(params.selectedId, {
            organizationId: params.organizationId,
            regionId: params.regionId || undefined,
            stationId: params.stationId || undefined,
          });

    const title = "title" in detail ? detail.title : detail.name;

    return (
      <div style={panelStyle}>
        <Stack gap="sm">
          <div>
            <span className="small-text muted-text" style={{ display: "block" }}>
              Typ
            </span>
            <strong>{params.selectedType}</strong>
          </div>
          <div>
            <span className="small-text muted-text" style={{ display: "block" }}>
              Titel
            </span>
            <strong>{title}</strong>
          </div>
          <div>
            <span className="small-text muted-text" style={{ display: "block" }}>
              ID
            </span>
            <span>{detail.id}</span>
          </div>
          {detail.summary ? (
            <div>
              <span className="small-text muted-text" style={{ display: "block" }}>
                Summary
              </span>
              <span>{detail.summary}</span>
            </div>
          ) : null}
          {detail.tags && detail.tags.length > 0 ? (
            <div>
              <span className="small-text muted-text" style={{ display: "block" }}>
                Tags
              </span>
              <span>{detail.tags.join(", ")}</span>
            </div>
          ) : null}
          <details>
            <summary className="small-text muted-text" style={{ cursor: "pointer" }}>
              Raw JSON
            </summary>
            <pre
              style={{
                overflowX: "auto",
                margin: "0.75rem 0 0",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                background: "rgba(15, 23, 42, 0.32)",
                fontSize: "0.8rem",
              }}
            >
              {JSON.stringify(detail, null, 2)}
            </pre>
          </details>
        </Stack>
      </div>
    );
  } catch (error) {
    return (
      <div style={panelStyle}>
        <p className="small-text" style={{ color: "#fca5a5", margin: 0 }}>
          {getLookupApiErrorMessage(error)}
        </p>
      </div>
    );
  }
}

export default async function LabLookupPage({ searchParams }: { searchParams: PageSearchParams }) {
  const params = normalizeSearchParams(await searchParams);

  return (
    <SectionFrame compact>
      <Container>
        <Stack gap="md">
          <ContentCard>
            <Stack gap="sm">
              <span className="badge">LAB</span>
              <h1 className="card-heading" style={{ margin: 0 }}>
                Lookup-Testseite
              </h1>
              <p className="body-text muted-text" style={{ margin: 0 }}>
                Interne Arbeitsflaeche fuer lokale Lookup-Pruefung. Keine Marketing-Inhalte, keine Produktzusagen,
                keine Approval- oder Bearbeitungslogik.
              </p>
              <div
                style={{
                  border: "1px solid rgba(248, 113, 113, 0.45)",
                  borderRadius: "0.875rem",
                  background: "rgba(127, 29, 29, 0.22)",
                  color: "#fecaca",
                  padding: "0.875rem 1rem",
                }}
              >
                <strong style={{ display: "block", marginBottom: "0.25rem" }}>Nur fuer interne Tests</strong>
                <span className="small-text" style={{ display: "block", color: "#fecaca" }}>
                  Diese Seite ist bewusst nicht in Hauptnavigation, Landingpages oder Marketing-Flows integriert und
                  soll vorzugsweise nur direkt per URL genutzt werden.
                </span>
              </div>
            </Stack>
          </ContentCard>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <ContentCard>
              <Stack gap="sm">
                <h2 className="card-heading" style={{ margin: 0 }}>
                  Search und Filter
                </h2>
                <p className="small-text muted-text" style={{ margin: 0 }}>
                  Direkter GET-Workflow ueber URL-Parameter. Alle Bereiche laden serverseitig auf Basis derselben Filter.
                </p>
                <div style={panelStyle}>
                  <SearchAndFiltersForm
                    q={params.q}
                    organizationId={params.organizationId}
                    regionId={params.regionId}
                    stationId={params.stationId}
                  />
                </div>
                <div style={panelStyle}>
                  <Suspense fallback={<p className="small-text muted-text">Suche laedt...</p>}>
                    <SearchResultsPanel
                      q={params.q}
                      organizationId={params.organizationId}
                      regionId={params.regionId}
                      stationId={params.stationId}
                    />
                  </Suspense>
                </div>
              </Stack>
            </ContentCard>

            <ContentCard>
              <Stack gap="sm">
                <h2 className="card-heading" style={{ margin: 0 }}>
                  Detail-Ansicht / Auswahlstatus
                </h2>
                <p className="small-text muted-text" style={{ margin: 0 }}>
                  Ein Klick auf einen Listeneintrag laedt hier die Detaildaten fuer den aktuell ausgewaehlten Datensatz.
                </p>
                <Suspense fallback={<div style={panelStyle}><p className="small-text muted-text" style={{ margin: 0 }}>Detail laedt...</p></div>}>
                  <DetailPanel params={params} />
                </Suspense>
              </Stack>
            </ContentCard>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <ContentCard>
              <Stack gap="sm">
                <h2 className="card-heading" style={{ margin: 0 }}>
                  Algorithm-Liste
                </h2>
                <p className="small-text muted-text" style={{ margin: 0 }}>
                  Serverseitige Liste aus der lokalen Lookup-API.
                </p>
                <div style={panelStyle}>
                  <Suspense fallback={<p className="small-text muted-text">Algorithmen laden...</p>}>
                    <AlgorithmListPanel params={params} />
                  </Suspense>
                </div>
              </Stack>
            </ContentCard>

            <ContentCard>
              <Stack gap="sm">
                <h2 className="card-heading" style={{ margin: 0 }}>
                  Medication-Liste
                </h2>
                <p className="small-text muted-text" style={{ margin: 0 }}>
                  Serverseitige Liste aus der lokalen Lookup-API.
                </p>
                <div style={panelStyle}>
                  <Suspense fallback={<p className="small-text muted-text">Medikamente laden...</p>}>
                    <MedicationListPanel params={params} />
                  </Suspense>
                </div>
              </Stack>
            </ContentCard>
          </div>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
