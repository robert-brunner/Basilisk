# Basilisk

A live, in-browser CSS `box-shadow` generator built for neumorphic / soft-UI work — raised buttons, sunken panels, pressed states — without hand-tuning rgba offsets in devtools.

Created by [Robert Brunner](https://github.com/robert-brunner)

<p align="center">
  <img src="public\web-app-manifest-512x512.png" width="120" alt="Basilisk icon: a snake's eye" />
</p>

## What it does

- **Layered shadows.** Stack as many `box-shadow` layers as you need, each with its own inset toggle, X/Y offset, blur, spread, color, and opacity — all as sliders with a live preview.
- **Mirror.** Reflect a layer's offset diagonally (opposite corner) so light/dark pairs stay in sync as you tweak.
- **Uniform.** Apply a layer's offset distance evenly on all four sides instead of just one corner, for a symmetric glow or ring shadow.
- **Shape presets.** Flat, convex, pressed, and concave one-click starting points, generated from your current background color — then tweak from there like any other layer.
- **Background picker.** Solid color or an uploaded image, to preview shadows against real context.
- **Paste-to-edit.** Drop in CSS you already have and Basilisk parses out the background, border-radius, and every shadow layer into editable controls, so you're never starting from a blank slate.
- **Copyable output.** Live-generated CSS block, ready to paste back into your stylesheet.

## Why "Basilisk"

Named for the mythical serpent whose gaze turns things to stone — a fitting stand-in for a tool that takes a loose pile of shadow values and petrifies them into a fixed, working CSS block.

## Stack

Vanilla React + Vite. No CSS framework — all styling is hand-written to keep the output predictable and easy to lift into other projects.

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── shadowEngine.js       # single source of truth: layer math, CSS builder, CSS parser, style presets
├── App.jsx                # owns app state, wires panels together
├── App.css
└── components/
    ├── ShapeSwitcher.jsx  # flat / convex / concave / pressed picker
    ├── LayerCard.jsx      # controls for one shadow layer
    ├── LayerCard.css
    ├── BackgroundPanel.jsx
    ├── PastePanel.jsx     # paste-existing-CSS parser UI
    └── PreviewPanel.jsx   # preview box + output CSS + copy button
```