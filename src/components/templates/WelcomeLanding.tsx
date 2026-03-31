"use client";
import { useSpeechFallbackNudge } from "@/hooks/useSpeechFallbackNudge";
import { useTeleState } from "@/hooks/useTeleState";
import { getVisitorSession } from "@/utils/visitorMemory";
import { WelcomeLayout } from "@/components/layouts/WelcomeLayout";
import { parseDSL } from "@/utils/parseDSL";

interface WelcomeLandingProps {
  /** Optional DSL content to customize the welcome screen */
  dsl?: string;
  /** Logo text (fallback if no DSL) */
  logoText?: string;
  /** Tagline text (fallback if no DSL) */
  tagline?: string;
  /** Button label (fallback if no DSL) */
  buttonLabel?: string;
}

/**
 * Initial app state shown before the Runtime Agent connects.
 * Now supports DSL-driven customization via WelcomeLayout.
 *
 * The AI can customize the welcome screen by calling navigateToSection with:
 * {
 *   id: "welcome",
 *   templateId: "WelcomeLanding",
 *   props: {
 *     dsl: "===CARDS===\nLAYOUT|layout:welcome\nwelcome-hero|trAIn|Where growth meets opportunity.\nwelcome-button|Begin|start\n===END==="
 *   }
 * }
 *
 * Default DSL format:
 *   ===CARDS===
 *   LAYOUT|layout:welcome
 *   welcome-hero|trAIn|Where growth meets opportunity.
 *   welcome-button|Begin|start
 *   ===END===
 */
export function WelcomeLanding({ 
  dsl, 
  logoText = 'trAIn',
  tagline = 'Where growth meets opportunity.',
  buttonLabel = 'Begin'
}: WelcomeLandingProps = {}) {
  const { connected } = useTeleState();

  useSpeechFallbackNudge({
    enabled: connected && !getVisitorSession(),
    requiredPhrases: ["ready", "journey", "?"],
    matchMode: "any",
    instruction:
      "[SYSTEM] WelcomeLanding is still visible after connect. Execute Step 1 (Greeting) now: speak 'Are you ready to start your journey?' and call navigateToSection with the greeting payload.",
    delayMs: 2800,
  });

  // Parse DSL or use default cards
  const defaultDSL = `===CARDS===
LAYOUT|layout:welcome
welcome-hero|${logoText}|${tagline}
welcome-button|${buttonLabel}|start
===END===`;

  const parsed = parseDSL(dsl || defaultDSL);

  return (
    <div
      data-testid="welcome-landing"
      className="absolute inset-0"
    >
      <WelcomeLayout 
        cards={parsed.cards} 
        badge={parsed.badge}
        layout={parsed.layout}
      />
    </div>
  );
}
