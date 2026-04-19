export const ROLE_VALUES = [
  "rettungsdienst",
  "ausbildung",
  "organisation",
  "aerztlicher-dienst",
  "studium-forschung",
  "sonstiges",
] as const;

export const INTEREST_VALUES = [
  "beta",
  "pilot",
  "feedback",
  "updates",
  "zusammenarbeit",
] as const;

export type Role = (typeof ROLE_VALUES)[number];
export type Interest = (typeof INTEREST_VALUES)[number];

export type MitwirkenFormInput = {
  name: string;
  email: string;
  role: Role | "";
  interests: Interest[];
  message?: string;
  privacyAccepted: boolean;
  _trap: string;
};

export type MitwirkenSubmission = {
  name: string;
  email: string;
  role: Role;
  interests: Interest[];
  message: string | null;
  privacyAccepted: true;
  submittedAt: string;
};

export type ApiError = {
  field?: keyof MitwirkenFormInput;
  code: string;
  message?: string;
};

export type ApiErrorResponse = {
  ok: false;
  errors: ApiError[];
};

export type ApiSuccessResponse = {
  ok: true;
};

export const ROLE_LABELS: Record<Role, string> = {
  rettungsdienst: "Rettungsdienst",
  ausbildung: "Ausbildung",
  organisation: "Organisation",
  "aerztlicher-dienst": "Ärztlicher Dienst",
  "studium-forschung": "Studium / Forschung",
  sonstiges: "Sonstiges",
};

export const INTEREST_LABELS: Record<Interest, string> = {
  beta: "Beta",
  pilot: "Pilot",
  feedback: "Feedback",
  updates: "Updates",
  zusammenarbeit: "Zusammenarbeit",
};

const EMAIL_REGEX =
  /^(?:[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const roleSet = new Set<string>(ROLE_VALUES);
const interestSet = new Set<string>(INTEREST_VALUES);

export function createEmptyMitwirkenFormInput(): MitwirkenFormInput {
  return {
    name: "",
    email: "",
    role: "",
    interests: [],
    message: "",
    privacyAccepted: false,
    _trap: "",
  };
}

export function normalizeMitwirkenFormInput(
  input: Partial<MitwirkenFormInput> & {
    role?: string;
    interests?: string[];
  },
): MitwirkenFormInput {
  return {
    name: typeof input.name === "string" ? input.name.trim() : "",
    email: typeof input.email === "string" ? input.email.trim() : "",
    role: typeof input.role === "string" && roleSet.has(input.role) ? (input.role as Role) : "",
    interests: normalizeInterests(input.interests),
    message: typeof input.message === "string" ? input.message.trim() : "",
    privacyAccepted: input.privacyAccepted === true,
    _trap: typeof input._trap === "string" ? input._trap.trim() : "",
  };
}

export function validateMitwirkenInput(input: MitwirkenFormInput): ApiError[] {
  const errors: ApiError[] = [];

  if (input.privacyAccepted !== true) {
    errors.push(createFieldError("privacyAccepted", "required"));
  }

  if (input.name.length < 2 || input.name.length > 100) {
    errors.push(createFieldError("name", "invalid_length"));
  }

  if (input.email.length === 0 || input.email.length > 200 || !EMAIL_REGEX.test(input.email)) {
    errors.push(createFieldError("email", "invalid_format"));
  }

  if (!roleSet.has(input.role)) {
    errors.push(createFieldError("role", "invalid_value"));
  }

  if (
    input.interests.length < 1 ||
    input.interests.length > 5 ||
    input.interests.some((interest) => !interestSet.has(interest))
  ) {
    errors.push(createFieldError("interests", "invalid_selection"));
  }

  if ((input.message ?? "").length > 1000) {
    errors.push(createFieldError("message", "too_long"));
  }

  return errors;
}

export function hasInvalidInterestsPayload(values: unknown): boolean {
  if (!Array.isArray(values)) {
    return false;
  }

  if (values.length > 5) {
    return true;
  }

  return values.some((value) => typeof value !== "string" || !interestSet.has(value));
}

export function toMitwirkenSubmission(
  input: MitwirkenFormInput,
  submittedAt = new Date().toISOString(),
): MitwirkenSubmission {
  return {
    name: input.name,
    email: input.email,
    role: input.role as Role,
    interests: [...input.interests],
    message: input.message && input.message.length > 0 ? input.message : null,
    privacyAccepted: true,
    submittedAt,
  };
}

export function getFieldErrorMessage(error: ApiError): string {
  if (error.field === "name") {
    return "Bitte gib deinen Namen ein.";
  }

  if (error.field === "email") {
    return "Bitte gib eine gültige E-Mail-Adresse ein.";
  }

  if (error.field === "role") {
    return "Bitte wähle deine Rolle aus.";
  }

  if (error.field === "interests") {
    return "Bitte wähle mindestens ein Interesse.";
  }

  if (error.field === "message") {
    return "Die Nachricht ist zu lang (max. 1.000 Zeichen).";
  }

  if (error.field === "privacyAccepted") {
    return "Bitte akzeptiere die Datenschutzhinweise.";
  }

  if (error.code === "rate_limited") {
    return "Zu viele Anfragen in kurzer Zeit. Bitte versuche es später erneut.";
  }

  if (error.code === "mail_failed") {
    return "Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später erneut.";
  }

  return "Die Anfrage konnte nicht verarbeitet werden.";
}

function createFieldError(field: keyof MitwirkenFormInput, code: string): ApiError {
  return {
    field,
    code,
  };
}

function normalizeInterests(interests: string[] | undefined): Interest[] {
  if (!Array.isArray(interests)) {
    return [];
  }

  const uniqueInterests = new Set<Interest>();

  for (const interest of interests) {
    if (interestSet.has(interest)) {
      uniqueInterests.add(interest as Interest);
    }
  }

  return [...uniqueInterests];
}
