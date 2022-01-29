const { Socket } = require("net");
const { resolve } = require("path");
const vscode = require("vscode");
const { once } = require("./utils/misc");

// reference: https://github.com/pycom/pymakr-vsc/blob/680770c502f5042526d3b1cb85706fb19c0951d2/lib/main/terminal.js

class Terminal {
  /**
   *
   * @param {PyMakr} pyMakr
   * @param {import('./interfaces/Base').BaseInterface} _interface
   */
  constructor(pyMakr, _interface) {
    const termPath = resolve(process.cwd(), __dirname + "/utils/terminalExec.js");

    /** @type {'connecting'|'connected'|'closed'|'failed'} */
    this.status = "connecting";
    this.pyMakr = pyMakr;
    this.connectionAttempts = 0;
    this.port = Math.round(Math.random() * 1000 + 1337);
    this.host = "127.0.0.1";
    this.term = vscode.window.createTerminal("my new terminal", "node", [termPath, this.port.toString()]);
    this.log = this.pyMakr.log.createChild("Terminal");

    this.connect();
    this.term.show();
  }

  connect() {
    if (!this.connectionAttempts) this.log.info(`Connecting...`);
    this.connectionAttempts++;
    this.stream = new Socket();
    const reconnect = once(() => setTimeout(this.connect.bind(this), 200));

    if (this.connectionAttempts > 20) {
      this.log.error("Failed to start terminal.");
      this.status = "failed";
      return;
    }

    this.stream.connect(this.port, this.host);

    this.stream.on("connect", (err) => {
      this.log.info(err ? "Failed to connect" : "Connected.");
      if (err) this.log.error(err);
      else this.status = "connected";
    });
    this.stream.on("error", (err) => {
      if (this.status !== "connecting") {
        this.log.warn("Error while connecting to term");
        this.log.error(err);
      }
      reconnect();
    });
    this.stream.on("timeout", () => {
      this.log.log("Timed out");
      reconnect();
    });
    this.stream.on("close", (hadError) => {
      if (hadError) reconnect();
      else this.log.warn("Term connection closed");
    });
    this.stream.on("end", () => {
      this.log.warn("Connection ended ");
    });
    this.stream.on("data", (data) => {
      console.log("received data", data);
      // _this.userInput(data);
      // this.term.sendText(data.toString())
      // _this.pyboard.send_user_input(input,function(err){
      //   if(err && err.message == 'timeout'){
      //     _this.logger.warning("User input timeout, disconnecting")
      //     _this.logger.warning(err)
      //     _this.disconnect()
      //   }
      // })
    });
  }
}

module.exports = { Terminal };
