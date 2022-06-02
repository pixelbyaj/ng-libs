import { Component } from '@angular/core';
import { NgRxEventBusService, EmitEvent, EmitRecord, IEvent } from 'ngrx-event-bus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  i: number = 0;
  title = 'rxbus'
  constructor(private eventBus: NgRxEventBusService) {
    // this.eventBus.registerEvent(BusEvents.CustomerChangeEvent,{name:"abhishek default"});
  }
  ngOnInit() {
    this.eventBus.emit(new EmitEvent(BusEvents.CustomerChangeEvent, { name: 'abhishek1' }));
    
    this.eventBus.on(BusEvents.CustomerChangeEvent, (cust: Customer) => {
      this.title = cust.name;
    },EmitRecord.Last);
  }
  change($event) {
    this.eventBus.emit(new EmitEvent(BusEvents.CustomerChangeEvent, { name: $event.target.value }));

  }
}

export class Customer {
  public name: any
}

export class BusEvents implements IEvent {
  public static CustomerChangeEvent: string = "CustomerChangeEvent";
}
