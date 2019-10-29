import HyperPatternBase from './baseComponent';
import metronome, { MetronomeScheduler } from '../services/metronome';
import eventBus from '../services/EventBus';
import CycleHandler from '../services/CycleHandler';

export default class HyperSeq extends HyperPatternBase {
  static get tag() {
    return 'h-seq';
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleTick(tickNumber, time) {
    const audioEvents = this.cycleHandler.handleTick(time, metronome.getTickLength());
    if (!audioEvents) { return; }
    audioEvents.forEach(audioEvent => eventBus.publish(audioEvent));
  }
}
