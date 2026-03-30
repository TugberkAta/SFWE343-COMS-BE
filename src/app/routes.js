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

module.exports = router;
