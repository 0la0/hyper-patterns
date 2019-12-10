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
    this.messageInlet = this._messageInlet.bind(this);
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

  _messageInlet(message) {
    if (!this.address) { return; }
    const modifiedMessage = message.clone().setAddress(this.address);
    if (this.patternEventInlet) {
      this.patternEventInlet(modifiedMessage);
    } else {
      console.log('publish', modifiedMessage)
      eventBus.publish(modifiedMessage);
    }
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
