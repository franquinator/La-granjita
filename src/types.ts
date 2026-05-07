export class Vector2D {
  x: number;
  y: number;
  constructor(x:number = 0,y:number = 0){
    this.x = x;
    this.y = y;
  }
  
  clone(): Vector2D{
    return new Vector2D(this.x, this.y);
  }

  normalize(): Vector2D {
    const len = Math.sqrt(this.x * this.x + this.y * this.y);
    if (len === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / len, this.y / len);
  }

  add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  mult(s: number): Vector2D {
    return new Vector2D(this.x * s, this.y * s);
  }
}

export interface GridPosition {
  col: number;
  row: number;
}

