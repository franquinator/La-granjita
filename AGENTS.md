# AGENTS.md - La Granjita

## Información General

- **Framework**: PixiJS v8 + TypeScript
- **Build**: `npm run build` (tsc && vite build)
- **Dev**: `npm run dev`
- **Controls**: WASD/flechas=mover, 1-3=seleccionar, Q=cambiar semilla, Space=usar

---

## Estado Actual (YA IMPLEMENTADO)

### Funcionando
- Movimiento del jugador
- Pala → convierte Pasture a Soil
- Regadera → humedece Soil
- Semillas → planta frutilla (spritesheet frame 6 en toolbar, frames 0-5 en tierra)
- Crecimiento automático con setInterval interno
- Marco visual según contexto
- Pixel art (scaleMode='nearest')
- Soil se seca después de ~30 segundos
- Inventory conectado al player

---

## Convenciones

1. **No romper features existentes** - hacer tests con `npm run build`
2. **Timers**: usar `setInterval` para crecimiento independiente del game loop
3. **Pixel art**: siempre `texture.source.scaleMode = 'nearest'`
4. **Marco colors**:
   - Verde (0x00ff00): acción válida
   - Rojo (0xff0000): acción inválida
   - Azul (0x0000ff): regar soil seco
   - Amarillo (0xffff00): arar pasture

---

## Spritesheet "Spring Crops" (16x16)

```
Frame 0-5: planta creciendo (usar para tierra)
Frame 6:   semilla (usar para toolbar)
```

Los frames están en una sola fila: x = frame * 16, y = 0

---

## Testing

1. `npm run build` - debe compilar sin errores nuevos
2. `npm run dev` - probar en navegador
3. Verificar que no rompe lo que ya funciona