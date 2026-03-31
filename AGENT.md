# Mobeus Career App — Agent Reference

This document is written for AI coding agents working in this codebase. Read this before making any changes.

---

## Architecture Overview

This is a **Generative UI** application. The Runtime Agent (trAIn, an LLM in the browser) drives every screen via tool calls. The Build Agent (this codebase) provides the shell, components, and hooks.

```
Runtime Agent (LLM)
  → calls navigateToSection using one of:
      - { generativeSubsections: [{ id, templateId, props }] }
      - [{ id, templateId, props }]
      - { id, templateId, props } (single-section shorthand)
  → UIFrameworkSiteFunctions.navigateToSection (patched by usePhaseFlow)
  → setGenerativeSections → React state update
  → DynamicSectionLoader → renders templateId from TEMPLATE_REGISTRY
  → Template component renders interactive layer from AI-provided props
```

### TeleSpeechBubble (persistent overlay)
A `TeleSpeechBubble` component lives in `BaseLayout` and is always visible (except during Loading templates). It shows the last sentence spoken by the avatar in real time via `useTeleSpeech` hook.

**Templates do NOT render their own question/speech bubbles.** The Runtime Agent speaks the question and the TeleSpeechBubble displays it. Templates only render the interactive layer: option bubbles, forms, cards.

---

## Key Files

