import HyperPatternArp from './h-arp';
import HyperPatternMod from './h-pat-mod';
import HyperPattern from './h-pat';
import HyperPatternSeq from './h-seq';

import HyperMessageFilter from './h-msg-filter';
import HyperMessageInlet from './h-msg-inlet';
import HyperMessageMap from './h-msg-map';
import HyperMessageOutlet from './h-msg-outlet';
import HyperMidiCcOut from './h-midi-cc-out';
import HyperMidiIn from './h-midi-in';
import HyperMidiNoteOut from './h-midi-note-out';

export const components = {
  HyperPatternArp,
  HyperPatternMod,
  HyperPattern,
  HyperPatternSeq,

  HyperMessageFilter,
  HyperMessageInlet,
  HyperMessageMap,
  HyperMessageOutlet,
  HyperMidiCcOut,
  HyperMidiIn,
  HyperMidiNoteOut,
};

export function defineComponents() {
  const componentList = Object.values(components);
  componentList.forEach(component => customElements.define(component.tag, component));
}
