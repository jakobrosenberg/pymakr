const { createLogger } = require("consolite");
const vscode = require("vscode");
const { createDevicesStore } = require("./stores/devices");
const { createProjectsStore } = require("./stores/projects");
const { createTerminalsStore } = require("./stores/terminals");
const { DevicesProvider } = require("./views/devices/Explorer");
const { ProjectsProvider } = require("./views/projects/Explorer");

// https://github.com/pycom/pymakr-vsc/blob/develop/lib/connections/pyserial.js

class PyMakr {
  /**
   * @param {vscode.ExtensionContext} context
   */
  constructor(context) {
    this.context = context;
    this.log = createLogger("PyMakr");
    this.projectStore = createProjectsStore(this);
    this.devicesStore = createDevicesStore(this);
    this.terminalsStore = createTerminalsStore(this);

    // todo only for testing
    let hasTerminal = false;
    // this.devicesStore.subscribe((devices) => {
    //   if (!hasTerminal) this.terminalsStore.create(devices[0].interfaces.usb);
    //   hasTerminal = true;
    // });

    const projectsProvider = new ProjectsProvider(this);
    const devicesProvider = new DevicesProvider(this);

    // vscode.window.registerTerminalLinkProvider()
    // vscode.window.registerTerminalProfileProvider()
    vscode.window.registerTreeDataProvider("pymakr-projects-tree", projectsProvider);
    vscode.window.registerTreeDataProvider("pymakr-devices-tree", devicesProvider);
  }
}

module.exports = { PyMakr };
