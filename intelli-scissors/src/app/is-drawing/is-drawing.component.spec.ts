import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsDrawingComponent } from './is-drawing.component';

describe('IsDrawingComponent', () => {
  let component: IsDrawingComponent;
  let fixture: ComponentFixture<IsDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
