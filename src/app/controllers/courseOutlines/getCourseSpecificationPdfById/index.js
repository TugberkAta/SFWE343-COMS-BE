const fetchOutlineById = require("~root/actions/courseOutlines/fetchOutlineById");
const handleAPIError = require("~root/utils/handleAPIError");
const buildCourseSpecificationPdfBuffer = require("~root/utils/outlinePdf/buildCourseSpecificationPdfBuffer");
const getOutlineByIdSchema = require("../getOutlineById/schemas/getOutlineByIdSchema");

const createFileName = outline => {
  const semester = String(outline.semester || "").toLowerCase();
  const academicYear = String(outline.academicYear || "").replace("/", "-");
  return `${outline.courseCode}-${academicYear}-${semester}-specification.pdf`;
};

const getCourseSpecificationPdfById = async (req, res) => {
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

    const pdfBuffer = await buildCourseSpecificationPdfBuffer(outline);
    const fileName = createFileName(outline);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getCourseSpecificationPdfById;
