const deleteOutlineContentItems = require("./queries/deleteOutlineContentItems");
const insertOutlineContentItems = require("~root/actions/courseOutline/createOutlineContentItems/queries/insertOutlineContentItems");

const patchOutlineContentItems = async ({ outlineId, contentItems }) => {
  await deleteOutlineContentItems({ outlineId });
  for (const item of contentItems) {
    await insertOutlineContentItems({
      outlineId,
      contentOrder: item.contentOrder,
      contentText: item.contentText
    });
  }
};

module.exports = patchOutlineContentItems;
