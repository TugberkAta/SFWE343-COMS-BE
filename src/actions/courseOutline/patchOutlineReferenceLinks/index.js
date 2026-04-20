const insertOutlineReferenceLinks = require("~root/actions/courseOutline/createOutlineReferenceLinks/queries/insertOutlineReferenceLinks");
const deleteOutlineReferenceLinks = require("./queries/deleteOutlineReferenceLinks");

const patchOutlineReferenceLinks = async ({ outlineId, referenceLinks }) => {
  if (referenceLinks === undefined) {
    return;
  }

  await deleteOutlineReferenceLinks({ outlineId });

  for (const [index, link] of referenceLinks.entries()) {
    await insertOutlineReferenceLinks({
      outlineId,
      linkOrder: link.linkOrder === undefined ? index + 1 : link.linkOrder,
      label: link.label || link.title || "",
      url: link.url
    });
  }
};

module.exports = patchOutlineReferenceLinks;
