export class State {
    gridWidth: number;
    colors: string[] = [];

    constructor(gridWidth: number, colors: []) {
        this.gridWidth = gridWidth;
        this.colors = colors;
    }

    public updateColor(x: number, y: number, color: string): void {
        this.colors[(y - 1) * this.gridWidth + x - 1] = color;
    }

    public getColors(): string[] {
        return this.colors;
    }

    public setColors(colors: string[]): void {
        this.colors = colors;
    }

    public encode(): string {
        return JSON.stringify(this);
    }
}