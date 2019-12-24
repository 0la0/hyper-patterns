import { Subscription } from 'sea';
import HyperPatternBase from './baseComponent';
import eventBus from '../services/EventBus';
import { batchRender } from '../services/TaskScheduler';

export default class HyperMessageInlet extends HyperPatternBase {
  static get tag() {
    return 'h-msg-inlet';
  }

  static get observedAttributes() {
    return [ 'address' ];
  }

  connectedCallback() {
    super.connectedCallback();

    this.eventHandler = (...args) => {
      if (!this.parentMessageInlet) {
        return;
      }
      this.parentMessageInlet(...args);
    };

    this.paramMap = {
      address: {
        setValue: address => {
          eventBus.unsubscribe(this.eventSubscription);
          this.eventSubscription = new Subscription()
            .setAddress(address)
            .setOnNext(this.eventHandler);
          eventBus.subscribe(this.eventSubscription);
        },
      },
    };

    batchRender(() => {
      if (this.parentNode.messageInlet) {
        this.parentMessageInlet = this.parentNode.messageInlet;
      }
      HyperMessageInlet.observedAttributes
        .forEach(attrName => {
          this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
        });
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
