require("dotenv").config();
const { getUserInput } = require("./utils/getUserInput.js");
const { getWeek } = require("./utils/getWeek.js");

const main = async () => {
  const { reply, brukerVariabler } = await getUserInput();

  if (reply.status) {
    getWeek(reply, brukerVariabler);
  } else {
    console.log(reply.message);
  }
};

main();
