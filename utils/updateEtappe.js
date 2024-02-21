const { highLowCheck } = require("./highLowCheck.js");

module.exports = {
  updateEtappe: (etappe, temperatur, regn, vind) => {
    etappe.temp += temperatur;
    etappe.regn += regn;
    etappe.vind += vind;
    etappe.count += 1;

    highLowCheck(etappe, temperatur);
  },
};
