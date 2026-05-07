(async () => {
    await game.init();

/*     const inventory = new Inventory(10);
    inventory.addItem({ id: 'wheat', name: 'Semilla de Trigo' }, 3);
    inventory.addItem({ id: 'corn', name: 'Semilla de Maíz' }, 2);
    inventory.addItem({ id: 'tomato', name: 'Semilla de Tomate' }, 2); */

    const player = new Player({ width: 40, height: 40, color: 0xff6b6b, speed: 300 });
    /*     player.setInventory(inventory);
    player.money = 50;
    window.game.addGameObject(player);
    window.game.player = player; */

/*     for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const plot = new FarmPlot(col, row);
            window.game.addGameObject(plot);
        }
    } */

/*     const terrain = new Terrain();
    window.game.addGameObject(terrain);

    const chicken1 = new Animal('chicken', 100, 400);
    window.game.addGameObject(chicken1);

    const chicken2 = new Animal('chicken', 160, 400);
    window.game.addGameObject(chicken2);

    const cow = new Animal('cow', 220, 400);
    window.game.addGameObject(cow);

    const instructions = new PIXI.Text({
        text: 'WASD: Mover | ESPACIO: Interactuar (plantar/cosechar/recoger)',
        style: { fontSize: 14, fill: 0xffffff, align: 'center' }
    });
    instructions.anchor.set(0.5);
    instructions.x = window.game.app.screen.width / 2;
    instructions.y = window.game.app.screen.height - 30;
    window.game.app.stage.addChild(instructions); */
})();