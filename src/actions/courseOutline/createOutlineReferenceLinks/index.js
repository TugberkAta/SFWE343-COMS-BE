const insertOutlineReferenceLinks = require("./queries/insertOutlineReferenceLinks");

const createOutlineReferenceLinks = async ({ referenceLinks }) => {
  for (const [index, link] of (referenceLinks || []).entries()) {
    await insertOutlineReferenceLinks({
      linkOrder: link.linkOrder === undefined ? index + 1 : link.linkOrder,
      label: link.label || link.title || "",
      url: link.url
    });
  }
};

module.exports = createOutlineReferenceLinks;
