import { components, defineComponents } from './components/componentManager';
import provideMidiFactory from './services/MidiDeviceFactory';
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

export default PsVizMarkup;