module.exports = {
  highLowCheck: (etappe, temperatur) => {
    if (temperatur < etappe.low) {
      etappe.low = temperatur;
    }
    if (temperatur > etappe.high) {
      etappe.high = temperatur;
    }
  },
};
