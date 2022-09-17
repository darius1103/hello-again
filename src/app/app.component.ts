import { Component, ViewChild } from '@angular/core';
import { State } from './classes/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('canvas') canvas: any = null;
  @ViewChild('colorPicker') colorPicker: any = null;

  title = 'hello-again';

  WIDTH = 500;
  HEIGHT = 500;
  pixel_size = 25;
  mainContext: any;
  pickerContext: any;
  colors: string = '#34abeb, #fceb03, #fcb603, #03cefc, #fc0324';
  encoding: string;
  currentCollors: string[] = [];
  currentFillColor = 'white';
  state: State;

  constructor() {
    this.state = new State(Math.floor(this.WIDTH / this.pixel_size), []);
    this.encoding = '';
  }

  ngAfterViewInit() {
    if (this.canvas === null || this.colorPicker === null) {
      console.log('null canvas...')
      return;
    }
    this.canvas.nativeElement.width = this.WIDTH;
    this.canvas.nativeElement.height = this.HEIGHT;

    this.colorPicker.nativeElement.width = 100;
    this.colorPicker.nativeElement.height = 100;

    this.mainContext = this.canvas.nativeElement.getContext('2d');
    this.pickerContext = this.colorPicker.nativeElement.getContext('2d');

    this.drawBackground();
    this.drawGrid();
    this.generateColorGrid(this.colors);
    this.state.setColors(this.encodeState());
  }

  public fillPixel(event: any): void {
    const absoluteX = event.offsetX;
    const absoluteY = event.offsetY;
    const gridX = Math.ceil(absoluteX / this.pixel_size);
    const gridY = Math.ceil(absoluteY / this.pixel_size);
    this.state.updateColor(gridX, gridY, this.currentFillColor);
    this.drawSquare((gridX - 1) * this.pixel_size, (gridY - 1) * this.pixel_size, this.pixel_size, this.currentFillColor, this.mainContext);
    this.encoding = this.state.encode();
  }

  private encodeState(): string[] {
    const colors: string[] = [];
    let row = -1;
    let column = -1;
    const gridWidth = Math.floor(this.WIDTH / this.pixel_size);
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      if (i % gridWidth === 0) {
        row++;
        column = 0;
      }
      colors.push(this.colorAtLocation(
        row * this.pixel_size + Math.floor(this.pixel_size / 2),
        column * this.pixel_size + Math.floor(this.pixel_size / 2),
        this.mainContext));
    }
    return colors;
  }

  // private projectState(): void {
  //   this.drawBackground();
  //   let i = 0;
  //   let row = -1;
  //   let column = -1;
  //   this.state.getColors()
  //     .forEach(color => {
  //       if (i % gridWidth === 0) {
  //         row++;
  //         column = 0;
  //       }
  //       this.drawSquare(column * availableWidth, row * availableWidth, availableWidth, color, this.pickerContext);
  //       i++;
  //     });
  // }

  public colorsChanged(event: any): void {
    this.generateColorGrid(event.target.value)
  }

  public colorPicked(event: any): void {
    const x = event.offsetX;
    const y = event.offsetY;
    this.currentFillColor = this.colorAtLocation(x, y, this.pickerContext);
  }

  private colorAtLocation(x: number, y: number, ctx: any): string {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return "#" + ("000000" + this.rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
  }

  private rgbToHex(r: number, g: number, b: number): string {
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  private generateColorGrid(colorOptions: string) {
    const colors = colorOptions.split(',')
      .map(colorCode => colorCode.replace(/\s/g, ""))
      .filter(color => color);
    this.currentCollors = colors;
    const gridWidth = Math.ceil(Math.sqrt(this.currentCollors.length));
    const availableWidth = Math.round(100 / gridWidth);
    let row = -1;
    let column = -1;
    let i = 0;
    this.drawSquare(0, 0, 100, 'white', this.pickerContext);
    colors.forEach(color => {
      if (i % gridWidth === 0) {
        row++;
        column = 0;
      }
      this.drawSquare(column * availableWidth, row * availableWidth, availableWidth, color, this.pickerContext);
      column++;
      i++;
    });
  }

  private drawSquare(x: number, y: number, side: number, color: string, ctx: any): void {
    ctx.beginPath();
    ctx.rect(x, y, side, side);
    ctx.fillStyle = color;
    ctx.fill();
  }

  private drawBackground(): void {
    this.drawSquare(0, 0, this.HEIGHT, 'black', this.mainContext);
  }

  private drawGrid(): void {
    this.mainContext.strokeStyle = 'white';
    for (let i = 0; i < Math.floor(this.WIDTH / this.pixel_size); i++) {
      //vertical
      this.mainContext.beginPath();
      this.mainContext.moveTo(i * this.pixel_size, 0);
      this.mainContext.lineTo(i * this.pixel_size, this.HEIGHT);
      this.mainContext.stroke();

      //horizontal
      this.mainContext.beginPath();
      this.mainContext.moveTo(0, i * this.pixel_size);
      this.mainContext.lineTo(this.WIDTH, i * this.pixel_size);
      this.mainContext.stroke();
    }
  }
}
