import HyperPatternBase from './baseComponent';
import PatternBuilder from '../services/PatternFunctions/PatternBuilder.js';
import { batchRender } from '../services/TaskScheduler';

export default class HyperPattern extends HyperPatternBase {
  static get tag() {
    return 'h-pat';
  }

  static get observedAttributes() {
    return [ 'address', 'pattern' ];
  }

  connectedCallback() {
    super.connectedCallback();
    const patternBuilder = new PatternBuilder({
      patternString: this.hasAttribute('pattern') ? this.getAttribute('pattern') : '',
      baseAddress: this.hasAttribute('address') ? this.getAttribute('address') : '',
    });
    this.paramMap = {
      pattern: {
        setValue: patternString => patternBuilder.setValue(patternString),
      },
      address: {
        setValue: address => patternBuilder.setAddress(address),
      },
    };
    batchRender(() => {
      if (this.parentNode.patternModel) {
        this.onRemoveCallback = this.parentNode.patternModel.appendPattern(patternBuilder);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.onRemoveCallback) {
      this.onRemoveCallback();
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    const param = this.paramMap[attrName];
    if (!param) {
      throw new Error(`Observed attribute not mapped ${attrName}`);
    }
    param.setValue(newVal);
  }
}
