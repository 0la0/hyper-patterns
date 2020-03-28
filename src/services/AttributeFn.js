import { _ftom, _mtof, } from './PatternFunctions/MidiHandler.js';
import { parseParens, } from './Math.js';

const identityFn = x => x;

const fnBuilder = {
  mtof: _mtof,
  ftom: _ftom
};

function buildFunction(name) {
  const scopedFuncitonName = `${name}`;
  return { [scopedFuncitonName]: function(...args) {
    return fnBuilder[name](...args);
  } }[scopedFuncitonName];
}

const exposedApi = Object.keys(fnBuilder).map(name => buildFunction(name));
const apiNamespace = Object.keys(fnBuilder).join(', ');

function buildFunctionFromUserInput(paramName, userInputString) {
  return new Function(`
    'use strict';
    return () => ${paramName} => ${userInputString};
  `)()();
}

function buildMidiFunctionFromUserInput(paramName, userInputString) {
  return new Function(`
    'use strict';
    return (${apiNamespace}) => ${paramName} => {
      ${paramName} = ftom(${paramName});
      const result = ${userInputString};
      if (typeof result === 'number') {
        return mtof(result);
      }
      return result;
    };  
  `)()(...exposedApi);
}

export default class AttributeFn {
  constructor(paramName) {
    if (!paramName || (typeof paramName !== 'string')) {
      throw new Error(`AttributeFn.constructor requires a param name string, received: ${paramName}`);
    }
    this.fn = identityFn;
    this.paramName = paramName;
  }

  setValue(attrString) {
    const parsed = parseParens(attrString);
    if (!parsed.ok) {
      this.fn = identityFn;
      return;
    }
    const expression = parsed.value;
    this.fn = (attrString.indexOf('asMidi') === 0) ?
      buildMidiFunctionFromUserInput(this.paramName, expression) :
      buildFunctionFromUserInput(this.paramName, expression);
  }
}
