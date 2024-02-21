const { updateEtappe } = require("./updateEtappe.js");
const { getRain } = require("./getRain.js");

module.exports = {
  updateDag: (dataBlock, dag) => {
    const tid = dataBlock.time.slice(11, 13);
    const temperatur = dataBlock.data.instant.details.air_temperature;
    const vind = dataBlock.data.instant.details.wind_speed;
    const regn = getRain(dataBlock.data);

    dag.totalTemp += temperatur;
    dag.count += 1;
    dag.totalVind += vind;
    dag.totalRegn += regn;

    dag.etapper.map((etappe) => {
      if (tid >= etappe.timeStart && tid < etappe.timeEnd) {
        updateEtappe(etappe, temperatur, regn, vind);
      }
    });
  },
};
