export class DomainError extends Error {
    type = 'DOMAIN_ERROR';
    code;
    context;
    constructor(code, message, context) {
        super(message);
        this.name = new.target.name;
        this.code = code;
        this.context = context ? Object.freeze({ ...context }) : undefined;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
