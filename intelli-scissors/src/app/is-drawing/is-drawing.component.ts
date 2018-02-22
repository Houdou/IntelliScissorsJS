import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

import * as createjs from 'createjs-module';

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

	constructor(private ele: ElementRef) { }

	ngOnInit() {


	}

	@HostListener('window:resize')
	onResize() {    	
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.width = this.canvas.offsetWidth;

		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;
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
		this.stage.x = this.stage.regX = this.canvas.width / 2;
		this.stage.y = this.stage.regY = this.canvas.height / 2;
		this.stage.autoClear = true;
		this.stage.enableMouseOver();

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", this.stage);
	}

	public LoadImage(img: any): void {
		var bmp = new createjs.Bitmap(img);		
		setTimeout(() => {
			bmp.on('click', (event) => {
				console.log(event);
			});
			let w = bmp.image.width, h = bmp.image.height;
			bmp.regX = w/2;
			bmp.regY = h/2;

			bmp.x = this.canvas.width / 2;
			bmp.y = this.canvas.height / 2;

			if(w > this.canvas.width || h > this.canvas.height) {
				let sW = this.canvas.width / w, sH = this.canvas.height / h;
				this.scale = Math.min(sW, sH, 1);
			}
			this.onImageLoaded.emit(bmp.image);
			this.stage.addChild(bmp);
		}, 0);
		this.stage.update();
	}

	public onImageDrop(event: any): void {
		this.LoadImage(event.src);
		this.handleUpload = false;
	}
}
