const insertOutlineContentItems = require("./queries/insertOutlineContentItems");

const createOutlineContentItems = async ({ outlineId, contentItems }) => {
  for (const [index, item] of (contentItems || []).entries()) {
    await insertOutlineContentItems({
      outlineId,
      contentOrder:
        item.contentOrder === undefined ? index + 1 : item.contentOrder,
      contentText: item.contentText || item.description || ""
    });
  }
};

module.exports = createOutlineContentItems;
