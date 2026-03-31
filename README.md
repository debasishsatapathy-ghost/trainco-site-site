# TrainCo - AI-Powered Career Platform

A generative UI application where an LLM runtime agent drives the entire user experience through dynamic template navigation.

## 🚀 Quick Start

### Development Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Mobeus dev API key to `.env.local`:
   ```env
   NEXT_PUBLIC_WIDGET_API_KEY=your_dev_key_here
   NEXT_PUBLIC_WIDGET_HOST=https://app.mobeus.ai
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   npm run tele-local
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Architecture

### Generative UI System

This application uses a novel **Generative UI** architecture:

```
Runtime Agent (LLM)
  ↓ makes decisions
  ↓ calls navigateToSection({ generativeSubsections })
  ↓
UIFrameworkSiteFunctions.navigateToSection
  ↓ patches React state
  ↓
DynamicSectionLoader
  ↓ renders templateId from registry
  ↓
Template Component
  ↓ displays interactive UI
  ↓ user interacts
  ↓
Signal sent back to agent
  ↓ agent processes
  ↓ cycle repeats
```

### Key Features

- **AI-Driven Navigation**: LLM controls all screen transitions
- **Dynamic Templates**: 33 templates lazy-loaded on demand
- **Voice Integration**: LiveKit for real-time audio/video
- **MCP Data Bridge**: Server-side data fetching
- **Singleton Speech State**: Prevents race conditions
- **Speech Gating**: UI timing based on avatar speech
- **Fuzzy Voice Matching**: Robust voice-to-text interpretation

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout + providers
│   ├── page.tsx               # Home page
│   └── globals.css            # Design system
├── components/
│   ├── App.tsx                # Main app component
│   ├── BaseLayout.tsx         # Persistent shell
│   ├── DynamicSectionLoader.tsx # Template renderer
│   ├── templates/             # 33 generative templates
│   ├── ui/                    # Reusable UI components
│   ├── charts/                # Data visualization
│   └── employer/              # Employer features
├── contexts/                  # React contexts (4)
├── hooks/                     # Custom hooks (14)
├── lib/                       # Core utilities (8)
├── utils/                     # Helpers (12)
├── types/                     # TypeScript definitions
├── data/                      # Template registry
├── mocks/                     # Mock data
└── constants/                 # Constants

public/
├── avatar/                    # Avatar images
└── prompts/                   # AI system prompts
```

## 🎭 Template System

### Template Registry

All templates mapped in `src/data/templateRegistry.ts`:

| Template | Purpose |
|----------|---------|
| `WelcomeLanding` | Initial landing screen |
| `GlassmorphicOptions` | Single-select bubbles |
| `MultiSelectOptions` | Multi-select bubbles |
| `RegistrationForm` | Email/LinkedIn signup |
| `Dashboard` | Main dashboard |
| `ProfileSheet` | User profile overlay |
| `CardStack` | Job listings swipe cards |
| ... and 26 more | Various flows |

### How Templates Work

1. **Agent decides** what to show
2. **Calls** `navigateToSection({ templateId, props })`
3. **DynamicSectionLoader** renders template
4. **Template** displays UI with props
5. **User interacts** (tap/voice)
6. **Signal sent** back to agent
7. **Cycle repeats**

## 🗣️ Voice & Speech

### LiveKit Integration

- Real-time audio/video streaming
- Data channel for speech events
- Microphone muting/unmuting
- Volume controls

### Speech State Management

```typescript
// Singleton context prevents race conditions
<TeleSpeechProvider>
  {/* All children share one LiveKit listener */}
  {/* Components mounting mid-speech get correct state */}
</TeleSpeechProvider>
```

### Speech-Gated UI

Templates use `useSpeechGate` to reveal UI after avatar speaks:

```typescript
const { ready } = useSpeechGate({
  minSilenceMs: 800,  // Wait 800ms of silence
  dismissOnNextTurn: true  // Auto-hide on next agent turn
});

return ready ? <Options /> : null;
```

## 💾 Data Management

### MCP Cache

Data flows through `McpCacheContext`:

```typescript
// Agent calls bridge function
fetchCandidate(candidateId)
  ↓ data written to cache
  ↓
const { candidate } = useMcpCache()
  ↓ template reads from cache
  ↓ UI displays data
```

### Cache Keys

- `candidate` - User profile data
- `jobs` - Job listings array
- `skills` - Skill progression data
- `careerGrowth` - Career growth metrics
- `marketRelevance` - Market insights

