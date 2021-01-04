import MidiProperty from './MidiAliasProperty.js';

export default class MidiAliasModel {
  constructor() {
    this.aliasName = '';
    this.deviceName = '';
    this.type = 'NOTE'; // CC or note
    this.channel = new MidiProperty();
    this.note = new MidiProperty();
    this.value = new MidiProperty();
    this.duration = new MidiProperty();
  }

  setAliasName(aliasName) {
    this.aliasName = aliasName;
    return this;
  }

  getAliasName() {
    return this.aliasName;
  }

  setDeviceName(deviceName) {
    this.deviceName = deviceName;
    return this;
  }

  getDeviceName() {
    return this.deviceName;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setChannel(channel) {
    this.channel.setValue(channel);
    return this;
  }

  getChannel() {
    return this.channel;
  }

  setNote(note) {
    this.note.setValue(note);
    return this;
  }

  getNote() {
    return this.note;
  }

  setValue(value) {
    this.value.setValue(value);
    return this;
  }

  getValue() {
    return this.value;
  }

  setDuration(duration) {
    this.duration.setValue(duration);
    return this;
  }

  getDuration() {
    return this.duration;
  }

  toJson() {
    return {
      aliasName: this.aliasName,
      deviceName: this.deviceName,
      type: this.type,
      channel: this.channel.toJson(),
      note: this.note.toJson(),
      value: this.value.toJson(),
      duration: this.duration.toJson(),
    };
  }

  static fromJson(json) {
    const model = new MidiAliasModel()
      .setDeviceName(json.deviceName)
      .setAliasName(json.aliasName)
      .setType(json.type);
    model.channel = MidiProperty.fromJson(json.channel);
    model.note = MidiProperty.fromJson(json.note);
    model.value = MidiProperty.fromJson(json.value);
    model.duration = MidiProperty.fromJson(json.duration);
    return model;
  }
}