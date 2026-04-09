import {
  getAlgorithmDetail,
  getLookupApiErrorMessage,
  getMedicationDetail,
} from "@/lib/lookup-api/client";
import type {
  LookupAlgorithmDetail,
  LookupMedicationDetail,
  LookupScopedContentRecord,
} from "@/lib/lookup-api/types";
import {
  assertLookupAlgorithmDetail,
  assertLookupMedicationDetail,
} from "@/features/lookup/guards";
import { resolveLookupRequestContext } from "@/features/lookup/listData";

export type LookupDetailViewData = {
  id: string;
  title: string;
  summary: string;
  categoryLabel: string | null;
  versionLabel: string | null;
  releasedAtLabel: string | null;
  currentReleasedVersionId: string;
  scope: string | null;
  visibility: string | null;
  tags: string[];
};

function normalizeSummary(summary?: string | null) {
  const trimmed = summary?.trim();
  return trimmed && trimmed.length > 0
    ? trimmed
    : "Keine Kurzbeschreibung verfuegbar.";
}

function normalizeLabel(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function formatReleasedAt(value?: string | null) {
  const normalized = normalizeLabel(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return parsed.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function mapSharedFields(
  detail: LookupScopedContentRecord,
  title: string,
): LookupDetailViewData {
  return {
    id: detail.id,
    title,
    summary: normalizeSummary(detail.summary),
    categoryLabel: normalizeLabel(detail.category),
    versionLabel: normalizeLabel(detail.versionLabel),
    releasedAtLabel: formatReleasedAt(detail.lastReleasedAt),
    currentReleasedVersionId: detail.currentReleasedVersionId,
    scope: normalizeLabel(detail.scope),
    visibility: normalizeLabel(detail.visibility),
    tags: detail.tags?.filter((tag): tag is string => tag.trim().length > 0) ?? [],
  };
}

export async function loadAlgorithmDetailViewData(id: string) {
  try {
    const detail: LookupAlgorithmDetail = await getAlgorithmDetail(
      id,
      resolveLookupRequestContext(),
    );
    assertLookupAlgorithmDetail(detail);
    return mapSharedFields(detail, detail.title);
  } catch (error) {
    throw new Error(getLookupApiErrorMessage(error));
  }
}

export async function loadMedicationDetailViewData(id: string) {
  try {
    const detail: LookupMedicationDetail = await getMedicationDetail(
      id,
      resolveLookupRequestContext(),
    );
    assertLookupMedicationDetail(detail);
    return mapSharedFields(detail, detail.name);
  } catch (error) {
    throw new Error(getLookupApiErrorMessage(error));
  }
}
