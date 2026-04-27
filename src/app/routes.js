const express = require("express");

const { ENDPOINT_PERMISSIONS } = require("~root/constants/endpointPermissions");
const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/register");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");
const getUserRoles = require("./controllers/users/userRoles");
const healthcheck = require("./platform/healthcheck");
const postEmailAuth = require("./controllers/users/postEmailAuth");
const postApproveUser = require("./controllers/users/approveUser");
const getUsersWithNoRole = require("./controllers/users/getUsersWithNoRole");
const getUsersWithRole = require("./controllers/users/getUsersWithRole");
const { postCourseOutline } = require("./controllers/courseOutline");
const { patchCourseOutline } = require("./controllers/courseOutline/patch");
const {
  postUserType,
  putUserType,
  removeUserType
} = require("./controllers/userTypes");

const router = express.Router();

// USER MANAGEMENT
router.post("/login", postLogin);

router.post("/register", postUser);

router.post("/email-auth", postEmailAuth);

router.put("/edit/user", authentication, putUserDetails);

router.get("/user-roles", getUserRoles);

router.get("/healthcheck", healthcheck);

router.post(
  "/approve-user",
  authentication,
  authorise({ permissions: [ENDPOINT_PERMISSIONS.users.APPROVE] }),
  postApproveUser
);

router.get(
  "/users/no-role",
  authentication,
  authorise({ permissions: [ENDPOINT_PERMISSIONS.users.READ] }),
  getUsersWithNoRole
);

router.get(
  "/users/with-role",
  authentication,
  authorise({ permissions: [ENDPOINT_PERMISSIONS.users.READ] }),
  getUsersWithRole
);

// USER TYPES
router.post("/user-types", authentication, postUserType);

router.put("/user-types/:userTypeId", authentication, putUserType);

router.delete("/user-types/:userTypeId", authentication, removeUserType);

// COURSE OUTLINE
router.post("/course-outline", authentication, postCourseOutline);

router.patch("/course-outline/:outlineId", authentication, patchCourseOutline);

module.exports = router;
