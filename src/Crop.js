const CROP_TYPES = {
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
};

class Crop {
    constructor(type) {
        this.type = type;
        this.data = CROP_TYPES[type];
        this.timer = 0;
        this.isReady = false;
    }

    update(delta) {
        if (!this.isReady) {
            this.timer += delta;
            if (this.timer >= this.data.growTime) {
                this.isReady = true;
            }
        }
    }

    getProgress() {
        return Math.min(this.timer / this.data.growTime, 1);
    }

    harvest() {
        if (this.isReady) {
            return {
                id: this.type,
                name: this.data.name,
                value: this.data.sellPrice
            };
        }
        return null;
    }

    reset() {
        this.timer = 0;
        this.isReady = false;
    }
}