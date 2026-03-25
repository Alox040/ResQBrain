// =============================================================================
// ResQBrain — Central Snapshot Model
// =============================================================================
// Single source of truth for all status pipeline renders:
//   PROJECT_STATUS.md · WORK_SESSION.md · PROJECT_ROADMAP.md
//   README.md · Reddit Update
// =============================================================================

// ─── Status Levels ────────────────────────────────────────────────────────────

export type StatusLevel =
  | "PASS"
  | "WARN"
  | "FAIL"
  | "TODO"
  | "IN_PROGRESS"
  | "UNKNOWN";

// ─── Primitives ───────────────────────────────────────────────────────────────

/** ISO 8601 timestamp string */
export type ISOTimestamp = string;

/** Relative or absolute path within the repository */
export type RepoPath = string;

// =============================================================================
// Meta
// =============================================================================

export type SnapshotMeta = {
  /** When this snapshot was collected */
  collectedAt: ISOTimestamp;
  /** Pipeline version — increment when types change incompatibly */
  pipelineVersion: string;
  /** Git branch at collection time */
  branch: string;
  /** Short commit hash */
  commitHash: string;
  /** Commit subject line */
  commitMessage: string;
  /** Commit author date (ISO) */
  commitDate: ISOTimestamp;
  /** Files with uncommitted changes */
  modifiedFiles: RepoPath[];
  /** Untracked files */
  untrackedFiles: RepoPath[];
};

// =============================================================================
// Overall
// =============================================================================

export type OverallStatus = {
  /** Rolled-up health signal across all areas */
  health: StatusLevel;
  /** One-line human-readable summary for README / Reddit headline */
  headline: string;
  /** Last time the overall status changed (ISO) */
  lastChangedAt: ISOTimestamp;
};

// =============================================================================
// Domain
// =============================================================================

export type DomainLayerStatus = "consolidated" | "split" | "stub-only" | "missing";

export type DomainEntityStatus = {
  entity: string;
  status: StatusLevel;
  notes?: string;
};

export type DomainSnapshot = {
  status: StatusLevel;
  /** Whether packages/domain and src/domain are unified */
  layerStatus: DomainLayerStatus;
  /** Per-entity implementation coverage */
  entities: DomainEntityStatus[];
  /** Open issues in the domain layer */
  openIssues: string[];
};

// =============================================================================
// Website
// =============================================================================

export type RouteRecord = {
  path: string;
  /** Relative path to the page file */
  file: RepoPath;
  status: StatusLevel;
};

export type LinkRecord = {
  /** Source component name */
  component: string;
  /** Target href */
  href: string;
  present: boolean;
};

export type WebsiteSnapshot = {
  status: StatusLevel;
  routes: RouteRecord[];
  /** Legal link coverage across sections */
  linkSources: LinkRecord[];
  /** Known content issues (encoding, missing copy, etc.) */
  contentIssues: string[];
};

// =============================================================================
// Validation
// =============================================================================

export type ValidationCheckResult = {
  id: string;
  label: string;
  status: StatusLevel;
  /** Short description of what was checked */
  description: string;
  /** Error output if status is FAIL or WARN */
  detail?: string;
};

export type ValidationSnapshot = {
  status: StatusLevel;
  /** tsc --noEmit result */
  typecheck: ValidationCheckResult;
  /** Routing completeness check */
  routing: ValidationCheckResult;
  /** Legal link coverage check */
  legalLinks: ValidationCheckResult;
  /** German umlaut encoding check */
  umlauts: ValidationCheckResult;
  /** Any additional project-specific checks */
  additional: ValidationCheckResult[];
};

// =============================================================================
// Deployment
// =============================================================================

export type DeploymentTarget = "vercel" | "local" | "unknown";

export type DeploymentSnapshot = {
  status: StatusLevel;
  target: DeploymentTarget;
  /** Last known deployed commit hash */
  lastDeployedCommit?: string;
  /** Last known deploy timestamp (ISO) */
  lastDeployedAt?: ISOTimestamp;
  /** Whether local HEAD matches last deployed commit */
  inSync: boolean;
  /** Domain the site is live on */
  domain?: string;
  notes?: string;
};

