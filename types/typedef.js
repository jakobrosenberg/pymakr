/**
 * @typedef {import('../src/PyMakr').PyMakr} PyMakr
 * @typedef {import('../src/Device').Device} Device
 * @typedef {import('../src/Project').Project} Project
 * @typedef {import('vscode')} vscode
 */

/**
 * @typedef {Object} Config
 */

/**
 * @typedef {import("@serialport/bindings-cpp").PortInfo & {friendlyName: string}} DeviceInputRaw
 */

/**
 * @typedef {Object} DeviceInput
 * @prop {string} name
 * @prop {'serial'|'telnet'} protocol
 * @prop {string} address
 * @prop {string=} username
 * @prop {string=} password
 * @prop {string=} id if not specified, "<protocol>://<address>" will be used
 * @prop {DeviceInputRaw=} raw
 */

/**
 * @typedef {Object} ProtocolAndAddress
 * @prop {string} protocol
 * @prop {string} address
 */

/**
 * @typedef {import('../src/providers/ProjectsProvider').ProjectTreeItem} ProjectTreeItem
 * @typedef {import('../src/providers/DevicesProvider').DeviceTreeItem} DeviceTreeItem
 * @typedef {import('../src/providers/ProjectsProvider').ProjectDeviceTreeItem} ProjectDeviceTreeItem
 * @typedef {DeviceTreeItem | ProjectDeviceTreeItem} AnyDeviceTreeItem
 * @typedef {import('vscode').TreeItem|import('vscode').Uri|string|Project} projectRef
 */

/**
 * @typedef {object} PymakrConfFile
 * @prop {string[]} py_ignore
 * @prop {string} name
 * @prop {boolean} ctrl_c_on_connect
 * @prop {boolean} reboot_after_upload
 * @prop {boolean} safe_boot_on_upload
 */