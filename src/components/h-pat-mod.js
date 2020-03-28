import HyperPatternBase from './baseComponent';
import degrade from '../services/PatternFunctions/DegradeHandler';
import every from '../services/PatternFunctions/EveryHandler';
import { ftom, mtof, } from '../services/PatternFunctions/MidiHandler';
import offset from '../services/PatternFunctions/OffsetHandler';
import repeat from '../services/PatternFunctions/RepeatHandler';
import repeatInterval from '../services/PatternFunctions/RepeatIntervalHandler';
import reverse from '../services/PatternFunctions/ReverseHandler';
import rotate from '../services/PatternFunctions/RotateHandler';
import speed from '../services/PatternFunctions/SpeedHandler';

// TODO: skip, map
const transformDelegate = {
  degrade,
  every,
  ftom,
  mtof,
  offset,
  repeat,
  repeatInterval,
  reverse,
  rotate,
  speed,
};

export default class HyperPatternMod extends HyperPatternBase {
  static get tag() {
    return 'h-pat-mod';
  }

  static get observedAttributes() {
    return Object.keys(transformDelegate);
  }

  addTransform(key, value) {
    const transformer = transformDelegate[key](value);
    this.transforms[key] = transformer;
    this.patterns.forEach(pattern => pattern.addTransform(transformer));
  }

  removeTransform(key) {
    this.patterns.forEach(pattern => pattern.removeTransform(this.transforms[key]));
    delete this.transforms[key];
  }

  connectedCallback() {
    super.connectedCallback();
    this.patterns = [];

    this.transforms = HyperPatternMod.observedAttributes
      .filter(attr => this.hasAttribute(attr))
      .reduce((acc, attr) => {
        const value = parseFloat(this.getAttribute(attr), 10);
        const transform = transformDelegate[attr](value);
        return Object.assign(acc, { [attr]: transform });
      }, {});

    this.patternModel = {
      appendPattern: (pattern) => {
        Object.values(this.transforms).forEach(transform => pattern.addTransform(transform));
        this.patterns.push(pattern);
        if (this.parentNode.patternModel) {
          const parentOnRemoveCallback = this.parentNode.patternModel.appendPattern(pattern);
          return () => {
            this.patterns = this.patterns.filter(p => p !== pattern);
            parentOnRemoveCallback();
          };
        }
        return () => {};
      },
      updatePattern: (pattern) => {
        this.patterns.map(p => {
          if (p.id === pattern.id) {
            Object.values(this.transforms).forEach(transform => pattern.addTransform(transform));
            this.parentNode.patternModel.updatePattern(pattern);
            return pattern;
          }
          return p;
        });
      }
    };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.isMounted) { return; }
    if (!this.hasAttribute(attrName)) {
      this.removeTransform(attrName);
      return;
    }
    if (oldVal === null  && newVal !== null) {
      this.addTransform(attrName, parseFloat(newVal, 10));
      return;
    }
    if (oldVal !== newVal) {
      this.removeTransform(attrName);
      this.addTransform(attrName, parseFloat(newVal, 10));
    }
  }
}