| File | Purpose |
|------|---------|
| `client/src/hooks/usePhaseFlow.ts` | Patches `UIFrameworkSiteFunctions.navigateToSection`. Single source of truth for active sections state. Intercepts `_sessionEstablished` prop to persist visitor sessions (path-agnostic). Detects returning visitors on mount via `getVisitorSession()` and sends `[SYSTEM] Returning visitor detected…` to the AI via `informTele`. |
| `client/src/contexts/TeleSpeechContext.tsx` | **Singleton** LiveKit DataReceived listener. Owns the shared `isTalking`/`speech` state. All consumers read from here so components mounting mid-speech start with the correct `isTalking=true` state. |
| `client/src/hooks/useTeleSpeech.ts` | Thin re-export of `useTeleSpeechContext()`. Components import this hook; the context provides the actual state. |
| `client/src/hooks/useSpeechGate.ts` | Shared hook that gates UI visibility on avatar speech. Used by `GlassmorphicOptions` and `MultiSelectOptions`. Waits for speech, then requires configurable silence before revealing; auto-dismisses on new AI turns. |
| `client/src/utils/voiceMatch.ts` | Fuzzy voice-to-bubble matching utilities (Levenshtein, token overlap, stemming, alias lookup). Extracted from `GlassmorphicOptions`. |
| `client/src/components/DynamicSectionLoader.tsx` | Renders the active template. Validates required props and sends `informTele` corrections. |
| `client/src/components/BaseLayout.tsx` | Persistent shell: background, glow, gradient, BottomNav, TeleSpeechBubble. Never re-mounts. |
| `client/src/components/TeleSpeechBubble.tsx` | Persistent speech overlay at top-center (96px). Shows avatar speech. |
| `client/src/components/BottomNav.tsx` | Connection controls. Contains `TRAIN_CONTEXT` system prompt injected at session start. |
| `client/src/data/templateRegistry.ts` | Registry mapping templateId → lazy React component. Also exports `REQUIRED_PROPS`. |
| `client/src/utils/teleUtils.ts` | Unified Tele communication: `notifyTele` (visible user messages), `informTele` (invisible context), `teleAcknowledge` (high-priority instructions). |
| `client/src/lib/mcpBridge.ts` | Bridge site functions (`fetchCandidate`, `fetchJobs`, `fetchSkills`) — fetch data server-side, inject into React cache. Also exports `patchSiteFunctions` and `resolveJobsArray`. |
| `client/src/hooks/useTeleState.ts` | Centralized hook for Tele connection and mode state subscriptions. |
| `client/src/hooks/useVisitorSession.ts` | Reactive hook for `VisitorSession` data in `localStorage`. |
| `client/src/contexts/CurrentSectionContext.tsx` | React context providing `currentTemplateId` and `currentSectionId` to deeply nested components. |
| `client/src/components/ApplicationSheetLayout.tsx` | Shared layout for `JobApplicationsSheet` and `PastApplicationsSheet`. |
| `client/src/utils/jobInsights.ts` | Generates `aiSummary`/`aiGapInsight`, derives eligibility data and placeholder courses. |
| `client/src/utils/computeProfileMetrics.ts` | Computes profile metrics and maps raw skill progression data. |
| `client/src/utils/text.ts` | Shared `capitalize` and `levelLabel` helpers. |
| `client/src/utils/teleIntent.ts` | Canonical intent bridge for click + voice normalized strings. |
| `client/src/hooks/useVoiceTranscriptIntent.ts` | Reusable transcript listener with dedupe to normalize voice behavior. |
| `client/src/hooks/useSpeechFallbackNudge.ts` | One-shot delayed fallback nudge when expected speech is missing. |
| `client/src/utils/visitorMemory.ts` | `localStorage` session persistence for returning visitors (`saveVisitorSession`, `getVisitorSession`, `clearVisitorSession`). Written by `usePhaseFlow` when it intercepts `_sessionEstablished`; read on app load for returning visitor detection. |
| `client/src/components/ui/SpotlightOverlay.tsx` | Tutorial highlight overlay — SVG mask cutout + glow around the active ProfileSheet section during the first-open tutorial. Driven by speech detection via `useSpotlight`. |
| `client/src/components/ui/DashboardBtn.tsx` | Persistent profile/dashboard button extracted from Dashboard. Handles navigation to Dashboard and closes ProfileSheet when tapped. |
| `client/src/hooks/useSpotlight.tsx` | Tracks the `DOMRect` of the element matching `[data-spotlight="<activeId>"]`. Used by `SpotlightOverlay` to position the cutout. |
| `client/src/contexts/McpCacheContext.tsx` | React context for the central MCP data cache (`McpCacheProvider`). Manages `McpCache` state and registers accessors with `mcpCacheBridge`. Used by `useMcpCache()`. |
| `client/src/lib/mcpCacheBridge.ts` | Module-level bridge for synchronous cache access from non-React contexts. Has a write buffer; used by `mcpBridge.ts` to load data into cache. |
| `client/src/hooks/useMicGate.ts` | Mutes the LiveKit microphone on mount, unmutes on unmount or `release()`. Prevents the AI from hearing raw audio during `MultiSelectOptions`. |
| `client/src/hooks/useBrowserSpeech.ts` | Client-side speech-to-text via the Web Speech API. Runs locally; audio never reaches the AI voice model. Used by `MultiSelectOptions` for voice selection while LiveKit mic is muted. |
| `client/src/components/DevToolbar.tsx` | Dev-only toolbar (localhost) with mute mic / mute Tele buttons. Rendered in `BaseLayout` above `BottomNav`. |
| `client/src/components/charts/BarChart.tsx` | Reusable vertical bar chart. Uses `no-lightboard bar-color` pattern for SDK-proof colors. |
| `client/src/components/charts/ProgressBar.tsx` | Reusable horizontal progress bar. Uses `no-lightboard bar-color` pattern. |
| `client/src/components/charts/DotPlot.tsx` | Reusable dot/bar plot for skill level visualization. |
| `client/src/components/charts/SkillGroup.tsx` | Groups skill items with `DotPlot` for skill progression display. |
| `client/src/components/charts/TrendLine.tsx` | SVG trend line chart for time-series data. |
| `client/src/components/ui/ViewFullDetailsButton.tsx` | Glassmorphic "View Full Details" CTA button used in detail overlay templates. |
| `client/src/components/RoleSelectionLanding.tsx` | Initial role selection screen ("I'm looking for a job" / "I'm hiring"). Routes to `TalentApp` or `EmployerDashboard`. |
| `client/src/components/templates/EmployerDashboard.tsx` | Self-contained employer dashboard with its own AI agent. Uses `employer-agent-knowledge.md` prompt. No `navigateToSection`. |
| `client/src/utils/callMcp.ts` | POSTs to `/api/invoke/:toolName` (Express bridge). Legacy utility — loading templates no longer call MCP tools; the Runtime Agent (LLM) calls them directly via Mobeus MCP connection. |

---

## Template Registry

