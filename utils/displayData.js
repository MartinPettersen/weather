const { uke, month } = require("./calendarData.js");

module.exports = {
  displayData: (dag, brukerVariabler) => {
    const date = new Date(dag.isoFormatTomorrow);

    console.log(
      `${uke[date.getDay()]} ${dag.isoFormatTomorrow.slice(8, 10)}.${
        month[parseInt(dag.isoFormatTomorrow.slice(5, 7)) -1]
      } ${dag.isoFormatTomorrow.slice(0, 4)}  ${
        brukerVariabler.includes("temperatur")
          ? `(snittemperatur ${
              Math.round((dag.totalTemp / dag.count) * 100) / 100
            } grader)`
          : ""
      } : ${
        brukerVariabler.includes("regn")
          ? `${Math.round(dag.totalRegn * 100) / 100}mm regn`
          : ""
      } ${
        brukerVariabler.includes("vind")
          ? `snittvind ${
              Math.round((dag.totalVind / dag.count) * 100) / 100
            } m/s`
          : ""
      }
          \n`
    );

    dag.etapper.map((etappe) => {
      console.log(
        `${etappe.timeStart}-${etappe.timeEnd}: ${
          brukerVariabler.includes("temperatur")
            ? ` fra ${etappe.low} til ${etappe.high} grader (snittemperatur ${
                Math.round((etappe.temp / etappe.count) * 100) / 100
              } grader) `
            : ""
        } ${
          brukerVariabler.includes("regn")
            ? `${Math.round(etappe.regn * 100) / 100}mm regn`
            : ""
        } ${
          brukerVariabler.includes("vind")
            ? `${Math.round((etappe.vind / etappe.count) * 100) / 100} m/s`
            : ""
        }
            \n`
      );
    });
  },
};
