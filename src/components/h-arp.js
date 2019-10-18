import HyperPatternBase from './baseComponent';
import arpeggiate from '../services/PatternFunctions/ArpeggiatorHandler';

const defaultValues = {
  mode: 'up',
  step: 1,
  distance: 12,
  rate: 1,
  repeat: 1
};

const attributeTypes = {
  mode: 'string',
  step: 'number',
  distance: 'number',
  rate: 'number',
  repeat: 'number'
};

export default class HyperPatternArp extends HyperPatternBase {
  static get tag() {
    return 'h-arp';
  }

  static get observedAttributes() {
    return [ 'mode', 'step', 'distance', 'rate', 'repeat' ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.patterns = [];
    
    const initialParams = PsArp.observedAttributes
      .filter(attr => this.hasAttribute(attr))
      .reduce((acc, attr) => {
        const value = this.getAttribute(attr);
        const val = attributeTypes[attr] === 'number' ? parseFloat(value, 10) : value;
        return Object.assign(acc, { [attr]: val });
      }, {});
    this.params = Object.assign({}, defaultValues, initialParams);
    this.arpTransform = arpeggiate(this.params);

    this.patternModel = {
      appendPattern: (pattern) => {
        // Object.values(this.transforms).forEach(transform => pattern.addTransform(transform));
        pattern.addTransform(this.arpTransform);
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
            // Object.values(this.transforms).forEach(transform => pattern.addTransform(transform));
            pattern.addTransform(this.arpTransform);
            this.parentNode.patternModel.updatePattern(pattern);
            return pattern;
          }
          return p;
        });
      }
    };
  }

  disconnectedCallback() {} // TODO

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    const val = attributeTypes[attrName] === 'number' ? parseFloat(newVal, 10) : newVal;
    this.params[attrName] = val;
    const arpTransform = arpeggiate(this.params);
    this.patterns.forEach(pattern => {
      pattern.removeTransform(this.arpTransform);
      pattern.addTransform(arpTransform);
    });
    this.arpTransform = arpTransform;
    // console.log('params', this.params);
  }
}
