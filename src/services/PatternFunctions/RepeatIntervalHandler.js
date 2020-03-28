import { PatternTransform } from './PatternTransformer.js';

export default function repeatInterval(repeatIntervalMs) {
  if (!Number.isFinite(repeatIntervalMs) || repeatIntervalMs <= 0) {
    throw new TypeError(`Illegal Argument: positive number required for repeat-interval(${repeatIntervalMs})`);
  }
  const countPredicateFn = () => true;
  const transformFn = _pattern => {
    // TODO: implement pattern interval
    return _pattern;
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
