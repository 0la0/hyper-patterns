export default class MidiProperty {
  constructor(isOn = false, value = 0) {
    this.isOn = isOn;
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  toJson() {
    return {
      value: this.value,
      isOn: this.isOn,
    };
  }

  static fromJson(json) {
    return new MidiProperty(json.isOn, json.value);
  }
}
