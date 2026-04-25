# Legacy content compatibility

This directory is a legacy compatibility layer.

- Canonical runtime content for the website lives in `apps/website/lib/site/`.
- Do not add new runtime website content here.
- `apps/website` must not import from root-level `lib/site/*`.

If you need to change website content, update files in `apps/website/lib/site/` only.
