export default class PatternBase extends HTMLElement {
  constructor() {
    super();
    this.isMounted = false;
  }

  connectedCallback() {
    this.isMounted = true;
  }

  disconnectedCallback() {
    this.isMounted = false;
  }
}
