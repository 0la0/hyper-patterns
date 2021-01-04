import { components, defineComponents } from './components/componentManager';
import provideMidiFactory from './services/Midi/MidiDeviceFactory';
import MidiMessage from './services/Midi/MidiMessage';
import midiDeviceAliases from './services/Midi/DeviceAliases';
import MidiAliasModel from './services/Midi/MidiAliasModel';
import metronome from './services/metronome';

function init() {
  provideMidiFactory();
  defineComponents();
}

const PsVizMarkup = {
  components,
  init,
  provideMidiFactory,
  setTempo: tempo => metronome.setTempo(tempo),
};

(function() {
  document.addEventListener('DOMContentLoaded', init);
})();

export {
  MidiMessage,
  midiDeviceAliases,
  MidiAliasModel,
};
export default PsVizMarkup;