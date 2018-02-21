import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsControlComponent } from './is-control.component';

describe('IsControlComponent', () => {
  let component: IsControlComponent;
  let fixture: ComponentFixture<IsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
