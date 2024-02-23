const { displayData } = require("./displayData.js");
const { getRain } = require("./getRain.js");

class Etappe {
  constructor(timeStart, timeEnd) {
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.temp = 0;
    this.low = 9999;
    this.high = -9999;
    this.count = 0;
    this.regn = 0;
    this.vind = 0;
  }

  highLowCheck( temperatur) {
    if (temperatur < this.low) {
      this.low = temperatur;
    }
    if (temperatur > this.high) {
      this.high = temperatur;
    }
  }

  updateEtappe(temperatur, regn, vind) {
    this.temp += temperatur;
    this.regn += regn;
    this.vind += vind;
    this.count += 1;

    this.highLowCheck(temperatur);
  }
}

class Dag {
  constructor(isoFormatTomorrow) {
    this.totalTemp = 0;
    this.isoFormatTomorrow = isoFormatTomorrow;
    this.count = 0;
    this.totalRegn = 0;
    this.totalVind = 0;
    this.etapper = [
      new Etappe(0, 8),
      new Etappe(8, 12),
      new Etappe(12, 18),
      new Etappe(18, 24),
    ];
  }
  updateDag (dataBlock) {
    const tid = dataBlock.time.slice(11, 13);
    const temperatur = dataBlock.data.instant.details.air_temperature;
    const vind = dataBlock.data.instant.details.wind_speed;
    const regn = getRain(dataBlock.data);

    this.totalTemp += temperatur;
    this.count += 1;
    this.totalVind += vind;
    this.totalRegn += regn;

    this.etapper.map((etappe) => {
      if (tid >= etappe.timeStart && tid < etappe.timeEnd) {
        etappe.updateEtappe(temperatur, regn, vind);
      }
    });
  }
}

module.exports = {
  getData: (data, isoFormatTomorrow, brukerVariabler) => {
    const dag = new Dag(isoFormatTomorrow);

    data.properties.timeseries.map((dataBlock) => {
      if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
        dag.updateDag(dataBlock);
      }
    });

    displayData(dag, brukerVariabler);
  },
};
