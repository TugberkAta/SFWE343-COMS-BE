const insertOutlineContentItems = require("./queries/insertOutlineContentItems");

const createOutlineContentItems = async ({ outlineId, contentItems }) => {
  for (const item of contentItems) {
    await insertOutlineContentItems({
      outlineId,
      contentOrder: item.contentOrder,
      contentText: item.contentText
    });
  }
};

module.exports = createOutlineContentItems;
