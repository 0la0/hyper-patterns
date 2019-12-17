import HyperPatternBase from './baseComponent';
import MidiMessage, { COMMAND, } from '../services/MidiMessage';
import provideMidiFactory from '../services/MidiDeviceFactory';
import { batchRender } from '../services/TaskScheduler';

function intOrDefault(stringValue, defaultInt = 0) {
  const intValue = parseInt(stringValue, 10);
  if (Number.isInteger(intValue)) {
    return intValue;
  }
  return defaultInt;
}

export default class HyperMidiNoteOut extends HyperPatternBase {
  static get tag() {
    return 'h-midi-note-out';
  }

  static get observedAttributes() {
    return [ 'name', 'channel', 'note', 'value', 'noteLength', ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.deviceRef = null;
    this.channel = 0;
    this.note = 37;
    this.value = 127;
    this.noteLength = 1000;

    this.paramMap = {
      name: {
        setValue: deviceName => {
          provideMidiFactory()
            .then(midiFactory => {
              this.deviceRef = midiFactory.getOutputByName(deviceName);
            })
            .catch(error => {
              console.log(error);
              this.deviceRef = null;
            });
        }
      },
      channel: {
        setValue: channel => {
          this.channel = intOrDefault(channel, 0);
        },
      },
      note: {
        setValue: note => {
          this.note = intOrDefault(note, 60);
        },
      },
      value: {
        setValue: value => {
          this.value = intOrDefault(value, 127);
        },
      },
      noteLength: {
        setValue: noteLength => {
          this.noteLength = intOrDefault(noteLength, 120);
        },
      },
    };
    console.log('h-midi-note-out connected')
    this.patternEventInlet = message => this.schedule(message);
    batchRender(() => {
      HyperMidiNoteOut.observedAttributes.forEach(attrName => {
        const attrValue = this.getAttribute(attrName);
        if (!attrValue) { return; }
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
    });
  }

  schedule(message) {
      // console.log('schedule midi note', message);
      // console.log('channel', this.channel, this.note, this.value);
    if (!this.deviceRef) {
      return;
    }
    const note = this.note;
    const value = message.note;
    const onMessage = new MidiMessage(COMMAND.NOTE_ON, this.channel, note, value).serialize();
    const offMessage = new MidiMessage(COMMAND.NOTE_OFF, this.channel, note, value).serialize();
    const offTime = message.time + this.noteLength;
    // console.log('send message to devie', message.time, offTime);
    this.deviceRef.send(onMessage, message.time);
    this.deviceRef.send(offMessage, offTime);
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
