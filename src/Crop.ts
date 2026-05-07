export const CROP_TYPES = {
    wheat: {
        name: 'Trigo',
        growTime: 5,
        sellPrice: 10,
        color: 0xf5deb3
    },
    corn: {
        name: 'Maíz',
        growTime: 8,
        sellPrice: 20,
        color: 0xffd700
    },
    tomato: {
        name: 'Tomate',
        growTime: 6,
        sellPrice: 15,
        color: 0xff6347
    }
} as const;

export type CropType = keyof typeof CROP_TYPES;

export interface CropData {
    name: string;
    growTime: number;
    sellPrice: number;
    color: number;
}

export class Crop {
    type: CropType;
    data: CropData;
    timer: number = 0;
    isReady: boolean = false;

    constructor(type: CropType) {
        this.type = type;
        this.data = CROP_TYPES[type] as CropData;
    }

    update(delta: number): void {
        if (!this.isReady) {
            this.timer += delta;
            if (this.timer >= this.data.growTime) {
                this.isReady = true;
            }
        }
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
}