const { displayData } = require("./displayData.js");
const { updateDag } = require("./updateDag.js");

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
}

module.exports = {
  getData: (data, isoFormatTomorrow, brukerVariabler) => {
    const dag = new Dag(isoFormatTomorrow);

    data.properties.timeseries.map((dataBlock) => {
      if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
        updateDag(dataBlock, dag);
      }
    });

    displayData(dag, brukerVariabler);
  },
};
