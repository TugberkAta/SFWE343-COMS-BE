const selectOutlines = require("./queries/selectOutlines");

const fetchOutlines = async () => {
  const outlines = await selectOutlines();

  return { outlines };
};

module.exports = fetchOutlines;
