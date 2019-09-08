import { PatternTransform } from './PatternTransformer';

export default function every(n) {
  if (!Number.isInteger(n) || n < 1) {
    throw new TypeError(`Illegal Argument: integer required for every(${n})`);
  }
  const countPredicateFn = cnt => cnt % n === 0;
  const transformFn = _pattern => _pattern;
  return new PatternTransform(countPredicateFn, transformFn);
}
