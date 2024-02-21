const { getCityWeatherData } = require("./getCityWeatherData.js");
const { getData } = require("./getData.js");

module.exports = {
  getWeek: async (reply, brukerVariabler) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const weatherdata = await getCityWeatherData(reply.message);

    for (i = 1; i < 8; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const isoFormatNextDay = nextDay.toISOString();
      getData(weatherdata, isoFormatNextDay, brukerVariabler);
    }
  },
};
