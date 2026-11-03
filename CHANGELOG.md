# Changelog

## v0.2.0 — Interactive contour and Mono Lattice package release (2026-11-03)

- Preserves the nine independently authored FireXCore Canvas 2D motion states, APIs and appearance.
- Adds the optional, MIT-attributed Schoolees / Jakub Antalik Thinking Orbs engine with nine states and classic/contour modes.
- Adds the `InteractiveOrb` React component, imperative DOM controller and web component.
- Adds the named `MonoLatticeOrb` family: authentic grayscale classic dots, four native 128/96/64/32px profiles with tuned density, no imposed glow.
- Provides pointer/touch interaction, light/dark themes, animation speed, pause and reduced-motion handling.
- Includes the production demo, source documentation, geometry and compatibility tests.
- Retains the upstream license and attribution in `third_party/thinking-orbs/`.
- Publishes a GitHub Packages npm installable package and release tarball. Publishing to npmjs.org remains separate.

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
