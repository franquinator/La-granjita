# Tareas del Proyecto - La Granjita

## Estado Actual
- Jugador puede moverse (WASD/flechas)
- Pala convierte Pasture → Soil
- Regadera humedece Soil (cambia color)
- Semillas plantan frutilla en Soil húmedo
- Frutilla crece automáticamente con timer interno (1 seg = 1 tick)
- Toolbar con 3 items (Pala, Regadera, Semillas)
- Marco visual que indica acción válida (verde) o inválida (rojo)

---

## Tareas Pendientes

### AGENTE 1: Sistema de Inventory y Compras

1. **Inventory del jugador**
   - Implementar sistema de inventario (ya existe clase Inventory.ts)
   - Mostrar items en UI
   - Agregar/quitar items

2. **Tienda para comprar semillas**
   - Crear building/shop donde comprar items
   - Comprar semillas (wheat, corn, tomato, strawberry)
   - Deducir dinero del jugador

3. **Semillas en inventory**
   - Las semillas bought deben aparecer en inventory
   - Poder seleccionar qué semilla plantar

4. **Sistema de dinero**
   - Mostrar dinero en UI
   - Ganar dinero al vender cosechas


### AGENTE 2: Cosecha y Expansión de Cultivos

5. **Cosecha de plantas**
   - Al interactuar con planta lista, recolectar
   - Agregar producto al inventory
   - Ganar dinero al vender

6. **Más tipos de cultivos**
   - Agregar sprites para wheat, corn, tomato
   - Cada uno con diferente growTime y sellPrice
   - Poder plantar diferentes semillas

7. **Soil se seca**
   - Después de un tiempo, soil húmedo vuelve a secarse
   - Necesita regarse de nuevo para mantener planta

8. **Animales (ya existe Animal.ts)**
   - Gallinas que producen huevos
   - Vacas que producen leche
   - Alimentar animales para que produzcan

---

## Archivos Clave

- `src/Game.ts` - Singleton del juego
- `src/Terrain.ts` - Tile system (Soil, Pasture, etc.)
- `src/Crop.ts` - Tipos de cultivos
- `src/Tools.ts` - Herramientas/items
- `src/UI.ts` - Interfaz de usuario
- `src/Inventory.ts` - Sistema de inventario
- `src/Player.ts` - Jugador
- `src/Animal.ts` - Animales
- `src/FarmPlot.ts` - Plots (actualmente no usado)

---

## Sprites Disponibles

- `public/Spring Crops/Spring Crops.png` - Frames 0-6 para frutilla
- `public/pala.png`, `public/regadera.png`, `public/semillas.png`

---

## Notas Técnicas

- Los cultivos usan `setInterval` interno para crecer (no depende de update loop)
- El Marco usa color verde para acción válida, rojo para inválida
- Los sprites de plantas usan `scaleMode = 'nearest'` para pixel art
- La toolbar usa teclas 1-4 para seleccionar items
- Space para usar el item seleccionado

---

## Orden Sugerido

1. Agent 1: Inventory → Tienda → Semillas comprables
2. Agent 2: Cosecha → Más cultivos → Animales