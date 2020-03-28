import { PatternTransform } from './PatternTransformer.js';

const freqA4 = 440;
const midiA4 = 69;

export const _mtof = midiNote => freqA4 * Math.pow(2, (midiNote - midiA4) / 12);
export const _ftom = frequency => midiA4 + Math.round(12 * Math.log2(frequency / freqA4));

export function mtof() {
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
      if (!cycleElement.element) {
        return cycleElement;
      }
      const frequencyValue = _mtof(cycleElement.element.note);
      cycleElement.element.setNote(frequencyValue);
      return cycleElement;
    });
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}

export function ftom() {
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
      if (!cycleElement.element) {
        return cycleElement;
      }
      const midiValue = _ftom(cycleElement.element.note);
      cycleElement.element.setNote(midiValue);
      return cycleElement;
    });
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
