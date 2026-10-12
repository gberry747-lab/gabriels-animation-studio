# Video tools (tour, tutorial shorts, promos)

Made 12 Oct 2026. Needs Google Chrome, Node, Python 3 with Pillow, and ffmpeg (`brew install ffmpeg`; this build has no drawtext, so text is drawn as PNG overlays).

1. Serve the repo: `python3 -m http.server 8766` from the repo root.
2. Make the helper pages the scripts load (they are git-ignored as `zz-*`):
   - copy `pages/*.html` to the repo root as `zz-<name>.html`
   - make `zz-demo.html`: a copy of index.html with `/* TEST_HOOK */` replaced by the HOOK string from test/run.js (exposes `window.__t`) and the service-worker line removed
   - make the seed pages (`zz-seed.html`, `zz-seed-empty.html`, `zz-seed-promo.html`) that put a drawing and progress in localStorage then go to zz-demo.html
3. Record and build (each script takes an output folder; paths inside point at the old session scratchpad, so set them to a folder of your choice):
   - Tour for Gabriel: `node record.mjs out` then `assemble_tour.sh`
   - Tutorial shorts: `node record_tut.mjs tut`, render `pages/short.html` backgrounds with `cards.mjs`, then overlay (see the session notes)
   - Promos: `node record_promo.mjs promo`, `node record_promo_games.mjs promo/games`, then `python3 build_promo.py [vertical|youtube|feed]`
- `music.py` writes the original background music (no licensing needed).
- To change the promo end card (for example "Coming soon!" to a store link), edit `pages/end.html` (the `soon` text) and rerun `build_promo.py`.
