import HyperPatternBase from './baseComponent';
import eventBus from '../services/EventBus';

export default class HyperMessageOutlet extends HyperPatternBase {
  static get tag() {
    return 'h-msg-outlet';
  }

  static get observedAttributes() {
    return [ 'address', ];
  }

  connectedCallback() {
    super.connectedCallback();

    // TODO: same pattern as h-seq
    this.messageInlet = message => console.log('broadcast message to:', this.address, message);

    this.address = '';

    this.paramMap = {
      address: {
        setValue: address => this.address = address,
      },
    };
    HyperMessageOutlet.observedAttributes
      .forEach(attrName => {
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    eventBus.unsubscribe(this.eventSubscription);
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
