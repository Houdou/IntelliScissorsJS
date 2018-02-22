import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'is-control',
	templateUrl: './is-control.component.html',
	styleUrls: ['./is-control.component.css']
})
export class IsControlComponent implements OnInit {
	@Input('MenuBarTitle')
	private MenuBarTitle: string;

	@Output()
	public onMenuFunction = new EventEmitter<object>();

	public menuOperable: boolean = false;

	constructor() { }

	ngOnInit() {
	}

	private Emit(eventName: string):void {
		let event: any = {};
		event.name = eventName;
		this.onMenuFunction.emit(event);
	}

}
