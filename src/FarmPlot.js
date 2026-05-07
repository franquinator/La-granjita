const SEED_PRICES = {
    wheat: 5,
    corn: 10,
    tomato: 8
};

class FarmPlot extends GameObject {
    constructor(col, row, tileSize = 60) {
        super();
        this.col = col;
        this.row = row;
        this.tileSize = tileSize;
        this.crop = null;
        this.isInteractive = true;
        this.zIndex = 1;

        this.sprite = new PIXI.Graphics();
        this.drawPlot();
    }

    drawPlot() {
        this.sprite.rect(0, 0, this.tileSize - 4, this.tileSize - 4);
        this.sprite.fill(0x8b4513);
        this.sprite.stroke({ width: 2, color: 0x5c4033 });
    }

    init(screenWidth, screenHeight) {
        const startX = (screenWidth - (4 * this.tileSize)) / 2;
        const startY = 100;
        this.sprite.x = startX + this.col * this.tileSize;
        this.sprite.y = startY + this.row * this.tileSize;
    }

    update(delta, game) {
        if (this.crop) {
            this.crop.update(delta);
            this.drawCrop();
        }
    }

    drawCrop() {
        if (!this.crop) return;

        this.sprite.clear();
        this.sprite.rect(0, 0, this.tileSize - 4, this.tileSize - 4);
        this.sprite.fill(0x8b4513);
        this.sprite.stroke({ width: 2, color: 0x5c4033 });

        if (this.crop.isReady) {
            this.sprite.rect(10, 10, this.tileSize - 24, this.tileSize - 24);
            this.sprite.fill(this.crop.data.color);
        } else {
            const progress = this.crop.getProgress();
            const size = (this.tileSize - 24) * progress;
            this.sprite.rect((this.tileSize - 24 - size) / 2 + 12, (this.tileSize - 24 - size) / 2 + 12, size, size);
            this.sprite.fill(this.crop.data.color);
        }
    }

    onInteract(player, game) {
        if (!this.crop) {
            if (player.inventory.hasItem('wheat') || player.inventory.hasItem('corn') || player.inventory.hasItem('tomato')) {
                const seeds = player.inventory.items.find(i => ['wheat', 'corn', 'tomato'].includes(i.id));
                if (seeds) {
                    player.inventory.removeItem(seeds.id, 1);
                    this.crop = new Crop(seeds.id);
                    this.drawCrop();
                }
            }
        } else if (this.crop.isReady) {
            const harvested = this.crop.harvest();
            if (harvested) {
                player.addMoney(harvested.value);
                this.crop = null;
                this.drawPlot();
            }
        }
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }
    get displayObject() { return this.sprite; }
}