# FireXCore Agent Orbs

**[Live Demo — Vercel](https://agent-orbs-demo.vercel.app/)** · [Source repository](https://github.com/FireXCore/agent-orbs) · [Standalone preview files](preview/)


Nine independent, procedurally generated orbital status indicators for React + TypeScript. **This is a new codebase**, with its own mathematical geometry, renderer, animation scheduler, React API, tests, demo, and MIT license. It does not import or depend on ThinkingOrbs or thinking-orbs.

![Nine original procedural animation states](assets/gallery.svg)

[Launch the interactive demo](https://agent-orbs-demo.vercel.app/) — nine live animated states, theme, pause, speed, and accent controls.

## Features

- Nine states: `working`, `searching`, `solving`, `listening`, `connecting`, `weaving`, `composing`, `breathing`, `shaping`.
- True procedural 3D coordinate rotation and depth sorting, painted on a **Canvas 2D** surface (no WebGL, video, GIF or animation dependency).
- Small (24 px) and regular (76 px) geometry presets; arbitrary custom diameter (12–256 px).
- Single shared animation clock and per-instance offscreen pause.
- Respects `prefers-reduced-motion`; pauses when browser tab is hidden.
- Automatic dark/light mode, including `[data-theme]`, Tailwind `.dark` / `.light`, and operating-system preference.
- Optional monochrome ink and accent color, speed and pause controls.
- Accessible `AgentOrbLabel` combines a compact animation with `role="status"` text.
- React 18+ peer dependency, SSR-compatible static import, ESM/CJS/types build, strict TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5174/ to see the gallery and live preview.

```bash
npm run check          # typecheck, unit tests, library build, demo build
npm run build:preview  # compile standalone preview from the same original TS core
npm run test:core      # run geometry tests with Node only
```

## Standalone preview (no npm installation)

```bash
python -m http.server 5174
```

Open http://127.0.0.1:5174/preview/. The preview is generated from the exact same geometry and rendering source as the React package.

## Use in RMS (or any React application)

After publishing to npm, install `@firexcore/agent-orbs`. Until publishing, install locally:

```bash
npm install ../agent-orbs
```

```tsx
import { AgentOrb, AgentOrbLabel } from '@firexcore/agent-orbs';

export function SupplierSearch({ loading }: { loading: boolean }) {
  return loading ? (
    <AgentOrbLabel state="searching" theme="auto">Searching suppliers…</AgentOrbLabel>
  ) : null;
}

// Standalone use:
<AgentOrb state="connecting" size="regular" />
<AgentOrb state="working" size="small" color="#eef2ff" />
<AgentOrb state="solving" size={96} accent="#56b5f2" speed={0.8} />
```

Make the selected `state` reflect an actual action: for example, only display `listening` when microphone input is active, or `composing` when content is being generated. No simulated work or progress claims.

## Architecture

- `src/scenes.ts` — pure, independently authored mathematical scenes, no DOM or React.
- `src/geometry.ts` — spatial transforms, distributions and interpolation.
- `src/render.ts` — depth-sorted Canvas 2D painter.
- `src/clock.ts` — shared RAF scheduler.
- `src/appearance.ts` — theme and reduced-motion observability.
- `src/AgentOrb.tsx` — React/Canvas bridge and offscreen lifecycle.
- `src/AgentOrbLabel.tsx` — accessible status + small orb.
- `demo/` — responsive gallery with 9 large/small examples and controls.
- `tests/` — geometry, finite-frame, determinism and state coverage.
- `scripts/build-gallery-svg.mjs` — reproducible vector contact sheet of all nine states.

## Deployment

- **Live interactive demo:** https://agent-orbs-demo.vercel.app/
- **Source:** https://github.com/FireXCore/agent-orbs
- **Hosting:** Vercel, deployed from the standalone `preview/` source. The current demo is live; automatic Git-triggered Vercel deployments require the Vercel GitHub integration to have access to this repository.

## GitHub publication

The source repository is [FireXCore/agent-orbs](https://github.com/FireXCore/agent-orbs). On a Windows machine with Git and authenticated GitHub CLI, run:

```powershell
.\scripts\publish-github.ps1 -Visibility private
# Or select -Visibility public for an open-source repository.
```

Alternatively, after manually creating an empty GitHub repository named `agent-orbs` under `FireXCore`, run:

```bash
git init
git add .
git commit -m "feat: original agent orbs animation library"
git branch -M main
git remote add origin https://github.com/FireXCore/agent-orbs.git
git push -u origin main
```

Repository creation and npm publication are not performed by these commands.

## Attribution

Design direction: general-purpose particle motion for AI and operations interfaces. All implementation code, rendering equations and demo UI in this repository were independently authored. This repository is not a fork or dependency of third-party orb libraries.

## License

MIT © 2026 FireXCore.
