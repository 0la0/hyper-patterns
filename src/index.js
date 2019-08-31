import { components, defineComponents } from './components/componentManager';

function init() {
  defineComponents();
}

const PsVizMarkup = {
  components,
  init,
};

(function() {
  document.addEventListener('DOMContentLoaded', init);
})()

export default PsVizMarkup;