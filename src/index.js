import { components, defineComponents } from './components/componentManager';
import provideMidiFactory from './services/MidiDeviceFactory';

function init() {
  provideMidiFactory();
  defineComponents();
}

const PsVizMarkup = {
  components,
  init,
  provideMidiFactory,
};

(function() {
  document.addEventListener('DOMContentLoaded', init);
})();

export default PsVizMarkup;