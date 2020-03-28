import parseCycle from '../Pattern/PatternStringParser.js';
import getRelativeCycle from '../Pattern/RelativeCycleBuilder.js';
import Pattern from '../Pattern/Pattern.js';
import { uuid } from '../Math.js';
import PatternTransformer from './PatternTransformer.js';

export default class PatternBuilder extends PatternTransformer{
  constructor({ patternString = '', baseAddress = '' }) {
    super();
    if (typeof patternString !== 'string') {
      throw new Error(`PatternString must be a string, received: ${patternString}`);
    }
    if (typeof baseAddress !== 'string') {
      throw new Error(`Pattern base address must be a string, received: ${baseAddress}`);
    }
    this.baseAddress = baseAddress;
    this.setPatternString(patternString);
    this.numTicks = 16;
    this.cnt = 0;
    this.id = uuid();
  }

  setPatternString(patternString) {
    this.patternString = patternString;
    this.pattern = parseCycle(patternString);
    this.relativeCycle = this.pattern.ok ? getRelativeCycle(this.pattern.content, 0, 1, this.baseAddress) : [];
  }

  setValue(patternString) {
    this.setPatternString(patternString);
  }

  setBaseAddress(baseAddress) {
    this.baseAddress = baseAddress;
  }

  tick() {
    const cnt = this.cnt++;
    const clonedCycle = this.relativeCycle.map(ele => ele.clone());
    const originalPattern = new Pattern(clonedCycle, this.baseAddress, this.numTicks, cnt);
    
    const shouldTransform = this.transforms.every(transform => transform.countPredicate(cnt));
    if (shouldTransform) {
      return this.transforms.reduce((pattern, patternTransform) => {
        if (!patternTransform.countPredicate(cnt)) {
          return pattern;
        }
        return patternTransform.transform(pattern);
      }, originalPattern);
    }
    return originalPattern;
  }

  isValid() {
    return this.pattern.ok;
  }

  clone() {
    return new PatternBuilder({
      patternString: this.patternString,
      baseAddress: this.baseAddress
    });
  }
}
