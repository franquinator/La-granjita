# Plan: Barra de Herramientas

## 1. Modificar `Input.ts`
- Agregar método `wasPressed(keyCode)` para detectar pulsaciones discretas
- Necesario para detectar "doble click" en teclas numéricas
- Almacenar estado de "key just pressed" que se resetea cada frame

## 2. Crear `src/UI.ts` (nueva clase dentro de game)
- **Atributos:**
  - `selectedTool: string | null` - herramienta actualmente equipada
  - `lastPressedKey: string | null` - para detectar doble click
  - `lastPressTime: number` - temporizador para doble click
  - `toolbarContainer: PIXI.Container` - contenedor visual
  - `toolSlots: Map<number, PIXI.Graphics>` - slots de la barra (1-9)

- **Métodos:**
  - `init()` - crear la barra visual en la parte inferior de la pantalla
  - `update(delta)` - manejar entrada de teclas numéricas (1-9)
  - `selectTool(toolId: string)` - equipar herramienta
  - `unequipTool()` - desequipar (doble click en misma tecla)
  - `render()` - actualizar visualización de la barra

## 3. Sistema de herramientas
- Definir herramientas disponibles:
  - **Regadera** (id: "watering_can", tecla: 1, color: 0x3498db)
  - **Azada** (id: "hoe", tecla: 2, color: 0x8B4513)
- Cada herramienta tendrá: color, nombre para display

## 4. Integración con `Game.ts`
- Agregar propiedad `ui: UI` a la clase Game
- Inicializar UI en `game.init()` después de otros sistemas
- La UI escuchará el input del juego

## 5. Comportamiento esperado
- **Tecla 1**: selecciona regadera
- **Tecla 2**: selecciona azada
- **Doble click** (<300ms en misma tecla): desequipa la herramienta actual
- La barra visual se actualiza para mostrar la herramienta seleccionada
- Si no hay herramienta seleccionada, la UI muestra "None" o vacio