const selectTerms = require("./queries/selectTerms");

const fetchTerms = async () => {
  const terms = await selectTerms();

  return { terms };
};

module.exports = fetchTerms;
