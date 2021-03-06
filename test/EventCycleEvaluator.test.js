import assert from 'assert';
import parseCycle from '../src/services/Pattern/PatternStringParser.js';
import getRelativeCycle from '../src/services/Pattern/RelativeCycleBuilder.js';
import RelativeCycleElement from '../src/services/Pattern/RelativeCycleElement.js';
import { buildAudioEventsFromPattern } from '../src/services/Pattern/AudioEventBuilder.js';
import AudioEvent from '../src/services/AudioEvent.js';

const BASE_ADDRESS = '';

describe('CycleEvaluator', () => {
  it('throws an error if the cycle is not an array', () => {
    assert.throws(() => getRelativeCycle('[]'), Error, 'Cycle must be an array');
    assert.throws(() => buildAudioEventsFromPattern('[]'), Error, 'Cycle must be an array');
  });

  it('returns an empty array', () => {
    const parsedCycle = parseCycle('[]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, { audio: 0, midi: 0 }, 4);
    assert.deepEqual(relativeCycle, []);
    assert.deepEqual(cycleForTime, []);
  });

  it('returns a singleton', () => {
    const parsedCycle = parseCycle('[ a ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, BASE_ADDRESS, 2, 4);
    assert.deepEqual(relativeCycle, [ new RelativeCycleElement(new AudioEvent('a', undefined, 2), 0) ]);
    assert.deepEqual(cycleForTime, [ new AudioEvent('a', undefined, 2) ]);
  });

  it('evenly divides time between two elements', () => {
    const parsedCycle = parseCycle('[ a b ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, BASE_ADDRESS, 2, 4);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement(new AudioEvent('a', undefined, 2), 0),
      new RelativeCycleElement(new AudioEvent('b', undefined, 4), 0.5)
    ]);
    assert.deepEqual(cycleForTime, [
      new AudioEvent('a', undefined, 2),
      new AudioEvent('b', undefined, 4),
    ]);
  });

  it('evenly divides time between three elements', () => {
    const parsedCycle = parseCycle('[ a b c ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, BASE_ADDRESS, 3, 3);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement(new AudioEvent('a', undefined, 3), 0),
      new RelativeCycleElement(new AudioEvent('b', undefined, 3.999999), 0.333333),
      new RelativeCycleElement(new AudioEvent('c', undefined, 5.000001), 0.666667)
    ]);
    assert.deepEqual(cycleForTime, [
      new AudioEvent('a', undefined, 3),
      new AudioEvent('b', undefined, 3.999999),
      new AudioEvent('c', undefined, 5.000001)
    ]);
  });

  it('evenly divides time between four elements', () => {
    const parsedCycle = parseCycle('[ a b c d ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, BASE_ADDRESS, 4, 2);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement(new AudioEvent('a', undefined, 4), 0),
      new RelativeCycleElement(new AudioEvent('b', undefined, 4.5), 0.25),
      new RelativeCycleElement(new AudioEvent('c', undefined, 5), 0.5),
      new RelativeCycleElement(new AudioEvent('d', undefined, 5.5), 0.75)
    ]);
    assert.deepEqual(cycleForTime, [
      new AudioEvent('a', undefined, 4),
      new AudioEvent('b', undefined, 4.5),
      new AudioEvent('c', undefined, 5),
      new AudioEvent('d', undefined, 5.5)
    ]);
  });

  it('flattens nested cycles', () => {
    const parsedCycle = parseCycle('[ [ a ] [ b ] ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, BASE_ADDRESS, 2, 1);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement(new AudioEvent('a', undefined, 2), 0),
      new RelativeCycleElement(new AudioEvent('b', undefined, 2.5), 0.5)
    ]);
    assert.deepEqual(cycleForTime, [
      new AudioEvent('a', undefined, 2),
      new AudioEvent('b', undefined, 2.5)
    ]);
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = parseCycle('[ [ a b c d ] [ 1 2 3 4 ] ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1, 'base-address');
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, 'base-address', 0, 8);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement(new AudioEvent('a', undefined, 0), 0),
      new RelativeCycleElement(new AudioEvent('b', undefined, 1), 0.125),
      new RelativeCycleElement(new AudioEvent('c', undefined, 2), 0.25),
      new RelativeCycleElement(new AudioEvent('d', undefined, 3), 0.375),
      new RelativeCycleElement(new AudioEvent('base-address', 1, 4), 0.5),
      new RelativeCycleElement(new AudioEvent('base-address', 2, 5), 0.625),
      new RelativeCycleElement(new AudioEvent('base-address', 3, 6), 0.75),
      new RelativeCycleElement(new AudioEvent('base-address', 4, 7), 0.875)
    ]);
    assert.deepEqual(cycleForTime, [
      new AudioEvent('a', 60, 0),
      new AudioEvent('b', 60, 1),
      new AudioEvent('c', 60, 2),
      new AudioEvent('d', 60, 3),
      new AudioEvent('base-address', 1, 4),
      new AudioEvent('base-address', 2, 5),
      new AudioEvent('base-address', 3, 6),
      new AudioEvent('base-address', 4, 7)
    ]);
  });

  it('evenly divides time in nested cycles', () => {
    const parsedCycle = parseCycle('[ a [ b [ c d ] ] ]').content;
    const relativeCycle = getRelativeCycle(parsedCycle, 0, 1);
    const cycleForTime = buildAudioEventsFromPattern(relativeCycle, BASE_ADDRESS, 0, 8);
    assert.deepEqual(relativeCycle, [
      new RelativeCycleElement(new AudioEvent('a', undefined, 0), 0),
      new RelativeCycleElement(new AudioEvent('b', undefined, 4), 0.5),
      new RelativeCycleElement(new AudioEvent('c', undefined, 6), 0.75),
      new RelativeCycleElement(new AudioEvent('d', undefined, 7), 0.875)
    ]);
    assert.deepEqual(cycleForTime, [
      new AudioEvent('a', undefined, 0),
      new AudioEvent('b', undefined, 4),
      new AudioEvent('c', undefined, 6),
      new AudioEvent('d', undefined, 7),
    ]);
  });
});
