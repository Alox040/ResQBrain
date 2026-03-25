const { execSync } = require("node:child_process");

const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const allowedBranches = new Set(["main", "master"]);

if (!allowedBranches.has(branch)) {
  console.log(`[vercel-ignore] Skip build for branch "${branch || "unknown"}".`);
  process.exit(0);
}

try {
  execSync("npm run validate:routing", { stdio: "inherit" });
  execSync("npm run validate:isolation", { stdio: "inherit" });
  console.log(`[vercel-ignore] Build allowed for branch "${branch}".`);
  process.exit(1);
} catch (error) {
  console.log("[vercel-ignore] Skip build because routing or content isolation failed.");
  process.exit(0);
}
