const insertOutlineReferenceLinks = require("./queries/insertOutlineReferenceLinks");

const createOutlineReferenceLinks = async ({ outlineId, referenceLinks }) => {
  for (const link of referenceLinks) {
    await insertOutlineReferenceLinks({
      outlineId,
      linkOrder: link.linkOrder,
      label: link.label,
      url: link.url
    });
  }
};

module.exports = createOutlineReferenceLinks;
