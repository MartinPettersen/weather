const { byListe } = require("./byliste.js");

module.exports = {
  finnesBy: (by) => {
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
  },
};
