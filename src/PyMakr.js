const { createLogger } = require("consolite");
const vscode = require("vscode");
const { Commands } = require("./commands");
const { createDevicesStore } = require("./stores/devices");
const { createProjectsStore, createActiveProjectStore } = require("./stores/projects");
const { createTerminalsStore } = require("./stores/terminals");
const { DevicesProvider } = require("./views/devices/Explorer");
const { ProjectsProvider } = require("./views/projects/Explorer");
const serialport = require("serialport");

/**
 *
 * @param {serialport.PortInfo & {friendlyName: string}} raw
 * @returns {DeviceInput}
 */
const rawSerialToDeviceInput = (raw) => ({ address: raw.path, name: raw.friendlyName, protocol: "serial", raw });

class PyMakr {
  /**
   * @param {vscode.ExtensionContext} context
   */
  constructor(context) {
    this.context = context;
    this.log = createLogger("PyMakr");
    this.log.level = 5;
    this.projectsStore = createProjectsStore(this);
    this.activeProjectStore = createActiveProjectStore(this);
    this.devicesStore = createDevicesStore(this);
    this.terminalsStore = createTerminalsStore(this);
    this.commands = new Commands(this).commands;

    this.projectsProvider = new ProjectsProvider(this);
    this.devicesProvider = new DevicesProvider(this);

    this.setup();
  }

  async setup() {
    vscode.window.registerTreeDataProvider("pymakr-projects-tree", this.projectsProvider);
    vscode.window.registerTreeDataProvider("pymakr-devices-tree", this.devicesProvider);
    await Promise.all([this.registerUSBDevices(), this.registerProjects()]);
    await this.recoverProjects();
    this.projectsProvider.refresh();
    this.decorateStatusBar();
  }

  async recoverProjects() {
    return Promise.all(this.projectsStore.get().map((project) => project.recoverProject()));
  }

  decorateStatusBar() {
    const projectSelect = vscode.window.createStatusBarItem("activeWorkspace", 1, 10);
    projectSelect.text = this.activeProjectStore.get()?.name
    projectSelect.command = "pymakr.setActiveProject";
    projectSelect.show();

    const projectUpload = vscode.window.createStatusBarItem("projectUpload", 1, 9);
    projectUpload.text = "$(cloud-upload)";
    projectUpload.command = "pymakr.uploadProject";
    projectUpload.show();

    const projectDownload = vscode.window.createStatusBarItem("projectDownload", 1, 8);
    projectDownload.text = "$(cloud-download)";
    projectDownload.command = "pymakr.downloadProject";
    projectDownload.show();

    this.activeProjectStore.subscribe((project) => (projectSelect.text = project.name));
  }

  async registerProjects() {
    await this.projectsStore.refresh();
    await this.activeProjectStore.setToLastUsedOrFirstFound();
    this.log.debug("active project", this.activeProjectStore.get().folder);
  }

  async registerUSBDevices() {
    const rawSerials = await serialport.list();
    this.devicesStore.insert(rawSerials.map(rawSerialToDeviceInput));
  }
}

module.exports = { PyMakr };
