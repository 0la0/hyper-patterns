import HyperPatternBase from './baseComponent';
import metronome, { MetronomeScheduler } from '../services/metronome';
import eventBus from '../services/EventBus';
import CycleHandler from '../services/CycleHandler';
import { batchRender } from '../services/TaskScheduler';

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
    batchRender(() => {
      if (this.parentNode.patternEventInlet) {
        this.patternEventInlet = this.parentNode.patternEventInlet;
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleTick(tickNumber, time) {
    const audioEvents = this.cycleHandler.handleTick(time, metronome.getTickLength());
    if (!audioEvents) { return; }
    if (this.patternEventInlet) {
      audioEvents.forEach(audioEvent => this.patternEventInlet(audioEvent));
    } else {
      audioEvents.forEach(audioEvent => eventBus.publish(audioEvent));
    }
  }
}
