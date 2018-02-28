import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

import * as createjs from 'createjs-module';
import { PixelEvent } from '../pixel-event';

import { ImageUploadComponent } from 'angular2-image-upload';

@Component({
	selector: 'is-drawing',
	templateUrl: './is-drawing.component.html',
	styleUrls: ['./is-drawing.component.css']
})
export class IsDrawingComponent implements OnInit {
	@ViewChild("canvas")
	private canvasRef: ElementRef;

	@ViewChild(ImageUploadComponent)
	private upload: ImageUploadComponent;

	private canvas: HTMLCanvasElement;
	private stage: createjs.Stage;

	public handleUpload: boolean = true;
	private imageLoaded: boolean = false;

	private _scale : number = 1;
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
	public onPixelEvent = new EventEmitter<PixelEvent>();

	constructor(private ele: ElementRef) { }

	ngOnInit() {
	}

	private bmp: createjs.Bitmap;
	private imageContext: CanvasRenderingContext2D;

	private uiContainer: createjs.Container;
	private progressBar: createjs.Shape;
	private seeds: Array<createjs.Shape> = new Array<createjs.Shape>();

	@HostListener('window:resize')
	onResize() {    	
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.width = this.canvas.offsetWidth;
		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;

		this.progressBar.graphics.clear().beginFill('#D0D0D0').dr(0, 1, this.canvas.width, 3);

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
		this.uiContainer = new createjs.Container();

		this.progressBar = new createjs.Shape();
		this.progressBar.graphics.beginFill('#D0D0D0').dr(0, 1, this.canvas.width, 3);
		this.progressBar.scaleX = 0;
		this.uiContainer.addChild(this.progressBar);

		this.stage.addChild(this.uiContainer);
		this.stage.setChildIndex(this.uiContainer, this.stage.numChildren);
		this.stage.update();
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
		this.HideImage();
		// Create pixel selection event
		this.bmp.on('click', (event: any) => {
			console.log(event);
			let [x, y, sx, sy] = this.getImageCoord(event as createjs.MouseEvent);;
			const e = new PixelEvent(x, y, sx, sy, this.GetPixelsAt(x, y, sx, sy, 1));
			e.altKey = event.nativeEvent.altKey;
			e.ctrlKey = event.nativeEvent.ctrlKey;
			e.shiftKey = event.nativeEvent.shiftKey;
			this.onPixelEvent.emit(e);
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
		let e: any = {};
		e.width = w;
		e.height = h;
		e.image = this.bmp.image;
		this.progressBar.x = -this.canvas.width/2;
		this.progressBar.y = -this.canvas.height/2;
		this.onImageLoaded.emit(e);
		this.stage.update();
	}

	public HideImage(): void {
		if(this.bmp == null) return;
		this.bmp.alpha = 0;
		this.stage.update();
	}

	public ShowImage(): void {
		if(this.bmp == null) return;
		this.stage.setChildIndex(this.bmp, 0);
		this.bmp.alpha = 1;
		this.stage.update();
	}

	public Reset(): void {
		if(this.bmp != null) {
			this.stage.removeChild(this.bmp);
			this.stage.x = 0;
			this.stage.y = 0;
			this.stage.update();
			this.bmp = null;
		}
		this.ResetSeeds();
		this.imageLoaded = false;
		this.upload.deleteAll();
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

	public GetAllPixels(): Uint8ClampedArray {
		if(!this.imageLoaded) return;
		let x = - this.bmp.image.width / 2 * this.scale, y = - this.bmp.image.height / 2 * this.scale;
		let w = this.bmp.image.width * this.scale, h = this.bmp.image.height * this.scale;
		return this.imageContext.getImageData(x - 1, y - 1, w + 2, h + 2).data;
	}

	public ResetSeeds(): void {
		if(this.seeds.length > 0) {
			this.seeds.forEach(s => {
				this.uiContainer.removeChild(s);
			})
			this.seeds = new Array<createjs.Shape>();
			this.stage.update();
		}
	}

	public DrawSeeds(x: number, y: number): void {
		let s = new createjs.Shape();
		s.graphics.beginFill('#ff8052').dc(0, 0, 5);
		s.x = x - this.bmp.image.width/2;
		s.y = y - this.bmp.image.height/2;
		console.log(s);
		this.seeds.push(s);
		this.uiContainer.addChild(s);
		this.stage.setChildIndex(this.bmp, 0);
		this.stage.setChildIndex(this.uiContainer, this.stage.numChildren);
		this.stage.update();
	}

	public UpdateLoadingProgress(p: number): void {
		this.progressBar.scaleX = Math.min(Math.max(p, 0), 1);
		this.stage.update();
	}
}
