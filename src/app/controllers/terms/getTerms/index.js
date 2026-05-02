const fetchTerms = require("~root/actions/terms/fetchTerms");
const handleAPIError = require("~root/utils/handleAPIError");

const getTerms = async (req, res) => {
  try {
    const { terms } = await fetchTerms();

    return res.status(200).send({ terms });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getTerms;
