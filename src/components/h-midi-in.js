import HyperPatternBase from './baseComponent';
import provideMidiFactory from '../services/MidiDeviceFactory';
import MidiMessage from '../services/MidiMessage';

export default class HyperMidiIn extends HyperPatternBase {
  static get tag() {
    return 'h-midi-in';
  }

  static get observedAttributes() {
    return [ 'name', ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.deviceRef;

    this.midiMessageHandler = event => {
      const message = MidiMessage.fromSerialized(event.data);
      console.log('message', message);
    }

    this.paramMap = {
      name: {
        setValue: deviceName => {
          if (this.deviceRef) {
            this.deviceRef.removeEventListener('midimessage', this.midiMessageHandler);
          }
          provideMidiFactory()
            .then(midiFactory => {
              const device = midiFactory.getInputByName(deviceName);
              if (!device) {
                return;
              }
              this.deviceRef = device;
              this.deviceRef.addEventListener('midimessage', this.midiMessageHandler);
            })
            .catch(error => console.log(error));
        },
      },
    };

    HyperMidiIn.observedAttributes
      .forEach(attrName => {
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.deviceRef) {
      this.deviceRef.removeEventListener('midimessage', this.midiMessageHandler);
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
