# OMONT Typewriter

A single-page typewriter experience: type on your keyboard and the on-screen keys move, typewriter sounds play, and text appears on the paper.

## How to run

1. Open `index.html` in a browser (double-click or use File → Open).
2. Or run a local server, e.g. `python3 -m http.server 8000` then visit `http://localhost:8000`.
3. Click the typewriter area, then type. Keys animate, sound plays, and text shows on the paper.

## Assets

- `assets/typewriter.png` – OMONT typewriter image.
- `assets/typewriter-strike.wav` – Key-strike sound (optional; built-in Web Audio click is used if the file is missing).

## Files

- `index.html` – Page structure, paper div, key overlay.
- `styles.css` – Layout, paper styling, key grid and `.pressed` animation.
- `script.js` – Key mapping, keydown/keyup, text buffer, sound playback.
