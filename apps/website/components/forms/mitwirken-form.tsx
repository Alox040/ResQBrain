"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import {
  INTEREST_LABELS,
  INTEREST_VALUES,
  ROLE_LABELS,
  ROLE_VALUES,
  createEmptyMitwirkenFormInput,
  getFieldErrorMessage,
  validateMitwirkenInput,
  type ApiError,
  type ApiErrorResponse,
  type MitwirkenFormInput,
} from "@/lib/mitwirken/schema";
import { routes } from "@/lib/routes";

type FieldErrors = Partial<Record<keyof MitwirkenFormInput, string>>;

export function MitwirkenForm() {
  const [formData, setFormData] = useState<MitwirkenFormInput>(() => createEmptyMitwirkenFormInput());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setSubmitError(null);

    const nextErrors = mapFieldErrors(validateMitwirkenInput(formData));
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/mitwirken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = (await response.json()) as ApiErrorResponse | { ok: true };

      if (!response.ok || !responseData.ok) {
        const apiErrors = "errors" in responseData ? responseData.errors : [];
        setFieldErrors(mapFieldErrors(apiErrors));
        setSubmitError(getSubmitErrorMessage(apiErrors));
        return;
      }

      setIsSuccess(true);
      setFieldErrors({});
      setSubmitError(null);
      setFormData(createEmptyMitwirkenFormInput());
    } catch {
      setSubmitError("Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTextInputChange(
    field: "name" | "email" | "role" | "message" | "_trap",
    value: string,
  ) {
    const nextFormData: MitwirkenFormInput = {
      ...formData,
      [field]: value,
    };

    setFormData(nextFormData);

    if (hasSubmitted) {
      setFieldErrors(mapFieldErrors(validateMitwirkenInput(nextFormData)));
    }
  }

  function handlePrivacyChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFormData: MitwirkenFormInput = {
      ...formData,
      privacyAccepted: event.target.checked,
    };

    setFormData(nextFormData);

    if (hasSubmitted) {
      setFieldErrors(mapFieldErrors(validateMitwirkenInput(nextFormData)));
    }
  }

  function handleInterestChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = event.target;
    const nextInterests = checked
      ? [...formData.interests, value as MitwirkenFormInput["interests"][number]]
      : formData.interests.filter((interest) => interest !== value);

    const nextFormData: MitwirkenFormInput = {
      ...formData,
      interests: nextInterests,
    };

    setFormData(nextFormData);

    if (hasSubmitted) {
      setFieldErrors(mapFieldErrors(validateMitwirkenInput(nextFormData)));
    }
  }

  if (isSuccess) {
    return (
      <div className="mitwirken-form-status mitwirken-form-status--success" role="status">
        <h2 className="card-title">Danke für deine Nachricht.</h2>
        <p className="body-text muted-text">Wir melden uns so bald wie möglich.</p>
      </div>
    );
  }

  return (
    <form className="mitwirken-form" onSubmit={handleSubmit} noValidate>
      <div aria-hidden="true" className="mitwirken-form-trap">
        <label htmlFor="mitwirken-trap">Bitte leer lassen</label>
        <input
          id="mitwirken-trap"
          name="_trap"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData._trap}
          onChange={(event) => handleTextInputChange("_trap", event.target.value)}
        />
      </div>

      <div className="mitwirken-form-field">
        <label htmlFor="mitwirken-name">Name</label>
        <input
          id="mitwirken-name"
          name="name"
          type="text"
          autoComplete="name"
          className="mitwirken-form-control"
          value={formData.name}
          onChange={(event) => handleTextInputChange("name", event.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "mitwirken-name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="mitwirken-name-error" className="mitwirken-form-error" role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="mitwirken-form-field">
        <label htmlFor="mitwirken-email">E-Mail</label>
        <input
          id="mitwirken-email"
          name="email"
          type="email"
          autoComplete="email"
          className="mitwirken-form-control"
          value={formData.email}
          onChange={(event) => handleTextInputChange("email", event.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "mitwirken-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="mitwirken-email-error" className="mitwirken-form-error" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="mitwirken-form-field">
        <label htmlFor="mitwirken-role">Rolle</label>
        <select
          id="mitwirken-role"
          name="role"
          className="mitwirken-form-control"
          value={formData.role}
          onChange={(event) => handleTextInputChange("role", event.target.value)}
          aria-invalid={fieldErrors.role ? true : undefined}
          aria-describedby={fieldErrors.role ? "mitwirken-role-error" : undefined}
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          {ROLE_VALUES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        {fieldErrors.role ? (
          <p id="mitwirken-role-error" className="mitwirken-form-error" role="alert">
            {fieldErrors.role}
          </p>
        ) : null}
      </div>

      <fieldset
        className="mitwirken-form-field mitwirken-form-fieldset"
        aria-invalid={fieldErrors.interests ? true : undefined}
        aria-describedby={fieldErrors.interests ? "mitwirken-interests-error" : undefined}
      >
        <legend>Interessen</legend>
        {INTEREST_VALUES.map((interest) => (
          <label key={interest} className="mitwirken-form-check">
            <input
              type="checkbox"
              name="interests"
              value={interest}
              checked={formData.interests.includes(interest)}
              onChange={handleInterestChange}
            />
            <span className="body-text muted-text">{INTEREST_LABELS[interest]}</span>
          </label>
        ))}
        {fieldErrors.interests ? (
          <p id="mitwirken-interests-error" className="mitwirken-form-error" role="alert">
            {fieldErrors.interests}
          </p>
        ) : null}
      </fieldset>

      <div className="mitwirken-form-field">
        <label htmlFor="mitwirken-message">Nachricht (optional)</label>
        <textarea
          id="mitwirken-message"
          name="message"
          rows={4}
          className="mitwirken-form-control"
          value={formData.message ?? ""}
          onChange={(event) => handleTextInputChange("message", event.target.value)}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "mitwirken-message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="mitwirken-message-error" className="mitwirken-form-error" role="alert">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="mitwirken-form-field">
        <label className="mitwirken-form-check">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handlePrivacyChange}
            aria-invalid={fieldErrors.privacyAccepted ? true : undefined}
            aria-describedby={fieldErrors.privacyAccepted ? "mitwirken-privacy-error" : undefined}
          />
          <span className="body-text muted-text">
            Ich habe die{" "}
            <Link className="footer-nav-link" href={routes.datenschutz}>
              Datenschutzhinweise
            </Link>{" "}
            gelesen und stimme der Verarbeitung meiner Angaben zur Kontaktaufnahme zu.
          </span>
        </label>
        {fieldErrors.privacyAccepted ? (
          <p id="mitwirken-privacy-error" className="mitwirken-form-error" role="alert">
            {fieldErrors.privacyAccepted}
          </p>
        ) : null}
      </div>

      <div className="mitwirken-form-actions">
        {submitError ? (
          <p className="mitwirken-form-status mitwirken-form-status--error" role="alert">
            {submitError}
          </p>
        ) : null}

        <button type="submit" className="button-link button-link--lg" disabled={isSubmitting}>
          {isSubmitting ? "Wird gesendet ..." : "Absenden"}
        </button>
      </div>
    </form>
  );
}

function mapFieldErrors(errors: ApiError[]): FieldErrors {
  const nextFieldErrors: FieldErrors = {};

  for (const error of errors) {
    if (error.field && !nextFieldErrors[error.field]) {
      nextFieldErrors[error.field] = getFieldErrorMessage(error);
    }
  }

  return nextFieldErrors;
}

function getSubmitErrorMessage(errors: ApiError[]): string | null {
  const globalError = errors.find((error) => !error.field);

  if (!globalError) {
    return null;
  }

  return getFieldErrorMessage(globalError);
}
