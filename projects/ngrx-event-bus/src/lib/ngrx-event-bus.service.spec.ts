import { TestBed } from '@angular/core/testing';

import { NgrxEventBusService } from './ngrx-event-bus.service';

describe('NgrxEventBusService', () => {
  let service: NgrxEventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgrxEventBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
