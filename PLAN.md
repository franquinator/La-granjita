# Plan: Granja Tycoon - Base PixiJS

## Género
Gestión/Tycoon de granja con vista top-down.

## Objetivo
Cultivar vegetales y criar animales para generar ingresos.

## Mecánicas Core

| Mecánica | Descripción |
|----------|-------------|
| Movimiento | Player se mueve por el mapa (WASD/flechas) |
| Acción contextual | Una tecla para interactuar (plantar/cosechar/alimentar) |
| Inventario | Capacidad limitada de items |
| Economía | Monedas por vender productos |

## Estructura de Clases (extendiendo base actual)

```
src/
├── GameObject.js      (base - sin cambios)
├── Input.js           (base - sin cambios)
├── Player.js          (mover + inventario + monedas)
├── Game.js            (agregar: money, inventory, grid)
├── FarmPlot.js        (parcela - plantar/cosechar)
├── Animal.js          (animal - alimentar/recolectar)
├── Crop.js            (cultivo - crece con tiempo)
├── Inventory.js       (sistema de items)
└── main.js            (inicializar mundo)
```

## Scope MVP (primera iteración)

**Player:**
- Mover por la pantalla
- Apertura de parcela vacía → plantar
- Recolectar cultivos listos
- Vender cultivos → dinero

**Parcelas (Grid):**
- 4x4 grid de parcelas
- Estados: vacío → plantado → listo → cosechado
- Timer de crecimiento visual

**Animales:**
- 2-3 animales (gallina, vaca)
- Alimentar → producir (huevos/leche)
- Recolectar productos

## Próximos pasos (post-MVP)

- Expansión de mapa
- Tienda para comprar semillas/animales
- Mejoras de parcelas
- Save/load