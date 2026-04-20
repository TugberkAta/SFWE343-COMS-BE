const fetchPrograms = require("~root/actions/programs/fetchPrograms");
const handleAPIError = require("~root/utils/handleAPIError");

const getPrograms = async (req, res) => {
  try {
    const { programs } = await fetchPrograms();

    return res.status(200).send({ programs });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getPrograms;
