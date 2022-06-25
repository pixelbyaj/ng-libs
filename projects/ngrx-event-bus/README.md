# NgRxEventBus

Meditor Pattern based EventBus service mechanism as Angular service using RxJs. 
You can publish events to a bus and any component can subscribe the events. Subscribers of your event (event identification is being done using event-name as string). 

[![npm](https://img.shields.io/npm/dt/ngrx-event-bus.svg)](https://www.npmjs.com/package/ngrx-event-bus)
[![npm](https://img.shields.io/github/license/pixelbyaj/ngrx-event-bus.svg)](https://github.com/pixelbyaj/ngrx-event-bus/blob/master/LICENSE)


This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.

## [Live Demo](https://angular-ngrxeventbus.stackblitz.io)
## How to consume
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

1. Install npm package ngrx-event-bus.

    ```console
    npm i ngrx-event-bus --save
    ```
2. Import Module
```typescript 
import {NgRxEventBusModule} from 'ngrx-event-bus';

@NgModule({
    ...
  imports:[NgRxEventBusModule ],
    ...
})

```

3. Register the events if you'd like to support events
```typescript
    //create Event class and inherit by IEvent
    export class BusEvents implements IEvent {
        public static TitleChangeEvent: string = "TitleChangeEvent";
    }

    import {NgRxEventBusService,EmitEvent, IEvent} from 'ngrx-event-bus';
    export class AppComponent  {
        constructor(private eventBus: NgRxEventBusService) { 
          //Optional event registeration
          //default value is optional and if sent it will register event with BehaviorSubject
          //registerEvent will help when you are emitting event before someone subscribing to it
          this.eventBus.registerEvent(BusEvents.TitleChangeEvent,{title:"default title"});
        }
        title = "Demo";
        ngOnInit() {
            //Register Event Listner
            this.eventBus.on(BusEvents.TitleChangeEvent, (title: string) => {
                this.title = title;
            });
        }
    }
```
4. Publish Event if you'd like some one to subscribe
```typescript
    import { EmitEvent,NgRxEventBusService } from 'ngrx-event-bus';
    export class TitleComponent {
        constructor(private eventBus: NgRxEventBusService) { }
        textValue = '';
        onChangeTitle(title) {
            this.eventBus.emit(new EmitEvent(BusEvents.TitleChangeEvent, this.textValue));
        }
    }
```
## What is new in 2.1.1? 
With this release you can able to get First, Last and All values with your first subscription.
```typescript
    this.eventBus.on(BusEvents.TitleChangeEvent, (title: string) => {
                this.title = title;
            },EmitRecord.First);

            this.eventBus.on(BusEvents.TitleChangeEvent, (title: string) => {
                this.title = title;
            },EmitRecord.Last);

            this.eventBus.on(BusEvents.TitleChangeEvent, (title: string[]) => {
                this.title = string.join(title,',');
            },EmitRecord.All);
    /*
        export enum EmitRecord {
              First = 1,
              Last = 2,
              All = 3
        }
    */
``` 
## What is new in 2.1.5 ?
With this release user can now soft unregister the event and later it register the same and the component which already subscribed to the respective event can again get the emitted results.
```typescript
//@Param1 IEvent
//@Param2 soft. By default this parameter will remain false.
this.eventBus.unregisterEvent(BusEvents.TitleChangeEvent,true)
```
## Thumb Rules
1. Event class should implements by IEvent.
2. Declare static string under Event Class.
  
