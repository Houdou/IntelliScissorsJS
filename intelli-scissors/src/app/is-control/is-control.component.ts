import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
	selector: 'is-control',
	templateUrl: './is-control.component.html',
	styleUrls: ['./is-control.component.css']
})
export class IsControlComponent implements OnInit {
	@Input('MenuBarTitle')
	private MenuBarTitle: string;

	public menuOperable: boolean =  true;

	constructor() { }

	ngOnInit() {
	}

}
