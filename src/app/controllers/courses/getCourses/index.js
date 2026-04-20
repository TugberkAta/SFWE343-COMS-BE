const fetchCourses = require("~root/actions/courses/fetchCourses");
const handleAPIError = require("~root/utils/handleAPIError");

const getCourses = async (req, res) => {
  try {
    const { courses } = await fetchCourses();

    return res.status(200).send({ courses });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getCourses;
