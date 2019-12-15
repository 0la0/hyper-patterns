import HyperPatternBase from './baseComponent';
import AttributeFn from '../services/AttributeFn';
import { batchRender } from '../services/TaskScheduler';

export default class HyperMessageMap extends HyperPatternBase {
  static get tag() {
    return 'h-msg-map';
  }

  static get observedAttributes() {
    return [ 'value', 'time', ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.messageInlet = this._messageInlet.bind(this);
    this.address = '';
    
    this.paramMap = {
      value: new AttributeFn('v'),
      time: new AttributeFn('t'),
    };
    batchRender(() => {
      if (this.parentNode.messageInlet) {
        this.parentMessageInlet = this.parentNode.messageInlet;
      }
      HyperMessageMap.observedAttributes.forEach(attrName => {
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
    });
  }

  _messageInlet(message) {  
    if (!this.parentMessageInlet) {
      console.log('HyperMessageMap does not have a parent inlet', message);
      return;
    }
    const modifiedMessage = message.clone();
    modifiedMessage.setNote(
      this.paramMap.value.fn(modifiedMessage.getNote())
    );
    modifiedMessage.setTime(
      this.paramMap.time.fn(modifiedMessage.getTime())
    );
    this.parentMessageInlet(modifiedMessage);
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
