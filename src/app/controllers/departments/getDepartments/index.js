const fetchDepartments = require("~root/actions/departments/fetchDepartments");
const handleAPIError = require("~root/utils/handleAPIError");

const getDepartments = async (req, res) => {
  try {
    const { departments } = await fetchDepartments();

    return res.status(200).send({ departments });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getDepartments;
