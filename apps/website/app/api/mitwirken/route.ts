import { NextResponse } from "next/server";

import { sendMitwirkenMail } from "@/lib/mitwirken/mail";
import { isRateLimited } from "@/lib/mitwirken/rate-limit";
import {
  getFieldErrorMessage,
  hasInvalidInterestsPayload,
  normalizeMitwirkenFormInput,
  toMitwirkenSubmission,
  validateMitwirkenInput,
  type ApiError,
  type ApiErrorResponse,
  type ApiSuccessResponse,
  type MitwirkenFormInput,
} from "@/lib/mitwirken/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: Partial<MitwirkenFormInput> & { role?: string; interests?: string[] };

  try {
    payload = await request.json();
  } catch {
    return jsonError(
      [{ code: "invalid_payload", message: "Ungültige Anfrage." }],
      { status: 400 },
    );
  }

  const input = normalizeMitwirkenFormInput(payload);

  if (input._trap !== "") {
    return NextResponse.json<ApiSuccessResponse>({ ok: true });
  }

  const errors = validateMitwirkenInput(input);

  if (hasInvalidInterestsPayload(payload.interests) && !errors.some((error) => error.field === "interests")) {
    errors.push({ field: "interests", code: "invalid_selection" });
  }

  if (errors.length > 0) {
    return jsonError(withDevelopmentMessages(errors), { status: 400 });
  }

  if (isRateLimited(getRateLimitKey(request))) {
    return jsonError(withDevelopmentMessages([{ code: "rate_limited" }]), { status: 429 });
  }

  const submission = toMitwirkenSubmission(input);

  try {
    await sendMitwirkenMail(submission);
  } catch {
    return jsonError(withDevelopmentMessages([{ code: "mail_failed" }]), { status: 500 });
  }

  return NextResponse.json<ApiSuccessResponse>({ ok: true });
}

function jsonError(errors: ApiError[], init: { status: number }) {
  return NextResponse.json<ApiErrorResponse>(
    {
      ok: false,
      errors,
    },
    init,
  );
}

function withDevelopmentMessages(errors: ApiError[]): ApiError[] {
  if (process.env.NODE_ENV === "production") {
    return errors;
  }

  return errors.map((error) => ({
    ...error,
    message: getFieldErrorMessage(error),
  }));
}

function getRateLimitKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
