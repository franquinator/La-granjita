const ANIMAL_TYPES = {
    chicken: {
        name: 'Gallina',
        product: 'egg',
        productName: 'Huevo',
        feedTime: 5,
        productValue: 8,
        color: 0xffffff
    },
    cow: {
        name: 'Vaca',
        product: 'milk',
        productName: 'Leche',
        feedTime: 8,
        productValue: 20,
        color: 0x8b0000
    }
};

class Animal extends GameObject {
    constructor(type, x, y) {
        super();
        this.type = type;
        this.data = ANIMAL_TYPES[type];
        this.feedTimer = 0;
        this.hasProduct = false;
        this.isInteractive = true;
        this.zIndex = 2;

        this.sprite = new PIXI.Graphics();
        this.drawAnimal();
    }

    drawAnimal() {
        this.sprite.rect(0, 0, 40, 40);
        this.sprite.fill(this.data.color);
        this.sprite.stroke({ width: 2, color: 0x000000 });

        if (this.hasProduct) {
            this.sprite.circle(30, 10, 6);
            this.sprite.fill(0xffff00);
        }
    }

    init(screenWidth, screenHeight) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    update(delta, game) {
        if (!this.hasProduct) {
            this.feedTimer += delta;
            if (this.feedTimer >= this.data.feedTime) {
                this.hasProduct = true;
                this.drawAnimal();
            }
        }
    }

    onInteract(player, game) {
        if (this.hasProduct) {
            player.addMoney(this.data.productValue);
            this.hasProduct = false;
            this.feedTimer = 0;
            this.drawAnimal();
        }
    }

    get x() { return this.sprite.x; }
    set x(val) { this.sprite.x = val; }
    get y() { return this.sprite.y; }
    set y(val) { this.sprite.y = val; }
    get displayObject() { return this.sprite; }
}