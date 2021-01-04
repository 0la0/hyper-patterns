import HyperPatternBase from './baseComponent';
import MidiMessage, { COMMAND, } from '../services/Midi/MidiMessage';
import provideMidiFactory from '../services/Midi/MidiDeviceFactory';
import { batchRender } from '../services/TaskScheduler';
import { clamp, intOrDefault } from '../services/Math';
import MidiAttribute from '../services/AttributeMidi';

export default class HyperMidiNoteOut extends HyperPatternBase {
  static get tag() {
    return 'h-midi-note-out';
  }

  static get observedAttributes() {
    return [ 'name', 'channel', 'note', 'value', 'notelength', ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.deviceRef = null;
    this.channel = 0;
    this.note = 37;
    this.value = 127;
    this.noteLength = 1000;

    this.patternEventInlet = this.schedule.bind(this);

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
        setValue: channelString => {
          const numericChannel = intOrDefault(channelString, 0);
          this.channel = clamp(numericChannel, 0, 16);
        },
      },
      note: new MidiAttribute(this.patternEventInlet, 60),
      value: new MidiAttribute(this.patternEventInlet, 127),
      notelength: new MidiAttribute(this.patternEventInlet, 120),
    };
    
    batchRender(() => {
      HyperMidiNoteOut.observedAttributes.forEach(attrName => {
        const attrValue = this.getAttribute(attrName);
        if (!attrValue) { return; }
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
    });
  }

  schedule(message) {
    if (!this.deviceRef) {
      return;
    }
    console.log('message?', message);
    // note, value, get from child ....
    setTimeout(() => {
      const note = this.paramMap.note.useChildValue ?
        message.note : this.paramMap.note.getValue(message);
      const value = this.paramMap.value.useChildValue ?
        message.note : this.paramMap.value.getValue(message);
      const noteLength = this.paramMap.notelength.getValue(message);
      console.log('schedule midi message', note, value, noteLength);
      const onMessage = new MidiMessage(COMMAND.NOTE_ON, this.channel, note, value).serialize();
      const offMessage = new MidiMessage(COMMAND.NOTE_OFF, this.channel, note, value).serialize();
      const offTime = message.time + noteLength;
      this.deviceRef.send(onMessage, message.time);
      this.deviceRef.send(offMessage, offTime);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Object.values(this.paramMap).forEach(param => param.dispose && param.dispose());
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