| templateId | File | Required Props | Behaviour |
|-----------|------|---------------|-----------|
| `WelcomeLanding` | `templates/WelcomeLanding.tsx` | none | Static — persists until AI calls navigateToSection |
| `GlassmorphicOptions` | `templates/GlassmorphicOptions.tsx` | `bubbles` | Auto-dismisses after tap or voice selection. Also used for greeting "Tell me more" branch (id:"tell-me-more") — shows 5 TrAIn topic bubbles + "Something else"; AI answers briefly (speech only), then returns to Greeting step with id:"start". |
| `MultiSelectOptions` | `templates/MultiSelectOptions.tsx` | `bubbles` | Used for **all** qualification steps (Industry step 1, Role step 2, Priority step 3) and the Not Sure exploration branch. Optional: `showProgress`, `progressStep`, `progressTotal`. User taps multiple bubbles → chips row; taps "Continue →" to submit. Signal: `"user selected: <label1>, <label2>, …"`. On industry step: if signal is exactly `user selected: Something else` (only that label) → speak question + call `TextInput`, wait for `user typed: <value>`, acknowledge with 2 contextual sentences, then generate 4 role labels specific to the typed industry (always append "Something else" · "I’m not sure") for the Role step. If signal is exactly `user selected: I’m not sure` (only that label) → speak 3 sentences + show exploration MultiSelectOptions, then Role step with "Something else / I’m not sure" options. Also triggers the role Not Sure branch when `user selected: I'm not sure` at the Role step — shows industry-specific interest options (id:"role-exploration") before Priority. Also triggers the role Something else branch when the selection contains `Something else` at the Role step — speak "Which role did you have in mind?" + call `TextInput` (placeholder: "Type role"), wait for `user typed: <value>`, treat as custom role, then proceed to Priority. |
| `TextInput` | `templates/TextInput.tsx` | none | Floating text-input pill at bottom of screen. Reveals after avatar silence (speech gate). Auto-focuses to open native keyboard on mobile. Optional: `placeholder` (default: "Type your answer"). Signal: `"user typed: <value>"` on arrow tap or Enter. Self-dismisses after submit. Used in: (1) "Something else" industry branch — AI generates 4 industry-specific role labels; (2) "Something else" role branch — AI uses typed value as custom role; (3) "Something else" priority branch — AI acknowledges with 2 sentences then navigates to Registration. |
| `RegistrationForm` | `templates/RegistrationForm.tsx` | none | Auto-dismisses after method chosen |
| `LoadingGeneral` | `templates/LoadingGeneral.tsx` | none | Hides TeleSpeechBubble. AI navigates away when done |
| `LoadingLinkedIn` | `templates/LoadingLinkedIn.tsx` | none | Pure visual loading screen. AI calls MCP tools directly while it is shown. No internal logic. |
| `CardStack` | `templates/CardStackTemplate.tsx` | none | Frontend auto-injects top 3 jobs from cache. Persists. Built-in bottom sheet. Uses `teleAcknowledge` for stronger instruction triggering. Dormant: `footerLeft`, `footerRight`. |
| `SavedJobsStack` | `templates/SavedJobsStack.tsx` | `bubbles` | Profile → Saved Jobs: three mocked saved jobs by default (`mocks/savedJobsData`), stacked cards (`CardStack`), banner count, quick-action bubbles (**labels from navigateToSection / search_knowledge**, same pattern as GlassmorphicOptions). Optional `jobs`. |
| `Dashboard` | `templates/Dashboard.tsx` | none | Persistent shell — renders profile button via `DashboardBtn` (top-left). Dashboard **home** is `Dashboard` + `ProfileSheet` (`id: profile-home`, `dashboardAnchor: true`) — auto-injected by `usePhaseFlow` if only `Dashboard` is sent. First entry: speak "Excellent! ..." + "Tap this icon...". Profile tap on home: profile is already open — AI acknowledges briefly (no begin-cta bubbles). |
| `CandidateSheet` | `templates/CandidateSheet.tsx` | none | Bottom sheet — onboarding profile review after LinkedIn lookup. `name` optional (defaults to `""`). Frontend auto-injects candidate data from cache. Shows experience, education. Optional: `candidateId`. Dormant: `footerLeft`, `footerRight`. Signals: `"user clicked: Looks Good"`, `"user clicked: edit profile"`, `"user clicked: add experience"`, `"user clicked: add education"`. |
| `ProfileSheet` | `templates/ProfileSheet.tsx` | `name` | Bottom sheet — slides up above Dashboard with name, title, avatar, target role card, and 3 metric gauges (Skill Coverage, Market Relevance, Career Growth). Optional: `dashboardAnchor` — when true (dashboard home), backdrop/voice cannot dismiss the sheet. Frontend auto-injects data from cache. Optional: `targetRole`, `skillsToGo`, `estimatedTimeline`, `skillCoverage`, `marketRelevance`, `careerGrowth`. Tutorial glow is speech-driven. Uses `SpotlightOverlay` for tutorial glow. Tap signals per metric. |
| `SkillCoverageSheet` | `templates/SkillCoverageSheet.tsx` | none | — |
| `JobSearchSheet` | `templates/JobSearchSheet.tsx` | none | — |
| `JobDetailSheet` | `templates/JobDetailSheet.tsx` | none | — |
| `EligibilitySheet` | `templates/EligibilitySheet.tsx` | none | — |
| `CloseGapSheet` | `templates/CloseGapSheet.tsx` | none | — |
| `JobApplicationsSheet` | `templates/JobApplicationsSheet.tsx` | none | Uses `ApplicationSheetLayout`. |
| `PastApplicationsSheet` | `templates/PastApplicationsSheet.tsx` | none | Uses `ApplicationSheetLayout`. |
| `SkillsDetail` | `templates/SkillsDetail.tsx` | none | Skill coverage summary card alongside Dashboard. Frontend auto-injects skill data from cache. Signals: `"user clicked: View Skill Coverage Details"` → SkillCoverageSheet, `"user clicked: back to profile"` → ProfileSheet. |
| `MarketRelevanceDetail` | `templates/MarketRelevanceDetail.tsx` | none | Market relevance summary card alongside Dashboard. Frontend auto-injects data from cache. Signals: `"user clicked: View Market Relevance Details"` → MarketRelevanceSheet, `"user clicked: back to profile"` → ProfileSheet. |
| `CareerGrowthDetail` | `templates/CareerGrowthDetail.tsx` | none | Career growth summary card alongside Dashboard. Frontend auto-injects data from cache. Signals: `"user clicked: View Career Growth Details"` → CareerGrowthSheet, `"user clicked: back to profile"` → ProfileSheet. |
| `MarketRelevanceSheet` | `templates/MarketRelevanceSheet.tsx` | none | Full-screen market relevance breakdown alongside Dashboard. Frontend auto-injects data from cache. Signal: `"user clicked: dashboard"` → dashboard landing payload. |
| `CareerGrowthSheet` | `templates/CareerGrowthSheet.tsx` | none | Full-screen career growth breakdown alongside Dashboard. Frontend auto-injects data from cache. Signal: `"user clicked: dashboard"` → dashboard landing payload. |

