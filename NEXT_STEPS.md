# Next Steps - TrainCo Frontend Migration

## ✅ Migration Complete!

The trainco-v1 frontend has been successfully migrated to Next.js 15. The build passes with no errors.

## What's Been Done

### ✅ All Core Systems Migrated
- 125+ components with "use client" directives
- All contexts, hooks, and utilities
- Complete design system and CSS
- Template registry and dynamic loader
- LiveKit integration framework
- MCP bridge and caching system

### ✅ Next.js Adaptations Complete
- App Router structure (`src/app/`)
- Client component directives added
- Environment variables adapted (process.env)
- Tailwind CSS v4 configuration
- Build configuration optimized

### ✅ Build Status
```
✓ Compiled successfully
✓ Generating static pages
✓ Build complete
```

## Before Running Locally

### 1. Install ESLint (Optional but Recommended)
```bash
npm install --save-dev eslint @next/eslint-plugin-next
```

### 2. Configure Environment Variables
Create `.env.local` with:

```env
# Avatar/Agent Configuration
NEXT_PUBLIC_AGENT_NAME="TrainCo Assistant"

# LiveKit Configuration (Required for voice/video)
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
NEXT_PUBLIC_LIVEKIT_API_KEY=your_api_key
NEXT_PUBLIC_LIVEKIT_API_SECRET=your_api_secret

# MCP Server Endpoints (if using external MCP)
NEXT_PUBLIC_MCP_ENDPOINT=your_mcp_endpoint

# Optional: Dev Toolbar
NEXT_PUBLIC_DEV_TOOLBAR_HOST=localhost
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## File Structure

```
trainco-site-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page (renders App)
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── App.tsx          # Main app component
│   │   ├── BaseLayout.tsx   # Persistent shell
│   │   ├── templates/       # 33 generative UI templates
│   │   ├── ui/              # 21 reusable UI components
│   │   ├── charts/          # 8 chart components
│   │   └── employer/        # 4 employer components
│   ├── contexts/            # 4 React contexts
│   ├── hooks/               # 14 custom hooks
│   ├── lib/                 # 8 utility libraries
│   ├── utils/               # 12 helper functions
│   ├── mocks/               # 8 mock data files
│   ├── types/               # TypeScript definitions
│   ├── data/                # Template registry
│   └── constants/           # Constants and configs
├── public/
│   ├── avatar/              # Avatar images
│   └── prompts/             # AI prompts (if included)
├── AGENT.md                 # Developer reference
├── MIGRATION.md             # Migration documentation
└── NEXT_STEPS.md            # This file
```

## Key Components to Test

### 1. Landing & Connection
- `EntryPoint` component
- `ConnectingScreen` overlay
- LiveKit connection flow

### 2. Template System
- `DynamicSectionLoader` - Template renderer
- `WelcomeLanding` - Initial screen
- `GlassmorphicOptions` - Choice bubbles
- `MultiSelectOptions` - Multi-choice selection
- `Dashboard` - Main dashboard

### 3. Voice/Speech
- `TeleSpeechBubble` - Speech overlay
- `TeleSpeechContext` - Singleton state
- `useTeleSpeech` hook - Speech detection

### 4. User Flows
- Registration flow
- Job search & matching
- Profile & skills
- Learning paths

## Common Issues & Solutions

### Issue: Build Warnings about Lockfiles
**Solution**: Add to `next.config.ts`:
```typescript
export default {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // ... rest of config
}
```

### Issue: LiveKit Not Connecting
**Check**:
1. Environment variables are set
2. LiveKit server is running
3. Browser permissions for mic/camera
4. Console for connection errors

### Issue: Templates Not Loading
**Check**:
1. `src/data/templateRegistry.ts` includes all templates
2. Template file exists and exports correctly
3. Required props are provided
4. Check `DynamicSectionLoader` console logs

### Issue: Speech Not Detected
**Check**:
1. `TeleSpeechProvider` wraps the app
2. LiveKit connection is established
3. Data channel is open
4. Check browser console for errors

## Development Workflow

### Starting Development
```bash
npm run dev
```

### Type Checking
```bash
npx tsc --noEmit
```

### Building for Production
```bash
npm run build
npm start
```

### Deploying
- Works with Vercel, Netlify, or any Node.js host
- Requires Node.js 18+ runtime
- Set environment variables in hosting platform
- Consider CDN for public assets

## Integration Points

### LiveKit Setup
The app expects LiveKit for real-time voice/video:
1. Set up LiveKit server or use LiveKit Cloud
2. Configure credentials in `.env.local`
3. Test connection with dev toolbar (localhost only)

### MCP Integration
The app uses MCP (Model Context Protocol) for data:
1. Configure MCP endpoint
2. Set up bridge functions in `src/lib/mcpBridge.ts`
3. Test data fetching flows

### AI Agent Integration
The LLM drives the UI through `navigateToSection`:
1. Agent calls `UIFrameworkSiteFunctions.navigateToSection`
2. Frontend renders templates dynamically
3. User interactions sent back as signals

## Documentation

- **`AGENT.md`** - Comprehensive developer reference
- **`MIGRATION.md`** - What was migrated and how
- **`public/prompts/`** - AI system prompts (if included)

## Testing Checklist

- [ ] Landing page loads
- [ ] LiveKit connection works
- [ ] Speech bubble displays
- [ ] Template transitions smooth
- [ ] Voice interaction works
- [ ] Registration flow complete
- [ ] Dashboard displays
- [ ] Job search functions
- [ ] Profile editing works
- [ ] Mobile responsive

## Performance Tips

1. **Template Lazy Loading**: Already implemented via `React.lazy()`
2. **Image Optimization**: Use Next.js `<Image>` component where applicable
3. **Bundle Analysis**: Run `npm run build -- --analyze` (add plugin)
4. **Caching**: MCP cache already implemented

## Architecture Notes

This is a **Generative UI** application:
- LLM runtime agent drives all UI via tool calls
- Templates are dynamically loaded based on `templateId`
- Props flow from agent → template renderer → React components
- User interactions signal back to agent via `notifyTele`/`informTele`

The singleton `TeleSpeechContext` ensures all components see the same speech state,
preventing race conditions when components mount mid-speech.

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **LiveKit Docs**: https://docs.livekit.io
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

## Ready to Go! 🚀

Your trainco frontend is fully migrated and ready for development.

Run `npm run dev` and start building!
