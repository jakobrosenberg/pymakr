const serialport = require("serialport");
const { Device } = require("../Device");
const { writable } = require("../utils/store");

/**
 * @param {PyMakr} pyMakr
 */
const getDevices = async (pyMakr) => {
  const devices = await serialport.list();
  return devices.map((device) => new Device(device, pyMakr));
};

/**
 * @param {PyMakr} pyMakr
 */
const createDevicesStore = (pyMakr) => {
  /** @type {Writable<Device[]>} */
  const store = writable([]);

  const refresh = async () => store.set(await getDevices(pyMakr));
  refresh();
  // setInterval(refresh, 1000)

  return { ...store, refresh };
};

module.exports = { createDevicesStore };
