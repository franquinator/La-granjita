class GameObject {
    constructor() {
        this.sprite = null;
        this.zIndex = 0;
    }

    init(game) {
        
    }

    update(delta, game) {}

    get x() { return this.sprite?.x || 0; }
    get y() { return this.sprite?.y || 0; }
    get displayObject() { return this.sprite; }
}