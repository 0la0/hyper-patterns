import metronome, { MetronomeScheduler } from '../services/metronome';
// import eventBus from '../services/EventBus';
import CycleHandler from '../services/CycleHandler';
import PsBase from './ps-base';

export default class PsSeq extends PsBase {
  static get tag() {
    return 'ps-seq';
  }

  connectedCallback() {
    super.connectedCallback();
    this.cycleHandler = new CycleHandler([]);
    this.patternModel = {
      appendPattern: pattern => this.cycleHandler.appendPattern(pattern),
      updatePattern: pattern => this.cycleHandler.updatePattern(pattern)
    };
    this.metronomeSchedulable = new MetronomeScheduler({
      processTick: this.handleTick.bind(this),
      stop: () => console.log('ps-seq todo: stop'),
    });
    metronome.register(this.metronomeSchedulable);
    console.log('metronome', metronome);
  }

  handleTick(tickNumber, time) {
    const audioEvents = this.cycleHandler.handleTick(time, metronome.getTickLength());
    if (!audioEvents) { return; }
    console.log('audioEvents', audioEvents)
    // audioEvents.forEach(audioEvent => eventBus.publish(audioEvent));
  }
}
