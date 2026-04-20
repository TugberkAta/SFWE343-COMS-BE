const deleteOutlineByIdQuery = require("./queries/deleteOutlineById");

const deleteOutlineById = async ({ outlineId }) => {
  const result = await deleteOutlineByIdQuery({ outlineId });

  return { deleted: result.affectedRows > 0 };
};

module.exports = deleteOutlineById;
