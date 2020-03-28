import { Subscription } from 'sea';
import { intOrDefault } from '../services/Math.js';
import eventBus from '../services/EventBus.js';
import ParamTable from './ParamTable.js';

const PARENTHESES = /\(([^)]+)\)/;

export default class MidiAttribute {
  constructor(scheduler, defaultValue = 0) {
    this.scheduler = scheduler;
    this.value = defaultValue;
    this.eventSubscription;
    this.paramTable = new ParamTable();
    this.useChildValue = false;
  }

  setValue(stringValue) {
    if (this.eventSubscription) {
      eventBus.unsubscribe(this.eventSubscription);
    }
    this.useChildValue = false;
    if (stringValue === 'child') {
      this.useChildValue = true;
      return;
    }
    if (stringValue.indexOf('addr') === 0) {
      const match = stringValue.match(PARENTHESES);
      if (!match) {
        this.value = 0;
      }
      const address = match[1];
      this.eventSubscription = new Subscription()
        .setAddress(address)
        .setOnNext(msg => {
          this.value = msg.note;
          this.paramTable.addScheduledValue(msg.time, msg.note);
        });
      eventBus.subscribe(this.eventSubscription);
      return;
    }
    if (stringValue.indexOf('trigger') === 0) {
      const match = stringValue.match(PARENTHESES);
      if (!match) {
        this.value = 0;
      }
      const address = match[1];
      this.eventSubscription = new Subscription()
        .setAddress(address)
        .setOnNext(msg => {
          this.paramTable.addScheduledValue(msg.time, msg.note);
          this.scheduler(msg);
        });
      eventBus.subscribe(this.eventSubscription);
      return;
    }
    this.value = intOrDefault(stringValue, 0);
    console.log('value set', this.value);
  }

  // TODO: get value for message time
  getValue(msg) {
    console.log('getValueForMessage', msg);
    const scheduledValue = this.paramTable.getValueForTime(msg.time);
    if (scheduledValue === false) {
      return this.value;
    }
    return scheduledValue;
  }

  dispose() {
    console.log('TODO: dispose attr', this);
  }
}
