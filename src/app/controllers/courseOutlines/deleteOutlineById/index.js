const deleteOutlineById = require("~root/actions/courseOutlines/deleteOutlineById");
const handleAPIError = require("~root/utils/handleAPIError");
const deleteOutlineByIdSchema = require("./schemas/deleteOutlineByIdSchema");

const deleteOutline = async (req, res) => {
  const { outlineId } = req.params;

  try {
    await deleteOutlineByIdSchema.validate(
      { outlineId: Number(outlineId) },
      { abortEarly: false }
    );

    const { deleted } = await deleteOutlineById({
      outlineId: Number(outlineId)
    });

    if (!deleted) {
      return res.status(404).send({ message: "Outline not found." });
    }

    return res.status(204).send();
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = deleteOutline;
