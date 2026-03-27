const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const allowedBranches = new Set(["main", "master"]);

if (!allowedBranches.has(branch)) {
  console.log(`[vercel-ignore] Skip build for branch "${branch || "unknown"}".`);
  process.exit(0);
}

// Ignore Step runs before dependency install in Vercel and must not depend on local CLIs (e.g. tsx).
// For protected branches, always allow the build pipeline to continue.
console.log(`[vercel-ignore] Build allowed for branch "${branch}".`);
process.exit(1);
