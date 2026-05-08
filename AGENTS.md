# La Granjita - PixiJS Game

## Commands

- `npm run dev` — Start dev server (Vite + HMR)
- `npm run build` — Typecheck (tsc) then bundle (vite build)
- `npm run preview` — Preview production build

## Architecture

- Entry: `src/main.ts` → `Game.init()` → `Terrain.init()` starts the world
- Core: `src/Game.ts` — singleton `game` instance owns PIXI app, input, player, terrain, UI
- Game objects implement `update(delta, game)` and register via `game.addToUpdate()`
- Visual sprites added via `game.addVisually(sprite)`

## Key Files

- `src/Game.ts` — singleton `game` instance; game loop, container, object registry
- `src/Terrain.ts` — grid of plots, player/plot interaction
- `src/Player.ts` — movement, interaction key
- `src/FarmPlot.ts` — states: empty → planted → grown
- `src/UI.ts` — HUD
- `src/Inventory.ts`, `src/Item.ts`, `src/Tools.ts` — inventory/item system
- `src/Animal.ts`, `src/Marco.ts` — NPC/mob entities
- `src/Input.ts` — keyboard handling
- `src/types.ts` — shared types

## Conventions

- `.ts` files in `src/`, no subdirectories
- `vite.config.ts` targets `esnext`
- `tsconfig.json` includes only `src/`, strict mode, `noUnusedLocals/Parameters` enabled
- PixiJS v8 with ESM imports (`import * as PIXI from 'pixi.js'`)
- Controls: WASD / arrow keys to move, E to interact

## Notes

- No test suite currently
- Build order matters: `tsc` runs before `vite build` in the build script