To add a new template:
1. Create `client/src/components/templates/MyTemplate.tsx` (pure renderer, no hardcoded content)
2. Add to `TEMPLATE_REGISTRY` in `client/src/data/templateRegistry.ts`
3. Add required props to `REQUIRED_PROPS`
4. Document in the relevant prompt/journey files

---

## navigateToSection Payload

```json
{
  "generativeSubsections": [
    {
      "id": "unique-id",
      "templateId": "GlassmorphicOptions",
      "props": {
        "bubbles": [{ "label": "Yes" }, { "label": "No" }],
        "showProgress": true,
        "progressStep": 0,
        "progressTotal": 3
      }
    }
  ]
}
```

The ToolsService may pass:
- the `generativeSubsections` array directly (not wrapped),
- or a single section object (`{ id, templateId, props }`).
`usePhaseFlow` handles all supported formats.

**Reserved prop — `_sessionEstablished`:** The AI includes `_sessionEstablished: { candidateId }` in `props` of the first `navigateToSection` after a successful registration MCP call. `usePhaseFlow` intercepts it, calls `saveVisitorSession`, and strips it before templates receive props. Stores only `candidateId`. This is path-agnostic — works for LinkedIn (sent with CandidateSheet), email (sent with CardStack), and future login methods.

---

## User Interaction Signals

All user interactions are communicated via canonical builders in `teleIntent.ts` (which call `notifyTele`):

