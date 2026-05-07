class Game {
    constructor() {
        this.app = null;
        this.input = null;
        this.updateGameObjects = [];
        this.money = 0;
    }

    async init() {
        this.app = new PIXI.Application();
        
        await this.app.init({
            resizeTo: window,
            backgroundColor: 0x228b22,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });
        
        document.body.appendChild(this.app.canvas);
        this.app.stage.sortableChildren = true;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.input = new Input();

        this.app.ticker.add((ticker) => {
            const delta = ticker.deltaTime / 60;
            this.update(delta);
        });

/*         window.addEventListener('resize', () => {
            for (const obj of this.updateGameObjects) {
                if (obj.constrain) obj.constrain(this.app.screen.width, this.app.screen.height);
            }
        }); */
    }

    addToUpdate(obj) {
        this.updateGameObjects.push(obj);
    }

    addVisually(sprite){
        this.container.addChild(sprite);
    }

    update(delta){
        this.updateGameObjects.forEach(gameObject => {
            gameObject.update(delta)
        });
    }

    getObjectAt(x, y, range = 50) {
        for (const obj of this.updateGameObjects) {
            if (obj === this.player) continue;
            const dx = Math.abs(x - obj.x);
            const dy = Math.abs(y - obj.y);
            if (dx < range && dy < range) return obj;
        }
        return null;
    }
}
const game = new Game();