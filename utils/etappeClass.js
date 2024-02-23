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

module.exports = { Etappe };