import { Component, ViewChild } from '@angular/core';

import { IsControlComponent } from './is-control/is-control.component';
import { IsDrawingComponent } from './is-drawing/is-drawing.component';

import { PixelInfo } from './pixel-info';

export class PixelNode {
	// public 
	public constructor() {

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
		this.drawing.ManuallyLoad('./assets/img.jpg');
	}

	@ViewChild(IsControlComponent)
	private control: IsControlComponent;

	@ViewChild(IsDrawingComponent)
	private drawing: IsDrawingComponent;

	private HandleMenu(event: any): void {
		console.log(event.name);

		switch (event.name) {
			case "ResetImage":
				// code...
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
	}

	private HandlePixelSelect(event: PixelInfo): void {
		console.log(event.data);
	}

	private ResetImage(): void {
		this.control.Reset();
		this.drawing.Reset();
	}
}
