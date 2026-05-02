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
const postRejectUser = require("./controllers/users/rejectUser");
const getUsersWithNoRole = require("./controllers/users/getUsersWithNoRole");
const getUsersWithRole = require("./controllers/users/getUsersWithRole");
const { postCourseOutline } = require("./controllers/courseOutline");
const { patchCourseOutline } = require("./controllers/courseOutline/patch");
const getPrograms = require("./controllers/programs/getPrograms");
const getDepartments = require("./controllers/departments/getDepartments");
const getCourses = require("./controllers/courses/getCourses");
const getTerms = require("./controllers/terms/getTerms");
const getOutlines = require("./controllers/courseOutlines/getOutlines");
const getOutlineById = require("./controllers/courseOutlines/getOutlineById");
const getOutlinePdfById = require("./controllers/courseOutlines/getOutlinePdfById");
const getCourseSpecificationPdfById = require("./controllers/courseOutlines/getCourseSpecificationPdfById");
const deleteOutlineById = require("./controllers/courseOutlines/deleteOutlineById");

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
  authorise({ roles: ["Admin"] }),
  postApproveUser
);

router.post(
  "/reject-user",
  authentication,
  authorise({ roles: ["Admin"] }),
  postRejectUser
);

router.get(
  "/users/no-role",
  authentication,
  authorise({ roles: ["Admin"] }),
  getUsersWithNoRole
);

router.get(
  "/users/with-role",
  authentication,
  authorise({ roles: ["Admin"] }),
  getUsersWithRole
);

// COURSE OUTLINE
router.post("/course-outline", authentication, postCourseOutline);

router.patch("/course-outline/:outlineId", authentication, patchCourseOutline);

router.get("/programs", authentication, getPrograms);
router.get("/departments", authentication, getDepartments);
router.get("/courses", authentication, getCourses);
router.get("/terms", authentication, getTerms);
router.get("/outlines", authentication, getOutlines);
router.get("/outlines/:outlineId", authentication, getOutlineById);
router.get("/outlines/:outlineId/pdf", authentication, getOutlinePdfById);
router.get(
  "/outlines/:outlineId/specification-pdf",
  authentication,
  getCourseSpecificationPdfById
);
router.delete("/outlines/:outlineId", authentication, deleteOutlineById);

module.exports = router;