| Interaction | Signal sent |
|------------|------------|
| Tap arrow (or press Enter) in TextInput | `"user typed: <value>"` → AI acknowledges the typed value and continues flow |
|| Tap bubble in GlassmorphicOptions | `"user selected: " + (option.value ?? option.label)` |
| Say bubble label aloud | `"user selected: " + (option.value ?? option.label)` (matched from voice transcript) |
| Submit email in RegistrationForm | `"user registered with email: <address>"` |
| Tap LinkedIn in RegistrationForm | `"user clicked: Continue with LinkedIn | email: linkedin_complete@test.com"` → AI extracts email, speaks "Connecting with LinkedIn now." and calls `navigateToSection` with `LoadingLinkedIn` (message: "Connecting with LinkedIn…") in the same response, then calls `fetchCandidate`, `fetchJobs`, `fetchSkills("ai-engineer")` (bridge functions), then transitions to `CandidateSheet` and waits for `"user clicked: Looks Good"` (or voice equivalent) before showing `CardStack` |
| Say LinkedIn intent in RegistrationForm | Voice intent such as `"continue with linkedin"`, `"connect linkedin"`, `"use linkedin"`, or `"linkedin"` is normalized to the exact same click signal above, so flow behavior is identical for voice and click |
| Tap Looks Good in CandidateSheet | `"user clicked: Looks Good"` → AI speaks job-count lines and calls `CardStack`. Frontend auto-injects cached jobs. **In the same response** (no EmptyScreen in between) |
| Say "looks good" while CandidateSheet is visible | normalized to `"user clicked: Looks Good"` so voice and click progress identically |
| Tap a job card in CardStack | `"user opened job: <title> at <company>"` |
| Close job detail sheet in CardStack | `"user closed job: <title> at <company>"` → stays on CardStack, no Dashboard navigation (`sendJobClosedIntent` no longer called; local close only) |
| Tap screen background in CardStack | `"user tapped: cards"` (fired by `sendCardsDismissedIntent`) → dashboard landing: speak "Excellent!" + "Tap this icon..." + `navigateToSection` with dashboard landing payload (or `Dashboard` only — frontend injects `profile-home`). |
| Swipe all cards away in CardStack | `"user tapped: cards"` (fired by `sendCardsDismissedIntent` via `onAllCardsSwiped` callback) → identical to screen tap |
| Tap profile button in Dashboard (home) | `"user clicked: profile"` → profile card already visible; AI acknowledges briefly (no GlassmorphicOptions) |
| Voice / intent "View my profile" | `"user selected: View my profile"` → `navigateToSection(Dashboard + ProfileSheet)` if needed, then speaks "This is your profile. Let's take a look." |
| Tap share icon in ProfileSheet | `"user clicked: share profile"` |
| Tap metric in ProfileSheet | `"user clicked: Skill Coverage"` / `"user clicked: Market Relevance"` / `"user clicked: Career Growth"` |
| User selected job | `"user selected job: <title> at <company>"` |
| User clicked: Am I eligible? | `"user clicked: Am I eligible?"` |
| User clicked: Apply Now | `"user clicked: Apply Now"` |
| User clicked: Close the gap | `"user clicked: Close the gap"` |
| User clicked: Past Applications | `"user clicked: Past Applications"` |
| User selected application | `"user selected application: <id>"` |
| Tap View Skill Coverage Details | `"user clicked: View Skill Coverage Details"` |
| Tap View Market Relevance Details | `"user clicked: View Market Relevance Details"` |
| Tap View Career Growth Details | `"user clicked: View Career Growth Details"` |
| Tap back to profile (from detail templates) | `"user clicked: back to profile"` |

Rule: keep click and voice intents semantically identical (voice should emit the same canonical string as click for a given action).

---

## Self-Correction Loop

`DynamicSectionLoader` sends invisible corrections to the Runtime Agent via `informTele`:

- `[TEMPLATE ERROR]` — unknown templateId used
- `[CORRECTION NEEDED]` — required props missing (e.g. `bubbles` missing on GlassmorphicOptions)
- `[REMINDER]` — periodic drift prevention (every 10 template loads)

The Runtime Agent must respond to these by calling `navigateToSection` again with corrected props.

---

## Component Map

