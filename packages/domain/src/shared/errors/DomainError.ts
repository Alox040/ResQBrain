export class DomainError extends Error {
  readonly type = 'DOMAIN_ERROR' as const;

  readonly code: string;

  readonly context?: Readonly<Record<string, unknown>>;

  constructor(
    code: string,
    message: string,
    context?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.context = context ? Object.freeze({ ...context }) : undefined;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
