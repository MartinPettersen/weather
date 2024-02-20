console.log("hei");

require("dotenv").config();
const fetch = require("node-fetch");

const byListe = [
  { city: "Oslo", location: "lat=59.9333&lon=10.7166" },
  { city: "Trondheim", location: "lat=60.3894&lon=5.33" },
  { city: "Bergen", location: "lat=63.4308&lon=10.4034" },
  { city: "Tromsø", location: "lat=69.6827&lon=18.9427" },
  { city: "Vardø", location: "lat=70.3705&lon=31.0241" },
];

const getCityWeatherData = async (cityLocation) => {
  console.log(":::: " + cityLocation);
  const latlongCity = "lat=59.9333&lon=10.7166";
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?${cityLocation}`;

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
  const returnMessage = {
    status: false,
    message: `Feil: Kan ikke finne en by med navnet "${by}".`,
  };

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

/*

readline.question(`Hvilken by ønsker du å vite om? `, (byNavn) => {
  
    console.log(`Henter informasjon om ${byNavn}`);
  const reply = finnesBy(byNavn);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let isoFormatTomorrow = tomorrow.toISOString();

  console.log(tomorrow);
  if (reply.status) {
    console.log(
      `Temperator for ${byNavn}  ${isoFormatTomorrow.slice(
        5,
        7
      )}.${isoFormatTomorrow.slice(8, 10)}.${isoFormatTomorrow.slice(0, 4)}:`
    );
    getCityWeatherData(reply.message)
      .then((data) => {
        console.log("");
        data.properties.timeseries.map((dataBlock) => {
          console.log(dataBlock.time)
         if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
            const tid = dataBlock.time.slice(11, 16);
            const temperatur = dataBlock.data.instant.details.air_temperature;
            // console.log(`Kl ${tid} ${temperatur} grader`);
          }
        });
        // console.log(data.properties.timeseries[0].time);
        // console.log(data.properties.timeseries[0].data.instant.details.air_temperature);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log(reply.message);
  }

  readline.close();
});
*/

const cityQuestion = () => {
  return new Promise((resolve, reject) => {
    readline.question(`Hvilken by ønsker du å vite om? `, (byNavn) => {
      // console.log(byNavn)
      resolve(byNavn);
      // return byNavn
    });
  });
};



const main = async () => {
  let byNavn = await cityQuestion();
  let reply = finnesBy(byNavn);
  while(reply.status == false){
    console.log(reply.message);
    byNavn = await cityQuestion();
    reply = finnesBy(byNavn);
  }


  // --------------


  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let isoFormatTomorrow = tomorrow.toISOString();

  console.log(tomorrow);
  if (reply.status) {
    console.log(
      `Temperator for ${byNavn}  ${isoFormatTomorrow.slice(
        5,
        7
      )}.${isoFormatTomorrow.slice(8, 10)}.${isoFormatTomorrow.slice(0, 4)}:`
    );
    getCityWeatherData(reply.message)
      .then((data) => {
        console.log("");
        data.properties.timeseries.map((dataBlock) => {
          // console.log(dataBlock.time)
         if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
            const tid = dataBlock.time.slice(11, 16);
            const temperatur = dataBlock.data.instant.details.air_temperature;
            console.log(`Kl ${tid} ${temperatur} grader`);
          }
        });
        // console.log(data.properties.timeseries[0].time);
        // console.log(data.properties.timeseries[0].data.instant.details.air_temperature);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log(reply.message);
  }

  // -----------

  console.log(reply);
  readline.close();
};

main();
