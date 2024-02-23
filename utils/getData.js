const { displayData } = require("./displayData.js");
const { Dag } = require("./dagClass");

module.exports = {
  getData: (data, isoFormatTomorrow, brukerVariabler) => {
    const dag = new Dag(isoFormatTomorrow, brukerVariabler);

    data.properties.timeseries.map((dataBlock) => {
      if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
        dag.updateDag(dataBlock);
      }
    });

    displayData(dag, brukerVariabler);
  },
};
