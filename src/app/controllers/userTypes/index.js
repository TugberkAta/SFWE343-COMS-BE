const createUserType = require("~root/actions/userTypes/createUserType");
const updateUserType = require("~root/actions/userTypes/updateUserType");
const deleteUserType = require("~root/actions/userTypes/deleteUserType");
const fetchUserTypes = require("~root/actions/userTypes/fetchUserTypes");
const handleAPIError = require("~root/utils/handleAPIError");

const getUserTypes = async (req, res) => {
  try {
    const { userTypes } = await fetchUserTypes();

    return res.status(200).send({ userTypes });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

const postUserType = async (req, res) => {
  const { typeName, permissionsJson } = req.body;
  try {
    const { userTypeId } = await createUserType({ typeName, permissionsJson });
    return res.status(201).send({ userTypeId });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

const putUserType = async (req, res) => {
  const { userTypeId } = req.params;
  const { typeName, permissionsJson } = req.body;
  try {
    await updateUserType({ userTypeId, typeName, permissionsJson });
    return res.send({ message: "User type updated successfully." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

const removeUserType = async (req, res) => {
  const { userTypeId } = req.params;
  try {
    await deleteUserType({ userTypeId });
    return res.send({ message: "User type deleted successfully." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = { getUserTypes, postUserType, putUserType, removeUserType };
