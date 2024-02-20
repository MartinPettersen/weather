console.log("hei");

require('dotenv').config()
const fetch = require("node-fetch");

const byListe = [
  { city: "Oslo", location: "lat=59.9333&lon=10.7166" },
  { city: "Bergen", location: "lat=60.3894&lon=5.33" },
  { city: "Bergen", location: "lat=63.4308&lon=10.4034" },
  { city: "Tromsø", location: "lat=69.6827&lon=18.9427" },
  { city: "Vardø", location: "lat=70.3705&lon=31.0241" },
];

const getCityWeatherData = async (cityLocation) => {
  const latlongCity = "lat=59.9333&lon=10.7166";
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?${latlongCity}`;

  const options = {
    headers: {
      "User-Agent": `weather app practice, email: ${process.env.CONTACT_INFO}`,
    },
  };
  try {
    const data = await fetch(url, options);
    // console.log(data)
    const weatherData = await data.json();
    // console.log(weatherData);

    return weatherData;
  } catch (error) {
    console.log("Kunne ikke finne by");
    throw error;
  }
};

const finnesBy = (by) => {
  const returnMessage = { status: false, message: "Vi kjenner ikke byen" };

  byListe.map((byData) => {
    if (byData.city.toLowerCase() == by.toLowerCase()) {
      returnMessage.status = true;
      returnMessage.message = byData.location;
    }
  });
  return returnMessage;
};

const readline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question(`Hvilken by ønsker du å vite om? `, (byNavn) => {
  console.log(`Henter informasjon om ${byNavn}`);
  const reply = finnesBy(byNavn);
  // console.log(reply.message);

  const today = new Date();
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() +1)
  let isoFormatToday = today.toISOString();
  let isoFormatTomorrow = tomorrow.toISOString();

  /*
    { time: '2024-02-21T06:00:00Z', data: [Object] },
    { time: '2024-02-21T07:00:00Z', data: [Object] },
    { time: '2024-02-21T08:00:00Z', data: [Object] },
    { time: '2024-02-21T09:00:00Z', data: [Object] },
    { time: '2024-02-21T10:00:00Z', data: [Object] },
    { time: '2024-02-21T11:00:00Z', data: [Object] },
    { time: '2024-02-21T12:00:00Z', data: [Object] },

*/
  // console.log(isoFormatToday);
  // console.log(isoFormatToday.slice(0, 13));
  // console.log(isoFormatTomorrow);
  console.log(isoFormatTomorrow.slice(0, 10));
  if (reply) {
    getCityWeatherData(byNavn)
      .then((data) => {
        console.log("------")
        data.properties.timeseries.map((dataBlock) => {
            console.log(dataBlock.time);
            console.log(dataBlock.data.instant.details.air_temperature); 
        })
        // console.log(data.properties.timeseries[0].time);
        // console.log(data.properties.timeseries[0].data.instant.details.air_temperature);

      })
      .catch((error) => {
        console.error(error);
      });
  } else {
  }

  readline.close();
});