## 🎨 Design System

### Color Modes

Three distinct visual modes:

1. **Video Mode** (default)
   - Dark background with avatar
   - Green accent (#1dc558)
   - Glassmorphism effects

2. **Voice Mode**
   - Adjusted for voice-only
   - Softer surfaces
   - Enhanced borders

3. **Chat Mode**
   - Chat-focused layout
   - Gradient overlays
   - Ellipse glow effects

### CSS Variables

80+ design tokens in `globals.css`:
- Surface opacities
- Border variations
- Text hierarchy
- Accent colors
- Glass effects

## 🔌 API Integration

### Mobeus Widget

```typescript
// Automatically loads from:
NEXT_PUBLIC_WIDGET_API_KEY=vk_dev_...
NEXT_PUBLIC_WIDGET_HOST=https://app.mobeus.ai
```

### MCP Tools

Agent has access to:
- `register_candidate` - Email registration
- `find_candidate` - LinkedIn lookup
- `complete_onboarding` - Profile activation
- `get_jobs_by_skills` - Job matching
- Custom bridge functions

## 🧩 Key Patterns

### 1. Template Props
```typescript
interface TemplateProps {
  bubbles?: Array<{ label: string; value?: string }>;
  name?: string;
  showProgress?: boolean;
  // ... template-specific props
}
```

### 2. User Signals
```typescript
// Standard signal format
notifyTele("user selected: Option Label")
notifyTele("user typed: user input")
notifyTele("user clicked: Button Name")
```

### 3. Agent Response
```typescript
// Agent speaks + navigates in one response
{
  speech: "Great choice! Let's continue.",
  tool_calls: [{
    name: "navigateToSection",
    arguments: { templateId: "NextTemplate", props: {...} }
  }]
}
```

## 📱 Responsive Design

- Mobile-first approach
- Safe area insets for iOS
- Visual viewport adjustments
- Touch-optimized interactions
- Swipeable card stacks

## 🛠️ Development Tools

### Dev Toolbar (localhost only)

- Mute microphone
- Mute avatar audio
- Visual indicators
- Connection status

Access at top of screen when on `localhost`.

### Console Logging

Watch for:
```
[TeleSpeechContext] LiveKit room found...
[usePhaseFlow] navigateToSection called with...
[DynamicSectionLoader] Rendering template: ...
```

## 📖 Documentation

| File | Contents |
|------|----------|
| `AGENT.md` | Complete developer reference with architecture details |
| `MIGRATION.md` | Migration documentation and adaptation notes |
| `NEXT_STEPS.md` | Testing checklist and troubleshooting guide |
| `SETUP_COMPLETE.md` | Setup summary and statistics |

## 🤝 Contributing

When adding new features:

1. **Create template** in `src/components/templates/`
2. **Register** in `src/data/templateRegistry.ts`
3. **Define props** in `REQUIRED_PROPS`
4. **Update prompts** in `public/prompts/`
5. **Document** in `AGENT.md`
6. **Test** end-to-end flow

## 🚨 Troubleshooting

### Build Errors
```bash
npm run build
# Check for TypeScript errors
# Check for missing dependencies
```

### Runtime Errors
- Check browser console
- Verify `.env.local` configuration
- Check LiveKit connection
- Verify API key is valid

### Voice Not Working
- Check microphone permissions
- Verify LiveKit connected
- Check audio element creation
- Test with Dev Toolbar

## 📦 Dependencies

### Core
- **Next.js 15** - React framework
- **React 19** - UI library
- **Framer Motion** - Animations
- **LiveKit Client** - Voice/video

### UI
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### State
- **Zustand** - Global state
- **TanStack Query** - Data fetching

### AI/MCP
- **Anthropic SDK** - LLM integration
- **Zod** - Schema validation

## 🌟 Highlights

This migration preserves:
- ✅ All 125+ components
- ✅ Complete design system
- ✅ Voice/speech integration
- ✅ Template navigation logic
- ✅ MCP data bridging
- ✅ User flow patterns
- ✅ Responsive design
- ✅ Animation system

## 📞 Support

For Mobeus-specific issues:
- Dashboard: https://app.mobeus.ai
- Documentation: Check Mobeus docs
- API Keys: Dashboard > Websites > Local Development

---

## 🎉 You're All Set!

The TrainCo frontend is fully migrated and ready for development.

**Your dev server is running at: http://localhost:3000**

Start building amazing AI-powered career experiences! 🚀
