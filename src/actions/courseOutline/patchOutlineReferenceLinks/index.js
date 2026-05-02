const insertOutlineReferenceLinks = require("~root/actions/courseOutline/createOutlineReferenceLinks/queries/insertOutlineReferenceLinks");
const deleteOutlineReferenceLinks = require("./queries/deleteOutlineReferenceLinks");

const patchOutlineReferenceLinks = async ({ referenceLinks }) => {
  if (referenceLinks === undefined) {
    return;
  }

  await deleteOutlineReferenceLinks();

  for (const [index, link] of referenceLinks.entries()) {
    await insertOutlineReferenceLinks({
      linkOrder: link.linkOrder === undefined ? index + 1 : link.linkOrder,
      label: link.label || link.title || "",
      url: link.url
    });
  }
};

module.exports = patchOutlineReferenceLinks;
