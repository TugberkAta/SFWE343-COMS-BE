const insertOutlineContentItems = require("~root/actions/courseOutline/createOutlineContentItems/queries/insertOutlineContentItems");
const deleteOutlineContentItems = require("./queries/deleteOutlineContentItems");

const patchOutlineContentItems = async ({ outlineId, contentItems }) => {
  if (contentItems === undefined) {
    return;
  }

  await deleteOutlineContentItems({ outlineId });
  for (const [index, item] of contentItems.entries()) {
    await insertOutlineContentItems({
      outlineId,
      contentOrder:
        item.contentOrder === undefined ? index + 1 : item.contentOrder,
      contentText: item.contentText || item.description || ""
    });
  }
};

module.exports = patchOutlineContentItems;
