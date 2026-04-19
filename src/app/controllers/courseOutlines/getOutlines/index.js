const fetchOutlines = require("~root/actions/courseOutlines/fetchOutlines");
const handleAPIError = require("~root/utils/handleAPIError");

const getOutlines = async (req, res) => {
  try {
    const { outlines } = await fetchOutlines();

    return res.status(200).send({ outlines });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getOutlines;
