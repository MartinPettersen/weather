const { finnesBy } = require("./finnesBy.js");

const readline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});


const userQuestion = (question) => {
  return new Promise((resolve, reject) => {
    readline.question(`${question}`, (reply) => {
      resolve(reply);
    });
  });
}

module.exports = {
  getUserInput: async () => {
    let byNavn = await userQuestion(`Hvilken by ønsker du å vite om? `);

    let reply = finnesBy(byNavn);

    while (reply.status == false) {
      console.log(reply.message);
      byNavn = await userQuestion(`Hvilken by ønsker du å vite om? `);
      reply = finnesBy(byNavn);
    }

    const brukerVariablerInput = await userQuestion(`Hva vil du vite? (regn, temperatur, vind) `);
    const brukerVariabler = brukerVariablerInput.replace(/\s/g, "").split(",")
    readline.close();

    return { reply, brukerVariabler };
  },
};
