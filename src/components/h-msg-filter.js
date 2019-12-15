import HyperPatternBase from './baseComponent';
import AttributeFn from '../services/AttributeFn';
import { batchRender } from '../services/TaskScheduler';

export default class HyperMessageFilter extends HyperPatternBase {
  static get tag() {
    return 'h-msg-filter';
  }

  static get observedAttributes() {
    return [ 'value', 'every', ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.messageInlet = this._messageInlet.bind(this);
    this.count = 0;

    this.paramMap = {
      value: new AttributeFn('v'),
      every: new AttributeFn('t'),
    };
    batchRender(() => {
      if (this.parentNode.messageInlet) {
        this.parentMessageInlet = this.parentNode.messageInlet;
      }
      HyperMessageFilter.observedAttributes.forEach(attrName => {
        const attrValue = this.getAttribute(attrName);
        if (!attrValue) { return; }
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
    });
  }

  _messageInlet(message) {  
    if (!this.parentMessageInlet) {
      console.log('HyperMessageFilter does not have a parent inlet', message);
      return;
    }
    const modifiedMessage = message.clone();
    const passEvery = !!this.paramMap.every.fn(this.count);
    const passValue = !!this.paramMap.value.fn(modifiedMessage.getNote());
    if (passEvery && passValue) {
      this.parentMessageInlet(modifiedMessage);
    }
    this.count++;
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