// =============================================================================
// Surveys
// =============================================================================

export type SurveyPhase = "ACTIVE" | "ANALYZING" | "COMPLETED" | "PLANNED";

export type SurveyRecord = {
  id: string;
  title: string;
  phase: SurveyPhase;
  startDate?: string;
  endDate?: string;
  participants?: number;
  /** Key takeaways — used in Reddit and PROJECT_STATUS renders */
  highlights?: string[];
  surveyUrl?: string;
  resultsUrl?: string;
};

export type SurveysSnapshot = {
  status: StatusLevel;
  integrationPhase: "A" | "B" | "C" | "not-started";
  surveys: SurveyRecord[];
  /** Pending decisions or blockers for survey integration */
  openItems: string[];
};

// =============================================================================
// Next Actions
// =============================================================================

export type ActionPriority = "critical" | "high" | "medium" | "low";

export type ActionItem = {
  id: string;
  label: string;
  priority: ActionPriority;
  status: StatusLevel;
  /** Which doc or area this action belongs to */
  area: string;
  /** Optional: maps to a milestone id */
  milestoneRef?: string;
};

export type NextActionsSnapshot = {
  /** Ordered list — renders directly into PROJECT_ROADMAP.md and WORK_SESSION.md */
  items: ActionItem[];
};

// =============================================================================
// Risks
// =============================================================================

export type RiskSeverity = "critical" | "high" | "medium" | "low";
export type RiskLikelihood = "high" | "medium" | "low";

export type RiskRecord = {
  id: string;
  title: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  /** Current mitigation in place */
  mitigation?: string;
  status: StatusLevel;
};

export type RisksSnapshot = {
  status: StatusLevel;
  risks: RiskRecord[];
};

// =============================================================================
// Public Summary
// =============================================================================

export type PublicSummarySnapshot = {
  /**
   * 1–3 sentence project summary.
   * Used in README.md intro and Reddit post body.
   */
  projectDescription: string;
  /**
   * Current development phase label shown publicly.
   * e.g. "Frühe Entwicklungsphase · Architektur & Foundation"
   */
  currentPhaseLabel: string;
  /**
   * Bullet points shown in README status section and Reddit.
   * Max 5 items. Keep short.
   */
  highlights: string[];
  /**
   * Explicit call-to-action shown at the bottom of public outputs.
   */
  callToAction: string;
};

// =============================================================================
// Reddit Publish Mode
// =============================================================================

export type RedditSubreddit =
  | "r/ems"
  | "r/de"
  | "r/programming"
  | "r/selfhosted"
  | string;

export type RedditPublishMode = {
  /**
   * Whether the Reddit renderer should produce a post-ready draft.
   * false = produce a raw notes file instead.
   */
  enabled: boolean;
  targetSubreddits: RedditSubreddit[];
  /**
   * Post title template.
   * Supports {{date}}, {{phase}}, {{headline}} placeholders.
   */
  titleTemplate: string;
  /**
   * Whether to include survey highlights in the post.
   */
  includeSurveyHighlights: boolean;
  /**
   * Whether to include the risk section (typically false for public posts).
   */
  includeRisks: boolean;
  /**
   * Footer appended to every Reddit post.
   */
  footer: string;
};

// =============================================================================
// Top-level Snapshot
// =============================================================================

export type ProjectStatusSnapshot = {
  meta: SnapshotMeta;
  overall: OverallStatus;
  domain: DomainSnapshot;
  website: WebsiteSnapshot;
  validation: ValidationSnapshot;
  deployment: DeploymentSnapshot;
  surveys: SurveysSnapshot;
  nextActions: NextActionsSnapshot;
  risks: RisksSnapshot;
  publicSummary: PublicSummarySnapshot;
  redditPublishMode: RedditPublishMode;
};

// =============================================================================
// Pipeline I/O
// =============================================================================

export type RenderResult = {
  /** Relative path from repo root */
  targetFile: RepoPath;
  content: string;
};

export type PipelineContext = {
  rootDir: string;
  snapshot: ProjectStatusSnapshot;
};