```
main.tsx
└── TeleSpeechProvider  ← singleton LiveKit listener; all useTeleSpeech() consumers share this state
    └── App.tsx
        └── BaseLayout (persistent shell)
            ├── Green radial glow div
            ├── Static avatar photo (fades out 0.5s after tele connects)
            ├── Bottom gradient div
            ├── TeleSpeechBubble (z-30, always at top: 96px)
            ├── DynamicSectionLoader (renders active template)
            │   ├── EmptyScreen
            │   ├── WelcomeLanding
            │   ├── GlassmorphicOptions
            │   │   └── FloatingAnswerBubbles
            │   ├── MultiSelectOptions
            │   │   └── FloatingAnswerBubbles
            │   ├── RegistrationForm
            │   ├── LoadingGeneral
            │   ├── LoadingLinkedIn
            │   ├── CandidateSheet
            │   ├── CardStackTemplate
            │   │   └── CardStack
            │   │       ├── SwipeableCard → GlassmorphicJobCard
            │   │       └── JobDetailSheet (bottom sheet, local state)
            │   ├── Dashboard
            │   │   └── DashboardBtn
            │   ├── ProfileSheet
            │   │   └── SpotlightOverlay (tutorial glow, uses useSpotlight)
            │   ├── SkillsDetail
            │   ├── SkillCoverageSheet
            │   ├── MarketRelevanceDetail
            │   ├── MarketRelevanceSheet
            │   ├── CareerGrowthDetail
            │   ├── CareerGrowthSheet
            │   ├── JobSearchSheet
            │   ├── JobDetailSheet
            │   ├── EligibilitySheet
            │   ├── CloseGapSheet
            │   ├── JobApplicationsSheet (uses ApplicationSheetLayout)
            │   └── PastApplicationsSheet (uses ApplicationSheetLayout)
            ├── DevToolbar (dev-only, localhost)
            └── BottomNav (z-20, pinned at bottom: 24px)
```

---

## Prompt Files — Always Keep in Sync

When changing any template, props, flow, or templateId, update ALL of:

1. `client/public/prompts/glass-prompt.md` — Tool definition + template schemas
2. `client/public/prompts/agent-knowledge.md` — Core AI system prompt (identity, rules, signals, routing, shot prompts)
3. `client/public/prompts/journey-welcome.md` — Welcome & Qualification journey (steps 1–5)
4. `client/public/prompts/journey-onboarding.md` — Onboarding journey (steps 6–8: LinkedIn/email path, candidate review, job matching)
5. `client/public/prompts/journey-dashboard.md` — Dashboard & Profile journey (dashboard modes, ProfileSheet, error recovery)
6. `client/public/prompts/knowledge-base.md` — Exact bubble labels (labels-only reference)
7. `client/public/prompts/employer-agent-knowledge.md` — Employer AI assistant prompt (separate mode, no navigateToSection)
8. `AGENT.md` (this file) — Developer reference
9. `TRAIN_CONTEXT` in `client/src/components/BottomNav.tsx` — Inline prompt injected at runtime

The journey files own the step-by-step conversation protocol. `agent-knowledge.md` owns cross-cutting rules, user signals, session rules, returning visitor protocol, and shot prompts. Each journey file declares its entry/exit conditions so hand-offs are explicit.

Publish prompts with:

```bash
TENANT_ID=<tenant-id> npm run publish:prompts
```

`scripts/publish.cjs` maps local `agent-knowledge.md` to remote `tele-knowledge.md` and publishes all journey files.

---

## MCP Tools (Direct — small payloads)

Called directly by the Runtime Agent via Mobeus MCP connection:

| Tool | When to call | Parameters | Returns |
|------|-------------|------------|--------|
| `register_candidate` | Email path only, after email signal. | `email`, `source` | `{ candidate_id }` |
| `find_candidate` | LinkedIn path, after navigating to LoadingLinkedIn. | `email` | Candidate lookup payload including candidate ID |
| `complete_onboarding` | LinkedIn path, immediately after `register_candidate`. | `candidate_id` | Activates candidate profile with default mock data |

## Bridge Functions (large payloads — data goes to frontend cache)

These are site functions, not MCP tools. The AI calls them like tools but data goes to the React cache, not through `navigateToSection` props:

