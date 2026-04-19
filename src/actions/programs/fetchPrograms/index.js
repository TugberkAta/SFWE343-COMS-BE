const selectPrograms = require("./queries/selectPrograms");

const fetchPrograms = async () => {
  const programs = await selectPrograms();

  return { programs };
};

module.exports = fetchPrograms;
