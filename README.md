# Dapur Kilat — Masak cepat, sajikan tepat!

[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/affan511/makefun-cooking-game/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/affan511/makefun-cooking-game/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

Entry for [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) — a complete, original cooking game that plays offline in a desktop browser.

## The game

You run a street-food stall kitchen. Orders arrive on the board at the top — each ticket shows a dish and the ingredients it needs, with a countdown. Rakit the dish on the plate by clicking the ingredient bins (or pressing keys 1–7), then hit **SAJIKAN** (Space) when the recipe matches. Serve fast for combo bonuses; an expired order costs a heart. Three lost hearts — or the end of the 150-second shift — ends the game.

- **6 original dishes** on the menu: Burger Kilat, Sandwich Telur, Omelet Keju, Salad Segar, Double Kilat, Roti Telur Saus
- **7 ingredients** on the counter, each drawn by hand in canvas: roti, daging, telur, keju, selada, tomat, saus
- **Levels** that speed up every 30 seconds, combos up to x5, best-score saving
- **Synthesised sound** (WebAudio, no files): pops, chimes, buzzes and ticks — M mutes
- **Keyboard + mouse**: 1–7 add ingredients, Space serves, Backspace clears the plate, P pauses

## Play it

```sh
# inside game/ — any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000 in desktop Chrome
```

No build step, no network requests: `game/index.html` plus its ES modules under `game/src/`, all art drawn on canvas.

## Layout

- `main.ts` — hands the game in (copies `game/` and `screenshots/` to `/output`, writes `dossier.json`)
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged
- `game/` — the playable game as static files
- `screenshots/` — 4 real renders of the game (title, mid-assembly, serving, end-of-shift rush)
