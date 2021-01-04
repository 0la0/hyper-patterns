class MidiDeviceAliases {
  constructor() {
    this.aliases = new Map();
    this.id = Math.random();
  }

  getAlias(aliasName) {
    return this.aliases.get(aliasName);
  }

  setAlias(aliasName, aliasModel) {
    this.aliases.set(aliasName, aliasModel);
  }

  deleteAlias(aliasName) {
    this.aliases.delete(aliasName);
  }

  getAllNames() {
    return [ ...this.aliases.keys() ];
  }
}

const devicesAliases = new MidiDeviceAliases();
export default devicesAliases;
