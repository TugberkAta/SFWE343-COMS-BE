const express = require("express");

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
  authorise({ roles: ["admin"] }),
  postApproveUser
);

router.get(
  "/users/no-role",
  authentication,
  authorise({ roles: ["admin"] }),
  getUsersWithNoRole
);

router.get(
  "/users/with-role",
  authentication,
  authorise({ roles: ["admin"] }),
  getUsersWithRole
);

module.exports = router;
