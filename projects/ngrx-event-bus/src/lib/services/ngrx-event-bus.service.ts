import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {IEvent}  from '../interface/IEvent';
import {IEventRegister}  from '../interface/IEventRegister';
import {EmitEvent,EmitRecord} from '../interface/Event';

@Injectable({
  providedIn: 'root'
})
export class NgRxEventBusService {

  private eventRegister: IEventRegister[];
  private eventLastEmitted = {};
  constructor() {
    this.eventRegister = [];
  }

  //#region Public
  /**
    * register event with or without default value.
    * @param event should be IEvent type.
    * @param defaultValue is option if data passed BehaviorSubject type has been considered else Subject type.
    */
  registerEvent(event: IEvent, defaultValue?: unknown) {
    if (this.checkEventRegister(event)) {
      throw `${event} event already registered`;
    }

    this.eventRegister.push({ event: event, subject: defaultValue ? new BehaviorSubject(defaultValue) : new Subject() });
  }

  /**
    * unregister the event.
    * @param event should be IEvent type.
    */
  unregisterEvent(event: IEvent): boolean {
    let $index = this.getRegisteredEventIndex(event);
    if ($index > -1) {
      this.eventRegister[$index].subject.unsubscribe();
      this.eventRegister.splice($index, 1);
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
    let $subject = this.checkEventRegister(event);
    if (!$subject) {
      $subject = { event: event, subject: new Subject() };
      this.eventRegister.push($subject);
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
        $subject.subject.next(data);
      }, 0, response);
    }
    return $subject.subject.subscribe(action);
  }

  /**
     * Publish event using this function.
     * If event has not registered it will register it with default BehaviorSubject type
     * @param event should be EmitEvent type.
  */
  emit(event: EmitEvent) {
    let $subject = this.checkEventRegister(event.name);
    if (!$subject) {
      $subject = { event: event.name, subject: new BehaviorSubject(event.value) };
      this.eventRegister.push($subject);
    }else{
      $subject.subject.next(event.value);
    }
    this.eventLastEmitted[event.name as string] = this.eventLastEmitted[event.name as string] || [];
    this.eventLastEmitted[event.name as string].push(event.value);
  }
  //#endregion

  //#region Private
  private checkEventRegister(event: IEvent) {
    return this.eventRegister.find((item: IEventRegister) => {
      return event === item.event;
    });
  }
  private getRegisteredEventIndex(event: IEvent): number {
    let index = -1;
    const resp = this.eventRegister.find((item: IEventRegister,_index:number) => {
      index = _index;
      return event === item.event;
    });
    if(resp === undefined){
      index = 0;
    }
    return index;
  }
  //#endregion
}

