import HyperPatternBase from './baseComponent';

export default class HyperMidiCcOut extends HyperPatternBase {
  static get tag() {
    return 'h-midi-cc-out';
  }

  static get observedAttributes() {
    return [ '' ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.paramMap = {};
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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
