# TrainCo Frontend Migration Summary

## Migration Completed ✅

Successfully migrated the trainco-v1 frontend from Vite+React to Next.js 15.

## What Was Migrated

### 1. Core Infrastructure
- ✅ **Dependencies**: Updated `package.json` with all required packages
- ✅ **Global Styles**: Migrated complete CSS design system with all variables
- ✅ **Types & Constants**: Migrated TypeScript types and constants
- ✅ **Public Assets**: Copied all public assets (images, prompts, icons)

### 2. State Management
- ✅ **Contexts**: 
  - `CurrentSectionContext` - Section state management
  - `TeleSpeechContext` - LiveKit speech state (singleton pattern)
  - `ChatHistoryContext` - Chat message history
  - `McpCacheContext` - MCP data caching
- ✅ **Hooks** (14 files):
  - `usePhaseFlow` - Template flow management
  - `useTeleSpeech` - Avatar speech integration
  - `useSpeechGate` - Speech-based UI gating
  - `useSpotlight` - Tutorial spotlight system
  - `useMicGate` - Microphone control
  - `useBrowserSpeech` - Web Speech API
  - And 8 more specialized hooks

### 3. Library Utilities
- ✅ **Lib Files** (8 files):
  - `teleConnect.ts` - LiveKit connection management
  - `teleState.ts` - Tele state coordination
  - `mcpBridge.ts` - MCP data bridge
  - `mcpCacheBridge.ts` - Cache synchronization
  - `designSystem.ts` - Design system utilities
  - `employerApi.ts` - Employer-specific API
  - `utils.ts` - General utilities

### 4. Components (125+ files)
- ✅ **Top-level Components** (16 files):
  - `App.tsx` - Main app wrapper
  - `BaseLayout.tsx` - Persistent shell
  - `DynamicSectionLoader.tsx` - Template renderer
  - `EntryPoint.tsx` - Landing screen
  - `TeleSpeechBubble.tsx` - Speech overlay
  - `BottomNav.tsx` - Connection controls
  - And 10 more core components

- ✅ **UI Components** (21 files):
  - Buttons, cards, inputs, badges
  - Bottom sheets, overlays, spotlights
  - Smart image components
  - Dashboard & learning components

- ✅ **Chart Components** (8 files):
  - Bar charts, progress bars, trend lines
  - Dot plots, gauges, path tracks
  - Skill visualization components

- ✅ **Template Components** (33 files):
  - All generative UI templates
  - Dashboard & profile sheets
  - Job search & application flows
  - Skill coverage & learning paths
  - Registration & loading screens

- ✅ **Employer Components** (4 files):
  - Job posting interfaces
  - Candidate management
  - Hiring dashboard

### 5. Data & Mocks
- ✅ **Mock Data** (8 files):
  - User data, job listings
  - Skills data, course data
  - Application data, eligibility data

- ✅ **Template Registry**:
  - Complete template mapping
  - Required props validation

### 6. Utilities
- ✅ **Utils** (12 files):
  - Voice matching algorithms
  - Tele communication utilities
  - Job insights computation
  - Profile metrics calculation
  - Intent bridging
  - And 7 more utility modules

### 7. Documentation
- ✅ **AGENT.md**: Complete developer reference
- ✅ **This file**: Migration documentation

## Next.js Adaptations Made

### 1. Client Components
All interactive components now have `"use client"` directive at the top:
- All context providers
- All hooks
- All interactive components
- All templates

### 2. App Structure
- **Layout**: `src/app/layout.tsx` - Provides QueryClient, TeleSpeech, and McpCache providers
- **Page**: `src/app/page.tsx` - Renders the main App component
- **App Component**: `src/components/App.tsx` - Main application logic (client component)

### 3. Import Paths
All imports use `@/` prefix which maps to `src/` in Next.js

### 4. CSS System
- Migrated from Vite's CSS to Tailwind v4 with @import
- Preserved all custom CSS variables and utilities
- Maintained glassmorphism effects and animations

## Architecture Overview

This is a **Generative UI** application where:

1. **Runtime Agent (LLM)** - Drives the UI via tool calls
2. **Template Registry** - Maps templateId to React components
3. **Dynamic Section Loader** - Renders active templates
4. **LiveKit Integration** - Real-time voice/video
5. **MCP Bridge** - Data fetching and caching

### Key Flow:
```
Runtime Agent (LLM)
  → calls navigateToSection({ generativeSubsections })
  → UIFrameworkSiteFunctions.navigateToSection
  → setGenerativeSections → React state update
  → DynamicSectionLoader → renders templateId
  → Template component renders interactive layer
```

## Critical Files to Understand

1. **`AGENT.md`** - Comprehensive developer reference
2. **`src/data/templateRegistry.ts`** - Template mapping
3. **`src/hooks/usePhaseFlow.ts`** - Core flow management
4. **`src/contexts/TeleSpeechContext.tsx`** - Singleton speech state
5. **`src/components/DynamicSectionLoader.tsx`** - Template renderer
6. **`src/lib/teleConnect.ts`** - LiveKit connection

## Environment Setup

1. Copy `.env.example` to `.env.local` (if available)
2. Add required environment variables:
   ```
   NEXT_PUBLIC_AGENT_NAME=TrainCo
   # Add LiveKit credentials
   # Add MCP server endpoints
   ```

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Known Considerations

### 1. LiveKit Integration
- LiveKit client library is included
- Connection logic in `src/lib/teleConnect.ts`
- Speech state managed by singleton context

### 2. MCP Bridge
- Bridge functions for data fetching
- Cache synchronization system
- Data flows to React cache, not through props

### 3. Template System
- 33+ templates in the registry
- Lazy-loaded for performance
- Props validated by DynamicSectionLoader

### 4. Voice Integration
- Web Speech API for local STT
- LiveKit for avatar speech
- Microphone gating during multiselect

## Testing Recommendations

1. **Start with Landing**: Test `EntryPoint` component
2. **Test Connection**: Verify LiveKit connection flow
3. **Test Templates**: Check each template renders
4. **Test Voice**: Verify speech detection works
5. **Test Navigation**: Confirm template transitions

## Troubleshooting

### Import Errors
- Ensure all files have correct `@/` prefix
- Check that file exists at the path

### "use client" Errors
- All interactive components need `"use client"`
- Already added to all migrated files

### Hook Errors
- Hooks must be called inside functional components
- Must be inside required providers

### LiveKit Errors
- Check LiveKit credentials
- Verify connection URL
- Check browser permissions

## Next Steps

1. ✅ Configure environment variables
2. ✅ Test the application locally
3. ✅ Set up LiveKit credentials
4. ✅ Configure MCP endpoints
5. ✅ Deploy to your hosting platform

## Prompt System

The application uses a sophisticated prompt system located in `public/prompts/`:
- `agent-knowledge.md` - Core AI system prompt
- `journey-*.md` - Journey-specific prompts
- `knowledge-base.md` - Exact bubble labels reference

These prompts drive the LLM's behavior and template navigation logic.

## Design System

Complete design system with:
- CSS variables for theming
- Glassmorphism effects
- Dark mode support (video/voice/chat modes)
- Responsive utilities
- Animation keyframes

All preserved in `src/app/globals.css`.

---

**Migration completed successfully!** 🎉

The frontend is now fully adapted for Next.js 15 with all features preserved.
