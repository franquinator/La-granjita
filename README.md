# La Granjita - Base PixiJS

Videojuego básico con PixiJS v8.

## Estructura

```
La-granjita/
├── index.html    # Entry point
├── main.js       # Código principal
└── README.md     # Este archivo
```

## main.js Explicado

### Inicialización (líneas 1-9)

```js
const app = new PIXI.Application();
await app.init({ ... });
```

Se crea una `PIXI.Application` y se inicializa de forma asíncrona.

**Opciones:**
- `resizeTo: window` - Canvas se ajusta al tamaño de la ventana
- `backgroundColor` - Color de fondo (hex)
- `antialias: true` - Bordes suavizados
- `resolution` - Resolución retina
- `autoDensity` - Densidad automática

### Input (líneas 12-14)

```js
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
```

Sistema simple de teclado usando un objeto `keys` que almacena el estado de cada tecla.

**Teclas soportadas:** WASD y flechas direccionales.

### Player (líneas 16-23)

```js
const player = new PIXI.Graphics();
player.rect(0, 0, 40, 40);
player.fill(0xff6b6b);
```

Sprite creado con `PIXI.Graphics` (rectángulo rojo). No requiere cargar imágenes externas.

**Propiedades:**
- `x`, `y` - Posición en pantalla
- `width`, `height` - Dimensiones (40x40)

### Game Loop (líneas 28-38)

```js
app.ticker.add((ticker) => {
    const delta = ticker.deltaTime / 60;
    const moveSpeed = speed * delta;
    // ...
});
```

Loop de juego usando `app.ticker`. El `delta` normaliza la velocidad independientemente del framerate.

**Movimiento:**
- W/ArrowUp: arriba
- S/ArrowDown: abajo
- A/ArrowLeft: izquierda
- D/ArrowRight: derecha

### Resize (líneas 40-44)

```js
window.addEventListener('resize', () => { ... });
```

Limita la posición del player dentro de los bordes de la pantalla cuando se redimensiona la ventana.

## Próximos Pasos

1. **Cargar sprites**: Usar `PIXI.Assets.load('path/to/image.png')`
2. **Sistema de escenas**: Crear clases MenuScene, GameScene, etc.
3. **Colisiones**: Implementar AABB collision detection
4. **Tilemaps**: Usar pixi-tilemap o similar

## Dependencias

- [PixiJS v8](https://pixijs.download/v8.2.6/pixi.min.js) (CDN)