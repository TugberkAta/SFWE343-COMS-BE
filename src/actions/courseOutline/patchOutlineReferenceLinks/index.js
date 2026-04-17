const insertOutlineReferenceLinks = require("~root/actions/courseOutline/createOutlineReferenceLinks/queries/insertOutlineReferenceLinks");
const deleteOutlineReferenceLinks = require("./queries/deleteOutlineReferenceLinks");

const patchOutlineReferenceLinks = async ({ outlineId, referenceLinks }) => {
  await deleteOutlineReferenceLinks({ outlineId });
  for (const link of referenceLinks) {
    await insertOutlineReferenceLinks({
      outlineId,
      linkOrder: link.linkOrder,
      label: link.label,
      url: link.url
    });
  }
};

module.exports = patchOutlineReferenceLinks;
