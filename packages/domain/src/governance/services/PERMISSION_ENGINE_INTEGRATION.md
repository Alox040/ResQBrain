Use `evaluateCapability(...)` as the single entry point before domain operations that need org-scoped capability checks.

- Pass `organizationId` explicitly on every call. Missing org context is denied.
- Pass `targetEntity.organizationId` whenever an entity is involved. Cross-tenant access is denied.
- Pass `context.authorUserId` for approve operations and `context.approverUserIds` for release operations so SoD is enforced centrally.
- Keep lifecycle mutation, release decisions, audit persistence, and survey-specific rules outside this engine. The engine only returns `PolicyDecision`.
