import * as PIXI from 'pixi.js';

let cropTexturesCache: Map<string, PIXI.Texture> | null = null;

export async function loadCropTextures(): Promise<Map<string, PIXI.Texture>> {
    if (cropTexturesCache) return cropTexturesCache;

    const textures = new Map<string, PIXI.Texture>();
    try {
        const sheet = await PIXI.Assets.load<PIXI.Texture>('Spring Crops/Spring Crops.png');
        for (let i = 0; i < 7; i++) {
            const frame = new PIXI.Rectangle(i * 16, 0, 16, 16);
            const texture = new PIXI.Texture({ source: sheet.source, frame });
            textures.set(`frame_${i}`, texture);
        }
        cropTexturesCache = textures;
    } catch (e) {
        console.error('Error loading crop textures:', e);
    }
    return textures;
}

export function getCropTexture(frameIndex: number): PIXI.Texture | undefined {
    return cropTexturesCache?.get(`frame_${frameIndex}`);
}