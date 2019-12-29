import HyperPatternBase from './baseComponent';
import { ftom, mtof, } from '../services/PatternFunctions/MidiHandler';
import { batchRender } from '../services/TaskScheduler';
import { intOrDefault } from '../services/Math';

export default class HyperPatternScaleLock extends HyperPatternBase {
  static get tag() {
    return 'h-scale';
  }

  static get observedAttributes() {
    return [ 'name', 'base', ];
  }

  updateScale() {
    console.log('udateScale', this.scaleName, this.baseNote); 
  }

  connectedCallback() {
    super.connectedCallback();
    this.patterns = [];
    this.transforms = [];
    this.scaleName = 'major';
    this.baseNote = 0;
    this.paramMap = {
      name: {
        setValue: scaleName => {
          console.log('...', scaleName);
          this.scaleName = scaleName;
          this.updateScale();
        },
      },
      base: {
        setValue: stringVal => {
          this.baseNote = intOrDefault(stringVal, 0);
          this.updateScale(); 
        },
      },
    };
    this.patternModel = {
      appendPattern: (pattern) => {
        Object.values(this.transforms).forEach(transform => pattern.addTransform(transform));
        this.patterns.push(pattern);
        if (this.parentNode.patternModel) {
          const parentOnRemoveCallback = this.parentNode.patternModel.appendPattern(pattern);
          return () => {
            this.patterns = this.patterns.filter(p => p !== pattern);
            parentOnRemoveCallback();
          };
        }
        return () => {};
      },
      updatePattern: (pattern) => {
        this.patterns.map(p => {
          if (p.id === pattern.id) {
            Object.values(this.transforms).forEach(transform => pattern.addTransform(transform));
            this.parentNode.patternModel.updatePattern(pattern);
            return pattern;
          }
          return p;
        });
      }
    };
    batchRender(() => {
      HyperPatternScaleLock.observedAttributes.forEach(attr =>
        this.attributeChangedCallback(attr, undefined, this.getAttribute(attr)));
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    const param = this.paramMap[attrName];
    if (!param) { return; }
    param.setValue(newVal);
  }
}
