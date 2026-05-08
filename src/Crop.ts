export const CROP_TYPES = {
    wheat: {
        name: 'Trigo',
        growTime: 10,
        sellPrice: 15,
        color: 0xf5deb3,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5]
    },
    corn: {
        name: 'Maíz',
        growTime: 15,
        sellPrice: 30,
        color: 0xffd700,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5]
    },
    tomato: {
        name: 'Tomate',
        growTime: 12,
        sellPrice: 25,
        color: 0xff6347,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5]
    },
    strawberry: {
        name: 'Frutilla',
        growTime: 8,
        sellPrice: 20,
        color: 0xff0000,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5]
    }
} as const;

export type CropType = keyof typeof CROP_TYPES;

export interface CropData {
    name: string;
    growTime: number;
    sellPrice: number;
    color: number;
    spriteSheet: string | null;
    seedFrame: number | null;
    growFrames: readonly number[] | null;
}

export class Crop {
    type: CropType;
    data: CropData;
    timer: number = 0;
    isReady: boolean = false;
    private intervalId: number | null = null;

    constructor(type: CropType) {
        this.type = type;
        this.data = CROP_TYPES[type] as CropData;
    }

    startGrowth(): void {
        if (this.intervalId !== null) return;
        this.intervalId = window.setInterval(() => {
            if (!this.isReady) {
                this.timer += 1;
                if (this.timer >= this.data.growTime) {
                    this.isReady = true;
                }
            }
        }, 1000);
    }

    destroy(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    update(_delta: number): void {
    }

    getProgress(): number {
        return Math.min(this.timer / this.data.growTime, 1);
    }

    harvest(): { id: string; name: string; value: number } | null {
        if (this.isReady) {
            return {
                id: this.type,
                name: this.data.name,
                value: this.data.sellPrice
            };
        }
        return null;
    }

    reset(): void {
        this.timer = 0;
        this.isReady = false;
    }

    getSpriteFrame(): number | null {
        if (!this.data.spriteSheet) return null;
        const progress = this.getProgress();
        const frameIndex = Math.floor(progress * (this.data.growFrames!.length - 1));
        return this.data.growFrames![frameIndex];
    }

    hasSprite(): boolean {
        return this.data.spriteSheet !== null;
    }

    getSpriteSheet(): string | null {
        return this.data.spriteSheet;
    }
}