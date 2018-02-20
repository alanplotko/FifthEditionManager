export default class MockStorage {
  constructor(cache = {}) {
    this.storageCache = cache;
  }

  multiGet = jest.fn(keys => new Promise((resolve) => {
    const data = [];
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(this.storageCache, key)) {
        data.push([key, this.storageCache[key]]);
      } else {
        data.push([key, null]);
      }
    });
    return resolve(data);
  }));

  setItem = jest.fn((key, value) => new Promise((resolve, reject) => {
    if (typeof key !== 'string' || typeof value !== 'string') {
      return reject(new Error('key and value must be string'));
    }
    this.storageCache[key] = value;
    return resolve(this.storageCache[key]);
  }));

  getItem = jest.fn(key => new Promise((resolve) => {
    if (Object.prototype.hasOwnProperty.call(this.storageCache, key)) {
      return resolve(this.storageCache[key]);
    }
    return resolve(null);
  }));

  removeItem = jest.fn(key => new Promise((resolve, reject) => {
    if (Object.prototype.hasOwnProperty.call(this.storageCache, key)) {
      return resolve(delete this.storageCache[key]);
    }
    return reject(new Error('No such key!'));
  }));

  clear = jest.fn(() => new Promise((resolve) => {
    this.storageCache = {};
    return resolve(this.storageCache);
  }));

  getAllKeys = jest.fn(() => new Promise(resolve => resolve(Object.keys(this.storageCache))));
}
