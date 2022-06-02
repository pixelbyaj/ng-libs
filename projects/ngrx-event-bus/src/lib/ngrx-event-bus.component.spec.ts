import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxEventBusComponent } from './ngrx-event-bus.component';

describe('NgrxEventBusComponent', () => {
  let component: NgrxEventBusComponent;
  let fixture: ComponentFixture<NgrxEventBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgrxEventBusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxEventBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
