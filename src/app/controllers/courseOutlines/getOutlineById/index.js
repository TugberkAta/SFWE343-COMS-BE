const fetchOutlineById = require("~root/actions/courseOutlines/fetchOutlineById");
const handleAPIError = require("~root/utils/handleAPIError");
const getOutlineByIdSchema = require("./schemas/getOutlineByIdSchema");

const getOutlineById = async (req, res) => {
  const { outlineId } = req.params;

  try {
    await getOutlineByIdSchema.validate(
      { outlineId: Number(outlineId) },
      { abortEarly: false }
    );

    const outline = await fetchOutlineById({ outlineId: Number(outlineId) });

    if (!outline) {
      return res.status(404).send({ message: "Outline not found." });
    }

    return res.status(200).send({ outline });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getOutlineById;
