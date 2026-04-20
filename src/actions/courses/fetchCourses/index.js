const selectCourses = require("./queries/selectCourses");

const fetchCourses = async () => {
  const courses = await selectCourses();

  return { courses };
};

module.exports = fetchCourses;
