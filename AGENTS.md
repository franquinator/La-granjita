# AGENTS.md - La Granjita

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Build (runs `tsc` then `vite build`)

## Tech Stack
- PixiJS v8 (canvas rendering)
- TypeScript (strict mode: noUnusedLocals, noUnusedParameters)
- Vite (bundler, target: esnext)

## Controls
- WASD / Arrow keys: Move
- 1-6: Select toolbar slot
- Q: Cycle crop/animal type on current tool
- Interaction is implicit via tool use

## Key Conventions

### Sprite loading
- Always set `texture.source.scaleMode = 'nearest'` **after** assigning texture to a Sprite, not on the source before assignment
- Use `PIXI.Assets.load()` to load spritesheets
- Example: `this.sprite.texture.source.scaleMode = 'nearest';`

### Timers
- Crop growth and animal timers use `setInterval` (not game loop)
- `window.setInterval` in `Crop.startGrowth()` / `Soil.startUpdating()` / `Animal.update()`

### Tool system
- Tools extend `Item` class in `src/Item.ts`
- `useFor(player)`: executes the tool action on `player.toolPosition`
- `ejecutarComportamientoDelMarco(player)`: draws the selection preview (Marco = selection box)
- Toolbar uses `addItem_ToSlot_(item, slotNumber)` method

### Marco (selection box)
- `src/Marco.ts` - white border that highlights the current tile target
- Color changes based on valid/invalid action: green=valid, red=invalid, blue=yellow for tools

### Interaction system
- `GameObject.isInteractive` marks interactable objects
- Objects implement `onInteract(player: Player, game: Game): void`
- `Player.toolPosition` is grid-snapped position in front of player (in tile units)

## Project Structure
```
src/
├── main.ts         # Entry point - just calls game.init()
├── Game.ts         # Main game class + exports `game` singleton
├── Player.ts       # Player entity, movement, tool use
├── Input.ts        # Keyboard state (simple Record-based)
├── UI.ts           # Toolbar UI (6 slots, selector, crop sprites)
├── Toolbar.ts      # (inside UI.ts) - Toolbar and Slot classes
├── Item.ts         # Base item class
├── Tools.ts        # Pala, Regadera, Semillas, Cosecha
├── AnimalTools.ts  # SpawnAnimales, Alimentar
├── Terrain.ts      # Tile grid (Pasture/Soil), conversion, crop planting
├── Crop.ts         # Crop types, growth, harvest
├── Animal.ts       # Animal entities (chickens, cows)
├── Marco.ts        # Selection/highlight box
├── FarmPlot.ts     # (alternate farm system, not active in Game.ts)
├── Inventory.ts    # Item storage (not actively used by Player)
├── GameObject.ts   # Base class with sprite/zIndex/isInteractive
├── types.ts        # Vector2D
└── ...
```

## Sprites
- Location: `public/`
- Sprites: `herramienta_pala.png`, `herramienta_regadera.png`, `herramienta_semillas.png`
- Spritesheet: `public/Spring Crops/Spring Crops.png` (16x16 frames, indexed 0-6)
- Frame 6 = seeds/sprout; frames 0-5 = growth stages

## Quirks to Avoid
- Do not import `Shop` - it doesn't exist
- The `build` script must run `tsc && vite build` - Vite alone won't catch TypeScript errors
- `Player.inventory` is null by default (not wired up)
- `Animal.onInteract` checks `hasProduct` before giving money (no harvest tool needed - interact when ready)