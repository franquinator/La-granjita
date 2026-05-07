class Player extends GameObject {
    constructor(options = {}) {
        super();
        this.width = options.width || 40;
        this.height = options.height || 40;
        this.color = options.color || 0xff6b6b;
        this.speed = options.speed || 300;
        this.zIndex = 10;

        this.money = 0;
        this.inventory = null;

        this.sprite = new PIXI.Graphics();
        this.sprite.rect(0, 0, this.width, this.height);
        this.sprite.fill(this.color);

        this.sprite.x = 100;
        this.sprite.y = 100;

        game.addVisually(this.sprite);
        game.addToUpdate(this);

/*         this.uiText = new PIXI.Text({ text: '$0', style: { fontSize: 16, fill: 0xffffff } });
        this.uiText.zIndex = 100; */
    }

    init() {
/*         game.addRenderChild(this.sprite)
        this.sprite.x = 100;
        this.sprite.y = 100; */
/*         game.app.stage.addChild(this.sprite);
        this.uiText.x = 10;
        this.uiText.y = 10;
        game.app.stage.addChild(this.uiText); */
    }

    setInventory(inventory) {
        this.inventory = inventory;
    }

    update(delta) {
        const moveSpeed = this.speed * delta;
        console.log("update del player");

        if (game.input.isAnyDown(['KeyW', 'ArrowUp'])) this.sprite.y -= moveSpeed;
        if (game.input.isAnyDown(['KeyS', 'ArrowDown'])) this.sprite.y += moveSpeed;
        if (game.input.isAnyDown(['KeyA', 'ArrowLeft'])) this.sprite.x -= moveSpeed;
        if (game.input.isAnyDown(['KeyD', 'ArrowRight'])) this.sprite.x += moveSpeed;

        if (game.input.isDown('Space')) {
            this.interact(game);
            game.input.keys['Space'] = false;
        }

        //this.updateUI();
    }

    interact(game) {
        const range = 60;

        for (const obj of game.gameObjects) {
            if (obj === this) continue;
            if (!obj.isInteractive) continue;

            const dx = Math.abs(this.sprite.x - obj.x);
            const dy = Math.abs(this.sprite.y - obj.y);

            if (dx < range && dy < range) {
                if (obj.onInteract) {
                    obj.onInteract(this, game);
                }
                return;
            }
        }
    }

    addMoney(amount) {
        this.money += amount;
    }

    spendMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }

    updateUI() {
        this.uiText.text = `$${this.money}`;
    }

    constrain(screenWidth, screenHeight) {
        this.sprite.x = Math.min(Math.max(this.sprite.x, 0), screenWidth - this.width);
        this.sprite.y = Math.min(Math.max(this.sprite.y, 0), screenHeight - this.height);
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }
    get displayObject() { return this.sprite; }
}