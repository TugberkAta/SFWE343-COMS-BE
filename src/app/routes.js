const express = require("express");

const { ADMIN } = require("~root/constants/userRoles");
const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/register");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");
const getUserRoles = require("./controllers/users/userRoles");
const healthcheck = require("./platform/healthcheck");

const router = express.Router();

// USER MANAGEMENT
router.post("/login", postLogin);

// test
// test 2

router.post(
  "/register",
  authentication,
  authorise({ roles: [ADMIN] }),
  postUser
);

router.put("/edit/user", authentication, putUserDetails);

router.get("/user-roles", getUserRoles);

router.get("/healthcheck", healthcheck);

module.exports = router;
