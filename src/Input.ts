export class Input {
    keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
    }

    isDown(keyCode: string): boolean {
        return !!this.keys[keyCode];
    }

    isAnyDown(keyCodes: string[]): boolean {
        return keyCodes.some(code => this.keys[code]);
    }
}