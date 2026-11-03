## 0.2.0 (source update; not yet published)

- Preserved the original nine FireXCore motion states and existing AgentOrb API.
- Added an opt-in, MIT-attributed nine-state thinking-orb engine with classic and contour modes.
- Added interactive pointer/touch distortion, four sizes, idle/responding states, vanilla controller, and custom element.
- Added the React InteractiveOrb wrapper, expanded gallery and standalone preview.
- Added compatibility tests and retained upstream notices in third_party/thinking-orbs.

# Changelog

## v0.1.0 — Initial public library

First public source milestone for **FireXCore Agent Orbs**, an independently implemented orbital status animation system for React and TypeScript.

### Included

- Nine procedural animation states: `working`, `searching`, `solving`, `listening`, `connecting`, `weaving`, `composing`, `breathing`, `shaping`.
- Canvas 2D rendering of transformed and depth-sorted 3D-inspired particle geometry.
- Purpose-tuned regular (76 px) and small (24 px) sizes, plus configurable custom diameter.
- Auto light/dark theme, reduced-motion support, pause and adjustable speed.
- React `AgentOrb` and `AgentOrbLabel` components with accessible labels.
- Shared timing and offscreen rendering suspension.
- Interactive React gallery and standalone no-install preview.
- TypeScript types, geometry checks, CI workflow and MIT license.

### Online demo

https://agent-orbs-demo.vercel.app/

### Scope

The Vercel demo is independently hosted. This release does not integrate with RMS or claim publication to the public npm registry.
