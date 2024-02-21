const { finnesBy } = require("./finnesBy.js");

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
        resolve(brukerVariabler.replace(/\s/g, "").split(","));
      }
    );
  });
};

module.exports = {
  getUserInput: async () => {
    let byNavn = await cityQuestion();
    let reply = finnesBy(byNavn);

    while (reply.status == false) {
      console.log(reply.message);
      byNavn = await cityQuestion();
      reply = finnesBy(byNavn);
    }

    const brukerVariabler = await variableQuestion();
    readline.close();

    return { reply, brukerVariabler };
  },
};
