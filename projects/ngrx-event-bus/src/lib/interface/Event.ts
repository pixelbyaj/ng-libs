import {IEvent} from "./IEvent";

export class EmitEvent {
  constructor(public name: IEvent, public value?: any) {
  }
}
export enum EmitRecord {
  First = 1,
  Last = 2,
  All = 3
}
