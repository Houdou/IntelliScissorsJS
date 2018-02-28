import { Component, ViewChild } from '@angular/core';

import { IsControlComponent } from './is-control/is-control.component';
import { IsDrawingComponent } from './is-drawing/is-drawing.component';

import { PixelEvent } from './pixel-event';
import { FibonacciHeap as FH } from '@tyriar/fibonacci-heap';

class Utils {
	public static mod(n, m) {
		return ((n%m)+m)%m; 
	}

	public static mapIndex = new Array<number>(5, 2, 1, 0, 3, 6, 7, 8);
}

export class PixelNode {
	public x: number;
	public y: number;
	public link: Array<number>;
	public cost: Array<number>;
	public state: number; // 0 - INITIAL, 1 - ACTIVE, 2 - EXPANDED
	public totalCost: number;

	public prevNode: PixelNode;
	public constructor(x, y, data, neibs: Array<number>) {
		this.x = x;
		this.y = y;
		this.link = new Array(8);
		if(data != null && data.length > 0 && neibs != null) {
			for(let i = 1; i < 8; i += 2) {
				this.link[i] = 0;
				const neib1 = neibs[Utils.mapIndex[Utils.mod(i + 1, 8)]], neib2 = neibs[Utils.mapIndex[Utils.mod(i - 1, 8)]];
				for(let cidx = 0; cidx < 3; cidx++) {
					this.link[i] += (data[neib1 * 4 + cidx] - data[neib2 * 4 + cidx])**2 / 6;
				}
				this.link[i] = Math.sqrt(this.link[i]);
			}
			for(let i = 0; i < 8; i += 2) {
				this.link[i] = 0;
				const neib1 = neibs[Utils.mapIndex[Utils.mod(i + 2, 8)]], neib2 = neibs[Utils.mapIndex[Utils.mod(i + 1, 8)]],
				neib3 = neibs[Utils.mapIndex[Utils.mod(i - 1, 8)]], neib4 = neibs[Utils.mapIndex[Utils.mod(i - 2, 8)]];
				for(let cidx = 0; cidx < 3; cidx++) {
					this.link[i] += (data[neib1 * 4 + cidx] + data[neib2 * 4 + cidx]
						- data[neib3 * 4 + cidx] - data[neib4 * 4 + cidx])**2 / 6;
				}
				this.link[i] = Math.sqrt(this.link[i]);
			}
		}
		const maxD = Math.max(...this.link);
		this.cost = this.link.map((l, i) => (maxD - l)*(i&0b01 ? Math.SQRT2 : 1));

		this.state = 0;
		this.prevNode = null;
	}

	public AssignPrevNode(node: PixelNode) {
		this.prevNode = node;
	}
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	public title: string = 'Intelli Scissors';

	ngAfterContentInit() {
		// this.drawing.ManuallyLoad('./assets/img.jpg');
	}

	@ViewChild(IsControlComponent)
	private control: IsControlComponent;

	@ViewChild(IsDrawingComponent)
	private drawing: IsDrawingComponent;

	private width: number;
	private height: number;
	private isImageLoaded: boolean = false;

	private seeds: Array<number> = new Array<number>();
	public nodes: Array<PixelNode> = new Array<PixelNode>();

	private HandleMenu(event: any): void {
		console.log(event.name);

		switch (event.name) {
			case "ResetImage":
				this.ResetImage();
				break;
			case "SaveContour":
				break;
			case "SaveMask":
				break;

			case "DisplayImage":
				break;
			case "DisplayImageContour":
				break;

			case "DebugPixelNode":
				break;
			case "DebugCostGraph":
				break;
			case "DebugPathTree":
				break;
			case "DebugMinPath":
				break;

			default:
				break;
		}
	}

	private HandleImageLoaded(event: any): void {
		this.control.menuOperable = true;
		this.width = event.width;
		this.height = event.height;
		this.isImageLoaded = true;
		this.InitAllNode();
	}

	private HandlePixelEvent(event: PixelEvent): void {
		if(event.ctrlKey) {
			// Initial seed
			this.seeds = new Array<number>();
			this.CreateSeed(event.x, event.y);
		} else if(this.seeds.length > 0) {
			// Following seeds
			this.CreateSeed(event.x, event.y);
		}
	}

	public InitAllNode(): void {
		// TODO: Initialize using multithreaded-webworker

		if(!this.isImageLoaded) return;
		console.log("Start", new Date().getTime());
		let data = this.drawing.GetAllPixels();
		for(let v = 1; v <= this.height; v++) {
			setTimeout(() => {
				for(let u = 1; u <= this.width; u++) {
					let neibs = new Array(8);
					for(let _v = -1; _v <= 1; _v++) {
						for(let _u = -1; _u <=1 ; _u++) {
							neibs.push((v + _v) * this.width + (u + _u));
						}
					}
					this.nodes[v * this.width + u] = new PixelNode(u, v, data, neibs);
				}
				this.drawing.UpdateLoadingProgress(v / this.height);
			}, 0);
		}
		setTimeout(() => {
			this.drawing.UpdateLoadingProgress(0);
			this.drawing.ShowImage();
			console.log("End", new Date().getTime());
		}, 0);
	}

	public CreateSeed(x: number, y: number): void {
		this.seeds.push(y * this.width + x);
		this.drawing.DrawSeeds(x, y);
	}

	private ResetImage(): void {
		this.control.Reset();
		this.drawing.Reset();
	}
}
