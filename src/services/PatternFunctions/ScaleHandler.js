import { PatternTransform } from './PatternTransformer.js';
import ScaleManager from '../scale/ScaleManager.js';

// TODO: move midi functions to module
const freqA4 = 440;
const midiA4 = 69;
const _mtof = midiNote => freqA4 * Math.pow(2, (midiNote - midiA4) / 12);
const _ftom = frequency => midiA4 + Math.round(12 * Math.log2(frequency / freqA4));

const countPredicateFn = () => true;

export function scale(scaleName = 'major', baseNote) {
  const scaleManager = new ScaleManager(scaleName.toLowerCase());
  const transformFn = _pattern => {
    const transformedCycle = _pattern.getRelativeCycle().map((cycleElement) => {
      if (!cycleElement.element) {
        return cycleElement;
      }
      const midiValue = _ftom(cycleElement.element.note);
      const scaleLockNote = scaleManager.getNearestNote(baseNote, midiValue);
      const frequencyValue = _mtof(scaleLockNote);
      cycleElement.element.setNote(frequencyValue);
      return cycleElement;
    });
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
