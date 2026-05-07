class Terrain{
    constructor(options = {}) {
        const grid = [4][4];
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                grid[x,y] = new PIXI.Graphics();
                grid[x,y].rect(0, 0, 40, 40);
                grid[x,y].fill("0xffffff");
            }
        }
    }
}

class tile{
    constructor(options = {}){
        this.sprite = new PIXI.Graphics();
    }
    
}