import HyperPatternArp from './h-arp';
import HyperPatternMod from './h-pat-mod';
import HyperPattern from './h-pat';
import HyperPatternSeq from './h-seq';

export const components = {
  HyperPatternArp,
  HyperPatternMod,
  HyperPattern,
  HyperPatternSeq,
};

export function defineComponents() {
  const componentList = Object.values(components);
  componentList.forEach(component => customElements.define(component.tag, component));
}
