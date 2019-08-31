import PsPatMod from './ps-pat-mod';
import PsPatMidi from './ps-pat-midi';
import PsSeq from './ps-seq';

export const components = {
  PsPatMod,
  PsPatMidi,
  PsSeq,
}

export function defineComponents() {
  const componentList = Object.values(components);
  componentList.forEach(component => customElements.define(component.tag, component));
}
