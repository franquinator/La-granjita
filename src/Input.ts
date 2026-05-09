export type KeyCallback = () => void;

interface Observer {
    callback: KeyCallback;
    keyCodes: string[];
    anyKey: boolean;
}

export class Input {
    keys: Record<string, boolean> = {};
    private observers = new Set<Observer>();
    private lastPressed: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('keydown', (e) => { this.keys[e.code] = true; this.onKeyDown(e.code); });
        window.addEventListener('keyup', (e) => { this.keys[e.code] = false; this.onKeyUp(e.code); });
    }

    subscribe(callback: KeyCallback, keyCodes?: string[]): void {
        this.observers.add({ callback, keyCodes: keyCodes ?? [], anyKey: !keyCodes });
    }

    unsubscribe(callback: KeyCallback): void {
        for (const observer of this.observers) {
            if (observer.callback === callback) {
                this.observers.delete(observer);
                return;
            }
        }
    }

    private notify(keyCode: string): void {
        for (const observer of this.observers) {
            if (observer.anyKey || observer.keyCodes.includes(keyCode)) {
                observer.callback();
            }
        }
    }

    private onKeyDown(keyCode: string): void {
        if (!this.lastPressed[keyCode]) {
            this.lastPressed[keyCode] = true;
            this.notify(keyCode);
        }
    }

    private onKeyUp(keyCode: string): void {
        this.lastPressed[keyCode] = false;
    }

    isDown(keyCode: string): boolean {
        return !!this.keys[keyCode];
    }

    isAnyDown(keyCodes: string[]): boolean {
        return keyCodes.some(code => this.keys[code]);
    }
}

/* EJEMPLO:
// Todas las teclas
input.subscribe(() => console.log('tecla!'));

// Solo Space
input.subscribe(() => console.log('espacio!'), ['Space']);
*/