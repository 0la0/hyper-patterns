import HyperPatternBase from './baseComponent';
import MidiMessage, { COMMAND, } from '../services/Midi/MidiMessage';
import { midiDeviceFactoryInstance, } from '../services/Midi/MidiDeviceFactory';
import deviceAliases from '../services/Midi/DeviceAliases';
import { batchRender } from '../services/TaskScheduler';
import { clamp, intOrDefault } from '../services/Math';
import MidiAttribute from '../services/AttributeMidi';

export default class HyperMidiOut extends HyperPatternBase {
  static get tag() {
    return 'h-midi-out';
  }

  static get observedAttributes() {
    return [ 'alias', 'channel', 'note', 'value', 'notelength', ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.aliasName = '';
    // this.channel = 0;
    // this.note = 37;
    // this.value = 127;
    // this.noteLength = 1000;

    this.patternEventInlet = this.schedule.bind(this);

    this.paramMap = {
      alias: {
        setValue: aliasName => this.aliasName = aliasName,
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
      HyperMidiOut.observedAttributes.forEach(attrName => {
        const attrValue = this.getAttribute(attrName);
        if (!attrValue) { return; }
        this.attributeChangedCallback(attrName, null, this.getAttribute(attrName));
      });
    });
  }

  _getNote(message, deviceAlias) {
    if (this.hasAttribute('note')) {
      return this.paramMap.note.useChildValue ? message.note : this.paramMap.note.getValue(message);
    } else {
      return deviceAlias.getNote().getValue();
    }
  }

  _getValue(message, deviceAlias) {
    if (this.hasAttribute('value')) {
      return this.paramMap.note.useChildValue ? message.note : this.paramMap.value.getValue(message);
    } else {
      return deviceAlias.getValue().getValue();
    }
  }

  _getDuration(message, deviceAlias) {
    if (this.hasAttribute('noteLength')) {
      return this.paramMap.notelength.getValue(message);
    } else {
      return deviceAlias.getDuration().getValue();
    }
  }

  _getChannel(deviceAlias) {
    if (this.hasAttribute('channel')) {
      return this.channel;
    } else {
      return deviceAlias.getChannel().getValue();
    }
  }

  schedule(message) {
    const aliasModel = deviceAliases.getAlias(this.aliasName);
    if (!aliasModel) {
      console.log('alias model does not exist');
      return;
    }
    const midiDevice = midiDeviceFactoryInstance.getOutputByName(aliasModel.getDeviceName());
    if (!midiDevice) {
      console.log(`MIDI device ${aliasModel.getDeviceName()} not connected`);
      return;
    }

    setTimeout(() => {
      const note = this._getNote(message, aliasModel);
      const value = this._getValue(message, aliasModel);
      const noteLength = this._getDuration(message, aliasModel);
      const channel = this._getChannel(aliasModel);
      const onMessage = new MidiMessage(COMMAND.NOTE_ON, channel, note, value).serialize();
      const offMessage = new MidiMessage(COMMAND.NOTE_OFF, channel, note, value).serialize();
      const offTime = message.time + noteLength;

      // TODO: cc vs note
      midiDevice.send(onMessage, message.time);
      midiDevice.send(offMessage, offTime);
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
