# Welcome Screen DSL - Implementation Guide

## Overview

The WelcomeLanding template now supports DSL-driven customization. This allows the AI agent to dynamically customize the welcome screen with different logo text, taglines, and button labels.

## Figma Design Reference

The welcome screen is based on these Figma designs:
- **Node 6958-18169**: Background container with green gradient glow
- **Node 6958-18171**: "trAIn" logo (AI in green #1ed25e)
- **Node 6958-18172**: Tagline "Where growth meets opportunity."
- **Node 6958-18173**: "Begin" button (green #1dc558)

## DSL Format

### Basic Usage

```
===CARDS===
LAYOUT|layout:welcome
welcome-hero|trAIn|Where growth meets opportunity.
welcome-button|Begin|start
===END===
```

### Card Types

#### 1. `welcome-hero` - Logo and Tagline

**Format**: `welcome-hero|{logoText}|{tagline}`

**Fields**:
- `logoText` - The logo text (e.g., "trAIn"). Any occurrence of "AI" will be highlighted in green.
- `tagline` - The subtitle text shown below the logo

**Example**:
```
welcome-hero|trAIn|Where growth meets opportunity.
```

**Styling**:
- Logo: 96px font size (responsive clamp), white with "AI" in green (#1ed25e)
- Tagline: 21px, muted text color (#d4d4d8)
- Centered vertically with fade-in animation

#### 2. `welcome-button` - Action Button

**Format**: `welcome-button|{label}|{action}`

**Fields**:
- `label` - Button text (e.g., "Begin", "Get Started", "Start Journey")
- `action` - Signal sent when clicked (e.g., "start", "begin", "continue")

**Example**:
```
welcome-button|Begin|start
```

**Styling**:
- Green background (#1dc558 from `--accent`)
- Rounded full (24px border-radius)
- Arrow icon on the right
- Shadow: `0 4px 24px rgba(29,197,88,0.3)`
- Positioned at bottom with safe-area-inset support

**Behavior**:
When clicked, sends: `user clicked: {action}` to the AI agent.

## Usage in navigateToSection

### Default (No Customization)

If no props are provided, WelcomeLanding uses default values:

```json
{
  "id": "welcome",
  "templateId": "WelcomeLanding",
  "props": {}
}
```

This renders:
- Logo: "trAIn"
- Tagline: "Where growth meets opportunity."
- Button: "Begin" (sends "user clicked: start")

### Custom DSL

To customize the welcome screen:

```json
{
  "id": "welcome",
  "templateId": "WelcomeLanding",
  "props": {
    "dsl": "===CARDS===\nLAYOUT|layout:welcome\nwelcome-hero|Join trAIn|Your AI-powered career coach awaits.\nwelcome-button|Let's Go|continue\n===END==="
  }
}
```

This renders:
- Logo: "Join trAIn" (with "AI" highlighted)
- Tagline: "Your AI-powered career coach awaits."
- Button: "Let's Go" (sends "user clicked: continue")

### Alternative Props (Non-DSL)

You can also customize without DSL:

```json
{
  "id": "welcome",
  "templateId": "WelcomeLanding",
  "props": {
    "logoText": "Grow with trAIn",
    "tagline": "AI-powered career growth.",
    "buttonLabel": "Start Now"
  }
}
```

## Visual Design

### Background

The welcome screen features:
1. **Base background**: Dark (`var(--bg)` = #0B1213)
2. **Top gradient overlay**: Elliptical dark teal gradient (rgba(16,42,40,0.55) to transparent)
3. **Center glow**: Green radial blur (rgba(30,210,94,0.13), 60px blur)

### Typography

- **Logo**: Fund/Plus Jakarta Sans, Bold, 96px (responsive)
- **Tagline**: Inter, Regular, 21px
- **Button**: Inter, Semi Bold, 16px

### Colors

- Logo text: White (#ffffff)
- Logo "AI": Accent green (#1ed25e from `--accent-strong`)
- Tagline: Muted text (#d4d4d8 from `--text-muted`)
- Button background: Accent green (#1dc558 from `--accent`)
- Button text: Dark (#18181b)

### Animations

- **Logo + Tagline**: Fade in + slide up (20px), 0.65s duration, ease [0.16, 1, 0.3, 1]
- **Button**: Fade in + slide up (16px), 0.55s duration, 0.25s delay
- **Active state**: Scale down to 0.95 on press

## Component Architecture

### Files Created

1. **`src/components/layouts/WelcomeLayout.tsx`**
   - Full-page custom layout for welcome screen
   - Matches Figma designs exactly
   - Handles background gradients, logo rendering, button positioning

2. **`src/components/cards/WelcomeHeroCard.tsx`**
   - Card component for logo + tagline
   - Auto-highlights "AI" in accent color
   - Centered layout with responsive font sizing

3. **`src/components/cards/WelcomeButtonCard.tsx`**
   - Card component for action button
   - Arrow icon, green styling, click handler
   - Sends signal via `informTele`

4. **`src/components/templates/WelcomeLanding.tsx`** (Updated)
   - Now accepts `dsl`, `logoText`, `tagline`, `buttonLabel` props
   - Parses DSL and renders via WelcomeLayout
   - Falls back to default values if no props provided

### Registry Updates

- **`src/components/layouts/index.ts`**: Added `'welcome': WelcomeLayout` to LAYOUT_MAP
- **`src/components/cards/index.ts`**: Exported WelcomeHeroCard and WelcomeButtonCard
- **`src/components/cards/GridView.tsx`**: Added cards to CARD_MAP and CARD_SIZE
- **`src/utils/parseDSL.ts`**: Added DSL_SCHEMA entries and parsing cases

## Testing

### 1. Default Welcome Screen

After connection, WelcomeLanding should render with:
- "trAIn" logo (AI in green)
- "Where growth meets opportunity." tagline
- "Begin" button

### 2. Custom DSL

AI agent can send:
```javascript
window.UIFrameworkSiteFunctions.navigateToSection({
  generativeSubsections: [{
    id: "custom-welcome",
    templateId: "WelcomeLanding",
    props: {
      dsl: `===CARDS===
LAYOUT|layout:welcome
welcome-hero|Welcome to trAIn|Your journey begins here.
welcome-button|Start|begin-journey
===END===`
    }
  }]
});
```

This renders:
- "Welcome to trAIn" logo
- "Your journey begins here." tagline
- "Start" button (sends "user clicked: begin-journey")

### 3. Button Click Behavior

When the button is clicked:
- Signal sent: `user clicked: {action}` (e.g., "user clicked: start")
- AI agent receives this signal via TellTele
- AI should respond and navigate to next template (e.g., GlassmorphicOptions)

## DSL Schema Reference

```typescript
'welcome-hero': {
  pipeCount: 2,
  fields: ['title', 'body']
}

'welcome-button': {
  pipeCount: 2,
  fields: ['label', 'action']
}
```

## Example AI Agent Prompt

When the AI wants to show a custom welcome screen:

```
[AI speaks: "Welcome! Let me personalize your experience."]

[AI calls navigateToSection with:]
{
  "generativeSubsections": [{
    "id": "personalized-welcome",
    "templateId": "WelcomeLanding",
    "props": {
      "dsl": "===CARDS===\nLAYOUT|layout:welcome\nwelcome-hero|Hello, Sarah! Welcome to trAIn|Your personalized career coach is ready.\nwelcome-button|Continue|proceed\n===END==="
    }
  }]
}
```

## Migration Notes

### Before
- WelcomeLanding was empty (just a placeholder)
- Pre-connection landing was in EntryPoint.tsx (hardcoded)
- No DSL support for welcome content

### After
- WelcomeLanding is DSL-driven and customizable
- Uses WelcomeLayout for consistent Figma design
- AI can dynamically change logo, tagline, and button
- Maintains EntryPoint.tsx for pre-connection state
- Full animation support with SSR hydration fixes

## Next Steps for Testing

1. **Start dev server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Click "Begin"**: Should connect to Mobeus avatar
4. **WelcomeLanding loads**: Should show "trAIn" logo and "Begin" button
5. **Check console**: Look for any errors
6. **Click button**: Should send "user clicked: start" signal
7. **AI responds**: Should navigate to next template (GlassmorphicOptions)
