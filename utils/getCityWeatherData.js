const fetch = require("node-fetch");

module.exports = {
  getCityWeatherData: async (cityLocation) => {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?${cityLocation}`;

    const options = {
      headers: {
        "User-Agent": `weather app practice, email: ${process.env.CONTACT_INFO}`,
      },
    };
    try {
      const data = await fetch(url, options);
      const weatherData = await data.json();
      return weatherData;
    } catch (error) {
      console.log("Kunne ikke finne by");
      throw error;
    }
  },
};
