const { getRain } = require("./getRain.js");
const { Etappe } = require("./etappeClass");

class Dag {
    constructor(isoFormatTomorrow, brukerVariabler) {
      this.totalTemp = 0;
      this.isoFormatTomorrow = isoFormatTomorrow;
      this.count = 0;
      this.totalRegn = 0;
      this.totalVind = 0;
      this.brukerVariabler = brukerVariabler;
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

  module.exports = { Dag };