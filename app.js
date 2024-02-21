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
  const latlongCity = "lat=59.9333&lon=10.7166";
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



const test = (data, isoFormatTomorrow, brukerVariabler) => {
  let totalTemp = 0;
  let count = 0;
  let totalVind = 0;

  
  function Etappe(time,temp, low, high, count, regn, vind) {
    this.time = time;    
    this.temp = temp;
    this.low = low;
    this.high = high;
    this.count = count;
    this.regn = regn;
    this.vind = vind;
  }

  //const morgen = new Etappe(0, "Talon TSi", 1993);

  let morgen = 0;
  let morgenLow = 9999;
  let morgenHigh = -9999;
  let morgencount = 0;
  let morgenRegn = 0;
  let morgenVind = 0;

  let formiddag = 0;
  let formiddagLow = 9999;
  let formiddagHigh = -9999;
  let formiddagcount = 0;
  let formiddagRegn = 0;
  let formiddagVind = 0;

  let ettermiddag = 0;
  let ettermiddagLow = 9999;
  let ettermiddagHigh = -9999;
  let ettermiddagcount = 0;
  let ettermiddagRegn = 0;
  let ettermiddagVind = 0;

  let kveld = 0;
  let kveldLow = 9999;
  let kveldHigh = -9999;
  let kveldcount = 0;
  let kveldRegn = 0;
  let kveldVind = 0;

  data.properties.timeseries.map((dataBlock) => {
    if (isoFormatTomorrow.slice(0, 10) == dataBlock.time.slice(0, 10)) {
      const tid = dataBlock.time.slice(11, 13);

      const temperatur = dataBlock.data.instant.details.air_temperature;
      const vind = dataBlock.data.instant.details.wind_speed;
      let regn = 0;

      if (dataBlock.data.next_1_hours) {
        regn = dataBlock.data.next_1_hours.details.precipitation_amount;
      } else if (dataBlock.data.next_6_hours) {
        regn = dataBlock.data.next_6_hours.details.precipitation_amount;
      }

      totalTemp += temperatur;
      count += 1;
      totalVind += vind;

      if (tid < 8) {
        morgen += temperatur;

        morgenRegn += regn;
        morgenVind += vind;

        morgencount += 1;
        if (temperatur < morgenLow) {
          morgenLow = temperatur;
        }
        if (temperatur > morgenHigh) {
          morgenHigh = temperatur;
        }
      } else if (tid < 12) {
        formiddag += temperatur;
        formiddagcount += 1;

        formiddagRegn += regn;

        formiddagVind += vind;

        if (temperatur < formiddagLow) {
          formiddagLow = temperatur;
        }
        if (temperatur > formiddagHigh) {
          formiddagHigh = temperatur;
        }
      } else if (tid < 18) {
        ettermiddag += temperatur;
        ettermiddagcount += 1;

        ettermiddagRegn += regn;

        ettermiddagVind += vind;

        if (temperatur < ettermiddagLow) {
          ettermiddagLow = temperatur;
        }
        if (temperatur > ettermiddagHigh) {
          ettermiddagHigh = temperatur;
        }
      } else {
        kveld += temperatur;
        kveldcount += 1;

        kveldVind += vind;

        kveldRegn += regn;

        if (temperatur < kveldLow) {
          kveldLow = temperatur;
        }
        if (temperatur > kveldHigh) {
          kveldHigh = temperatur;
        }
      }
    }
  });
  const uke = [
    "Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
  ];
  const month = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(isoFormatTomorrow);
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
              (morgenRegn + formiddagRegn + ettermiddagRegn + kveldRegn) * 100
            ) / 100
          }mm regn`
        : ""
    } ${
      brukerVariabler.includes("vind")
        ? `snittvind ${totalVind / count} m/s`
        : ""
    }
    \n`
  );
  console.log(
    `00-08: ${
      brukerVariabler.includes("temperatur")
        ? ` fra ${morgenLow} til ${morgenHigh} grader (snittemperatur ${
            Math.round((morgen / morgencount) * 100) / 100
          } grader) `
        : ""
    } ${
      brukerVariabler.includes("regn")
        ? `${Math.round(morgenRegn * 100) / 100}mm regn`
        : ""
    } ${
      brukerVariabler.includes("vind") ? `${morgenVind / morgencount} m/s` : ""
    }
    \n`
  );
  console.log(
    `08-12: ${
      brukerVariabler.includes("temperatur")
        ? `fra ${formiddagLow} til ${formiddagHigh} grader (snittemperatur ${
            Math.round((formiddag / formiddagcount) * 100) / 100
          } grader) `
        : ""
    } ${
      brukerVariabler.includes("regn")
        ? `${Math.round(formiddagRegn * 100) / 100}mm regn`
        : ""
    } ${
      brukerVariabler.includes("vind")
        ? `${formiddagVind / formiddagcount} m/s`
        : ""
    }
    \n`
  );
  console.log(
    `12-18:  ${
      brukerVariabler.includes("temperatur")
        ? `fra ${ettermiddagLow} til ${ettermiddagHigh} grader (snittemperatur ${
            Math.round((ettermiddag / ettermiddagcount) * 100) / 100
          } grader) `
        : ""
    }${
      brukerVariabler.includes("regn")
        ? `${Math.round(ettermiddagRegn * 100) / 100}mm regn`
        : ""
    } ${
      brukerVariabler.includes("vind")
        ? `${ettermiddagVind / ettermiddagcount} m/s`
        : ""
    }
    \n`
  );
  console.log(
    `18-00: ${
      brukerVariabler.includes("temperatur")
        ? `fra ${kveldLow} til ${kveldHigh} grader (snittemperatur ${
            Math.round((kveld / kveldcount) * 100) / 100
          } grader)  `
        : ""
    }${
      brukerVariabler.includes("regn")
        ? `${Math.round(kveldRegn * 100) / 100}mm regn`
        : ""
    } ${brukerVariabler.includes("vind") ? `${kveldVind / kveldcount} m/s` : ""}
    \n\n\n`
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
      test(weatherdata, isoFormatNextDay, brukerVariabler);
    }
  } else {
    console.log(reply.message);
  }

  readline.close();
};

main();
