import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IEvent } from '../interface/IEvent';
import { IEventRegister } from '../interface/IEventRegister';
import { EmitEvent, EmitRecord } from '../interface/Event';

@Injectable({
  providedIn: 'root'
})
export class NgRxEventBusService {

  private eventRegister: Map<IEvent, IEventRegister>;
  private eventLastEmitted = {};
  constructor() {
    this.eventRegister = new Map<IEvent, IEventRegister>();
  }

  //#region Public
  /**
    * register event with or without default value.
    * @param event should be IEvent type.
    * @param defaultValue is option if data passed BehaviorSubject type has been considered else Subject type.
    */
  registerEvent(event: IEvent, defaultValue?: unknown) {
    let eventRegister = this.eventRegister.get(event);
    if (eventRegister && eventRegister.unRegister === false) {
      throw `${event} event already registered`;
    }else if(eventRegister && eventRegister.unRegister){
      eventRegister.unRegister = false;
      return;
    }
    eventRegister = {
      event: event,
      subject: defaultValue ? new BehaviorSubject(defaultValue) : new Subject()
    };
    this.eventRegister.set(event, eventRegister);
  }

  /**
    * unregister the event.
    * @param event should be IEvent type.
  */
  unregisterEvent(event: IEvent, soft: boolean = false): boolean {
    const eventRegister = this.eventRegister.get(event);
    if (eventRegister) {
      if (soft) {
        eventRegister.unRegister = true;
      } else {
        eventRegister.subject.unsubscribe();
        this.eventRegister.delete(event);
      }
      return true;
    }
    return false;
  }

  /**
     * Binding function to subscribe the published event.
     * If event has not registered, it will register the same with default Subject type
     * @param event should be IEvent type.
     * @param action callback function when something event got publish.
     * @param emittedValue by the event based on selected enum.
  */
  on(event: IEvent, action: any, emittedValue?: EmitRecord): Subscription {
    let eventRegister = this.eventRegister.get(event);
    if (!eventRegister) {
      eventRegister = { event: event, subject: new Subject() };
      this.eventRegister.set(event, eventRegister);
    }

    if (this.eventLastEmitted[event as string] && emittedValue) {
      let response;
      const eventName = event as string;
      switch (emittedValue) {
        case EmitRecord.First:
          response = this.eventLastEmitted[eventName][0];
          break;
        case EmitRecord.Last:
          response = this.eventLastEmitted[eventName][this.eventLastEmitted[eventName].length - 1];
          break;
        case EmitRecord.All:
          response = this.eventLastEmitted[eventName];
          break;
      }
      setTimeout((data) => {
        eventRegister.subject.next(data);
      }, 0, response);
    }
    return eventRegister.subject.subscribe(action);
  }

  /**
     * Publish event using this function.
     * If event has not registered it will register it with default BehaviorSubject type
     * @param event should be EmitEvent type.
  */
  emit(event: EmitEvent) {
    let eventRegister = this.eventRegister.get(event.name);
    if (!eventRegister) {
      eventRegister = { event: event.name, subject: new BehaviorSubject(event.value) };
      this.eventRegister.set(event.name, eventRegister);
    } else if (eventRegister.unRegister) {
      return;
    }
    eventRegister.subject.next(event.value);
    this.eventLastEmitted[event.name as string] = this.eventLastEmitted[event.name as string] || [];
    this.eventLastEmitted[event.name as string].push(event.value);
  }
  //#endregion
}

