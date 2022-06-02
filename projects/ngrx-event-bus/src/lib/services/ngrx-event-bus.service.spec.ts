import { TestBed } from '@angular/core/testing';
import { EmitEvent, IEvent } from 'ngrx-event-bus';

import { NgRxEventBusService } from './ngrx-event-bus.service';

describe('NgRxEventBusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgRxEventBusService = TestBed.get(NgRxEventBusService);
    expect(service).toBeTruthy();
  });

  it('should be subscribed', () => {
    const service: NgRxEventBusService = TestBed.get(NgRxEventBusService);
    expect(service.on).toHaveBeenCalled();
    service.on(BusEvents.CustomerChangeEvent,(args)=>{
      expect(args).not.toBeNull()
    })
    expect(service.emit).toHaveBeenCalled();
    service.emit(new EmitEvent(BusEvents.CustomerChangeEvent,true));
  });
  it('should be published', () => {
    const service: NgRxEventBusService = TestBed.get(NgRxEventBusService);
    service.on(BusEvents.CustomerChangeEvent,(args)=>{
      expect(args).not.toBeNull()
    })
    expect(service.emit).toHaveBeenCalled();
    service.emit(new EmitEvent(BusEvents.CustomerChangeEvent,true));
  });

});
export class BusEvents implements IEvent {
  public static CustomerChangeEvent: string = "CustomerChangeEvent";
}
