import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

import * as createjs from 'createjs-module';
import { PixelInfo } from '../pixel-info';

@Component({
	selector: 'is-drawing',
	templateUrl: './is-drawing.component.html',
	styleUrls: ['./is-drawing.component.css']
})
export class IsDrawingComponent implements OnInit {
	@ViewChild("canvas")
	private canvasRef: ElementRef;

	private canvas: HTMLCanvasElement;
	private stage: createjs.Stage;

	public handleUpload: boolean = true;
	private imageLoaded: boolean = false;

	private _scale : number;
	public get scale() : number {
		return this._scale;
	}
	public set scale(v : number) {
		this._scale = v;
		this.stage.scaleX = this.stage.scaleY = v;
	}

	@Output()
	public onImageLoaded = new EventEmitter<any>();

	@Output()
	public onPixelSelected = new EventEmitter<PixelInfo>();

	constructor(private ele: ElementRef) { }

	ngOnInit() {
	}

	private bmp: createjs.Bitmap;
	private imageContext: CanvasRenderingContext2D;

	@HostListener('window:resize')
	onResize() {    	
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.width = this.canvas.offsetWidth;
		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;
		if(this.imageLoaded) {
			let w = this.bmp.image.width, h = this.bmp.image.height;
			if(w > this.canvas.width || h > this.canvas.height) {
				let sW = this.canvas.width / w, sH = this.canvas.height / h;
				this.scale = Math.min(sW, sH, 1);
			}
		}

		this.stage.update();
	}

	ngAfterViewInit() {
		this.canvas = this.canvasRef.nativeElement;
		this.setupCanvas();
	}

	private setupCanvas(): void {
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.width = this.canvas.offsetWidth;
		this.stage = new createjs.Stage(this.canvas);
		this.stage.autoClear = true;
		this.stage.enableMouseOver();

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", this.stage);
	}

	public LoadImage(img: any): void {
		this.bmp = new createjs.Bitmap(img);
		this.bmp.alpha = 0;
		this.stage.addChild(this.bmp);
		let displayCheckInterval = setInterval(() => {
			console.log("Checking image load");
			if(!this.handleUpload && this.bmp.image.width != 0) {
				this.imageLoaded = true;
				this.prepareImage();
				console.log(`Image dim: ${this.bmp.image.width}, ${this.bmp.image.height}.`);
				clearInterval(displayCheckInterval);
			}
		}, 100);
		this.stage.update();
	}

	private prepareImage(): void {
		// Create pixel selection event
		this.bmp.on('click', (event) => {
			console.log(event);
			let [x, y, sx, sy] = this.getImageCoord(event as createjs.MouseEvent);;
			this.onPixelSelected.emit(new PixelInfo(x, y, sx, sy, this.GetPixelsAt(x, y, sx, sy, 1)));
		});
		let w = this.bmp.image.width, h = this.bmp.image.height;

		this.imageContext = this.canvas.getContext('2d');

		this.bmp.regX = w/2;
		this.bmp.regY = h/2;

		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;

		if(w > this.canvas.width || h > this.canvas.height) {
			let sW = this.canvas.width / w, sH = this.canvas.height / h;
			this.scale = Math.min(sW, sH, 1);
		}
		this.onImageLoaded.emit(this.bmp.image);
		this.bmp.alpha = 1;
	}

	public Reset(): void {
		if(this.bmp != null) {
			this.stage.removeChild(this.bmp);
			this.stage.update();
			this.bmp = null;
		}
		this.imageLoaded = false;
		this.handleUpload = true;
	}

	private onImageDrop(event: any): void {
		this.LoadImage(event.src);
		this.handleUpload = false;
	}

	public ManuallyLoad(url: string): void {
		this.Reset();
		setTimeout(() => {
			this.LoadImage(url);
			this.handleUpload = false;
		}, 0);
	}

	private getImageCoord(event: createjs.MouseEvent): Array<number> {
		let x = (event.stageX - this.stage.x) / this.scale + this.bmp.image.width / 2,
			y = (event.stageY - this.stage.y) / this.scale + this.bmp.image.height / 2;
		console.log(~~x, ~~y);
		return [~~x, ~~y, event.stageX, event.stageY];
	}

	public GetPixelsAt(x: number, y: number, sx: number, sy: number, extend: number = 0): Uint8ClampedArray {
		if(!this.imageLoaded) return;
		// TOOD: Handle border
		return this.imageContext.getImageData(sx - extend, sy - extend, 1 + 2 * extend, 1 + 2 * extend).data;
	}
}