| Function | When to call | Parameters | Returns |
|----------|-------------|------------|--------|
| `fetchCandidate` | LinkedIn path, after `find_candidate`. | `candidate_id` | Injects candidate data into React cache |
| `fetchJobs` | Email path after registration; LinkedIn path immediately after `find_candidate` + `fetchCandidate` (before CandidateSheet confirmation) | `candidate_id` | Injects jobs into React cache |
| `fetchSkills` | Same batch as `fetchJobs` (LinkedIn, email, and returning visitor). Never show a loading screen. | `role_id` (e.g. `"ai-engineer"`) | Injects skill progression into React cache |
| `fetchCareerGrowth` | When showing CareerGrowthDetail or CareerGrowthSheet. Pre-fetched for returning visitors. | `candidate_id` | Injects career growth data into React cache |
| `fetchMarketRelevance` | When showing MarketRelevanceDetail or MarketRelevanceSheet. Pre-fetched for returning visitors. | `candidate_id` | Injects market relevance data into React cache |

---

## Running the App

```bash
npm run dev          # Starts client (Vite) + server (Express) concurrently
npm run build        # Production build
```

The server lives in `server/` (Express + MCP client proxy). The client is a Vite + React SPA in `client/`.

---

## Key Rules for Build Agent

1. **Never hardcode content in templates.** All text, options, and data come from AI-provided props.
2. **Templates are pure renderers.** No internal flow logic, no hardcoded question strings.
3. **TeleSpeechBubble owns all speech display.** Templates must not render their own QuestionBubble.
4. **All prompt files (core + journey files) + TRAIN_CONTEXT must stay in sync** with every template change.
5. **The Runtime Agent (LLM) calls MCP tools directly** via the Mobeus console MCP connection (`register_candidate` for email path; LinkedIn path is `find_candidate` + `fetchCandidate` + `fetchJobs` + `fetchSkills` (bridge functions), then show CandidateSheet and wait for `"user clicked: Looks Good"`). On `"user clicked: Looks Good"` the AI speaks the job-count lines and calls `CardStack` **in the same response** — frontend auto-injects cached jobs; no EmptyScreen or intermediate speech-only turn. On `user tapped: cards` (screen tap OR all cards swiped): speak "Excellent!" + "Tap this icon to access it at any time." + **dashboard landing** (`Dashboard` + ProfileSheet `profile-home`, or `Dashboard` alone with frontend inject). On `user closed job`: do NOT navigate; stay on CardStack. On `user selected: View my profile`: call `navigateToSection(Dashboard + ProfileSheet)` **first**, then speak. Loading templates are pure visual screens — they contain no MCP logic.
6. **Dashboard home** is always ProfileSheet `profile-home` with `dashboardAnchor: true` — no floating begin-cta bubbles.
7. **GlassmorphicOptions accepts `bubbles` but NOT a `question` prop.** The question is spoken. Used only for welcome/greeting single-select (not dashboard home). All qualification steps (Industry, Role, Priority) and the Not Sure exploration branch use `MultiSelectOptions`.
   **Mount-speech gate (`useSpeechGate`):** Both `GlassmorphicOptions` and `MultiSelectOptions` use the shared `useSpeechGate` hook. Bubbles are not revealed until the avatar has been heard speaking at least once after mount, followed by configurable silence (default 800ms). This prevents options from appearing before the avatar has finished asking the question. The AI should always speak the question AND call `navigateToSection` in the same response — the template self-sequences: speech first, then bubbles after silence.
8. **Loading templates (LoadingGeneral, LoadingLinkedIn) are pure visual screens.** They have no internal state, no MCP calls, and no notifyTele signals.
9. **`useTeleSpeech` is backed by `TeleSpeechContext` (singleton).** Do not add a second LiveKit listener. All consumers must read from the shared context to avoid the mid-speech mount bug (see `TeleSpeechContext.tsx` comment).
10. **Never insert EmptyScreen between `user clicked: Looks Good` and `CardStack`.** The AI must call `CardStack` in the same response as receiving the Looks Good signal. Frontend auto-injects cached jobs.
11. **`EmptyScreen` fires a 2.5 s nudge** via `useSpeechFallbackNudge` if the AI stalls. This is a safety net — the AI should never rely on it for normal flow.
12. **ProfileSheet tutorial is speech-driven.** The frontend detects section keywords ("target role", "skill coverage", etc.) from avatar speech and auto-highlights the corresponding card section. The AI just speaks the tutorial phrases in order — no `_update` calls or `highlightSection` prop needed.
