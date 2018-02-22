import { Component, ViewChild } from '@angular/core';

import { IsControlComponent } from './is-control/is-control.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	public title: string = 'Intelli Scissors';

	@ViewChild(IsControlComponent)
	private control: IsControlComponent;

	private HandleMenu(event: any): void {
		console.log(event.name);
	}

	private HandleImageLoaded(event: any): void {
		// console.log(event);
		this.control.menuOperable = true;
	}
}
