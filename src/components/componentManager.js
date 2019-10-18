import HyperPatternArp from './h-arp';
import HyperPatternMod from './h-pat-mod';
import HyperPatternMidi from './h-pat-midi';
import HyperPatternSeq from './h-seq';

export const components = {
  HyperPatternArp,
  HyperPatternMod,
  HyperPatternMidi,
  HyperPatternSeq,
};

export function defineComponents() {
  const componentList = Object.values(components);
  componentList.forEach(component => customElements.define(component.tag, component));
}
