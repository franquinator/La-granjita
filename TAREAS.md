# Tareas del Proyecto - La Granjita

## Estado Actual (IMPLEMENTADO)

### Controles
- **WASD / Flechas**: Mover jugador
- **1-3**: Seleccionar item de toolbar
- **Q**: Cambiar tipo de semilla (cycle)
- **Space**: Usar item seleccionado

### Sistema de Juego
- ✅ Jugador puede moverse por el mapa
- ✅ **Pala** convierte Pasture → Soil (Marco amarillo)
- ✅ **Regadera** humedece Soil (Marco azul si seco, rojo si ya húmedo)
- ✅ **Semillas** planta frutilla en Soil húmedo (Marco verde)
- ✅ Frutilla crece automáticamente con timer interno (1 seg = 1 tick)
- ✅ Marco visual: verde=válido, rojo=inválido, azul=para regar, amarillo=para pala
- ✅ **Soil se seca** después de ~30 segundos
- ✅ **Inventory** funciona (conectado al player)

### UI
- ✅ Toolbar con 3 items (Pala, Regadera, Semillas)
- ✅ Las semillas usan frame 6 del spritesheet
- ✅ Pixel art con scaleMode='nearest'

### Terrain
- ✅ Pasture (verde) - tierra default
- ✅ Soil (café) - tierra arada
- ✅ Soil húmedo (café oscuro) - regado
- ✅ Las Soil tienen planta integrada (no FarmPlot)
- ✅ Sistema de harvest implementado
- ✅ Timer independiente para crecimiento

---

## Archivos Principales

| Archivo | Descripción |
|---------|-------------|
| `src/Game.ts` | Singleton, contiene terrain, player, ui |
| `src/Terrain.ts` | Tile system: Pasture, Soil, WetSoil |
| `src/Crop.ts` | Tipos de cultivos, crecimiento |
| `src/Tools.ts` | Pala, Regadera, Semillas |
| `src/UI.ts` | Toolbar |
| `src/Inventory.ts` | Clase inventario |
| `src/Player.ts` | Jugador, movement, toolPosition |
| `src/Animal.ts` | Animales |
| `src/Marco.ts` | Selector visual |

---

## Sprites Disponibles
- `public/Spring Crops/Spring Crops.png` - 16x16, 7 frames (0-6)
- `public/pala.png`, `public/regadera.png`, `public/semillas.png`