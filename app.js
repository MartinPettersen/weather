require("dotenv").config();
const fetch = require("node-fetch");
const { highLowCheck } = require('./helper-functions/highLowCheck.js');
const { byListe } = require('./helper-data/byliste.js');
const { uke, month } = require('./helper-data/calendarData.js');


const getCityWeatherData = async (cityLocation) => {
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

const cityQuestion = () => {
  return new Promise((resolve, reject) => {
    readline.question(`Hvilken by ønsker du å vite om? `, (byNavn) => {
      resolve(byNavn);
    });
  });
};



const variableQuestion = () => {
  return new Promise((resolve, reject) => {
    readline.question(
      `Hva vil du vite? (regn, temperatur, vind) `,
      (brukerVariabler) => {
        resolve(brukerVariabler);
      }
    );
  });
};

const displayData = (
  date,
  etapper,
  totalTemp,
  count,
  isoFormatTomorrow,
  brukerVariabler,
  uke,
  month,
  totalVind
) => {
  console.log(
    `${uke[date.getDay()]} ${isoFormatTomorrow.slice(8, 10)}.${
      month[parseInt(isoFormatTomorrow.slice(5, 7))]
    } ${isoFormatTomorrow.slice(0, 4)}  ${
      brukerVariabler.includes("temperatur")
        ? `(snittemperatur ${
            Math.round((totalTemp / count) * 100) / 100
          } grader)`
        : ""
    } : ${
      brukerVariabler.includes("regn")
        ? `${
            Math.round(
              (etapper[0].regn +
                etapper[1].regn +
                etapper[2].regn +
                etapper[3].regn) *
                100
            ) / 100
          }mm regn`
        : ""
    } ${
      brukerVariabler.includes("vind")
        ? `snittvind ${Math.round((totalVind / count) * 100) / 100} m/s`
        : ""
    }
    \n`
  );

  etapper.map((etappe) => {
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
};

function Etappe(timeStart, timeEnd) {
  this.timeStart = timeStart;
  this.timeEnd = timeEnd;
  this.temp = 0;
  this.low = 9999;
  this.high = -9999;
  this.count = 0;
  this.regn = 0;
  this.vind = 0;
}

const getRain = (data) => {
  if (data.next_1_hours) {
    return data.next_1_hours.details.precipitation_amount;
  } else if (data.next_6_hours) {
    return data.next_6_hours.details.precipitation_amount;
  }
  return 0;
};

const updateEtappe = (etappe, temperatur, regn, vind) => {
  etappe.temp += temperatur;
  etappe.regn += regn;
  etappe.vind += vind;
  etappe.count += 1;

  highLowCheck(etappe, temperatur);
}

const getData = (data, isoFormatTomorrow, brukerVariabler) => {
  let totalTemp = 0;
  let count = 0;
  let totalVind = 0;

  const morgen = new Etappe(0, 8);
  const formiddag = new Etappe(8, 12);
  const ettermiddag = new Etappe(12, 18);
  const kveld = new Etappe(18, 24);

  const etapper = [morgen, formiddag, ettermiddag, kveld];

  data.properties.timeseries.map((dataBlock) => {
    if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
      const tid = dataBlock.time.slice(11, 13);
      const temperatur = dataBlock.data.instant.details.air_temperature;
      const vind = dataBlock.data.instant.details.wind_speed;
      const regn = getRain(dataBlock.data);

      totalTemp += temperatur;
      count += 1;
      totalVind += vind;

      etapper.map((etappe) => {
        if (tid >= etappe.timeStart && tid < etappe.timeEnd) {
          updateEtappe(etappe, temperatur, regn, vind)
        }
      });
    }
  });

  const date = new Date(isoFormatTomorrow);

  displayData(
    date,
    etapper,
    totalTemp,
    count,
    isoFormatTomorrow,
    brukerVariabler,
    uke,
    month,
    totalVind
  );
};

const main = async () => {
  let byNavn = await cityQuestion();
  let reply = finnesBy(byNavn);

  while (reply.status == false) {
    console.log(reply.message);
    byNavn = await cityQuestion();
    reply = finnesBy(byNavn);
  }

  let brukerVariabler = await variableQuestion();
  brukerVariabler = brukerVariabler.replace(/\s/g, "").split(",");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (reply.status) {
    const weatherdata = await getCityWeatherData(reply.message);

    for (i = 1; i < 8; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const isoFormatNextDay = nextDay.toISOString();
      getData(weatherdata, isoFormatNextDay, brukerVariabler);
    }
  } else {
    console.log(reply.message);
  }

  readline.close();
};

main();
