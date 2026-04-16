const selectDepartments = require("./queries/selectDepartments");

const fetchDepartments = async () => {
  const departments = await selectDepartments();

  return { departments };
};

module.exports = fetchDepartments;
