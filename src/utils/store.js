class Store {
  obj = {
  };

  get(key) {
    return this.obj[key];
  }
  set (key, value) {
    this.obj[key] = value;
  }
}

module.exports = new Store();