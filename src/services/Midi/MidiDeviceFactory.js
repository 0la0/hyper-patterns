export let midiDeviceFactoryInstance;

class MidiDeviceFactory {
  constructor(midiAccess) {
    this.midiAccess = midiAccess;
  }
  getInputList() {
    return Array.from(this.midiAccess.inputs.values());
  }
  getOutputList() {
    return Array.from(this.midiAccess.outputs.values());
  }
  getInputByName(deviceName) {
    return this.getInputList().find(inputDevice => inputDevice.name === deviceName);
  }
  getOutputByName(deviceName) {
    return this.getOutputList().find(outputDevice => outputDevice.name === deviceName);
  }
}

class MidiDeviceFactoryShim {
  constructor() {
    // eslint-disable-next-line no-console
    console.log('Midi is not supported in this browser');
  }
  getInputList() {
    return [];
  }
  getOutputList() {
    return [];
  }
  getInputByName() {
    return null;
  }
  getOutputByName() {
    return null;
  }
}

function buildMidiFactory () {
  if (!navigator.requestMIDIAccess) {
    return Promise.resolve(new MidiDeviceFactoryShim());
  }
  return navigator.requestMIDIAccess()
    .then(midiAccess => new MidiDeviceFactory(midiAccess));
}

export default function provideMidiFactory() {
  if (midiDeviceFactoryInstance) {
    return Promise.resolve(midiDeviceFactoryInstance);
  }
  else {
    return buildMidiFactory()
      .then(midiDeviceFactory => {
        midiDeviceFactoryInstance = midiDeviceFactory;
        return midiDeviceFactoryInstance;
      })
      .catch(error => {
        throw new Error(error);
      });
  }
}
