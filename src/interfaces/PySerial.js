const SerialPort = require("serialport/lib");
const { BaseInterface } = require("./Base");

class PySerial extends BaseInterface {
  /**
   *
   * @param {import('../Device').Device} device
   * @param {*} params
   */
  constructor(device, params) {
    super(device, params);
    this.log = device.log.createChild("PySerial >");

    this.port = new SerialPort(
      params.address,
      {
        baudRate: 115200,
        autoOpen: false,
      },
      (err) => {
        this.log.warn("Failed to connect to SerialPort", params.address);
        if (err) this.log.error(err);
        this.log.info("connected to", params.address);
      }
    );

    this.port.on("data", (data) => {
      console.log("received data", data);
    });

    this.port.on("readable", () => {
      console.log("Data", port.read());
    });

    this.port.on("error", (err) => console.log("received error", err));

    // this.connect();
  }

  connect() {
    this.log.info("Connecting...");
    this.port.open((err) => {
      this.port.set({ rts: true }, async (err2) => {
        console.log({ err2 });
        if (err) this.log.error("Could not open device", err);
        else this.log.info("Connected");
        await this.send("\x04");
        // await this.send("help()\r\n");
        // this.port.write("hello\r\n", "utf-8", (err) => {
        //   console.log("sent hello", err);
        // });
      });
    });
  }

  send(msg) {
    var data = new Buffer(msg, "binary");
    return this.sendRaw(data);
  }

  sendRaw(data) {
    return new Promise((resolve, reject) => {
      this.port.write(data, (err) => {
        if (err) reject(err);
        this.port.drain(() => {
          resolve();
        });
      });
    });
  }

  sendPing(cb) {
    const dtr_support = ["darwin"];

    const dtr_supported = dtr_support.indexOf(process.platform) > -1;
    if (process.platform == "win32") {
      // avoid MCU waiting in bootloader on hardware restart by setting both dtr and rts high
      this.port.set({ rts: true });
    }
    // not implemented
    if (dtr_supported) {
      this.port.set({ dtr: true }, function (err) {
        if (cb) {
          cb(err);
          return err ? false : true;
        }
      });
    } else {
      cb();
      return true;
    }
  }
}

module.exports = { PySerial };
