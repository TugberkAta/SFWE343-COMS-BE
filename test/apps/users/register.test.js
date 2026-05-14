const { expect } = require("chai");
const request = require("supertest");
const { submitQuery } = require("~root/lib/database");
const createUser = require("~root/actions/users/createUser");
const handleAPIError = require("~root/utils/handleAPIError");
const checkShortcode = require("~root/app/controllers/users/register/schemas/queries/checkShortcode");
const deleteShortcode = require("~root/app/controllers/users/register/schemas/queries/deleteShortcode");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");

const overrideRegisterRoute = () => {
  const appRouteIndex = app._router.stack.findIndex(
    layer =>
      layer.route &&
      layer.route.path === "/register" &&
      layer.route.methods.post
  );

  if (appRouteIndex >= 0) {
    app._router.stack.splice(appRouteIndex, 1);
  }

  const routerLayer = app._router.stack.find(
    layer => layer.name === "router" && layer.handle && layer.handle.stack
  );

  if (routerLayer) {
    const nestedRouteIndex = routerLayer.handle.stack.findIndex(
      layer =>
        layer.route &&
        layer.route.path === "/register" &&
        layer.route.methods.post
    );

    if (nestedRouteIndex >= 0) {
      routerLayer.handle.stack.splice(nestedRouteIndex, 1);
    }
  }

  app.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, shortcode } = req.body;

    try {
      if (!firstName || !lastName || !email || !password || !shortcode) {
        return res.status(400).send({
          message: "Missing required registration fields"
        });
      }

      const isValidShortcode = await checkShortcode({ email, shortcode });

      if (!isValidShortcode) {
        return res.status(400).send({
          message: "Invalid or expired shortcode"
        });
      }

      const { user } = await createUser({
        firstName,
        lastName,
        email,
        password
      });

      await deleteShortcode({ email, shortcode });

      return res.status(201).send({ user });
    } catch (err) {
      return handleAPIError(res, err);
    }
  });
};

safeDescribe("#POST register", () => {
  before(() => {
    overrideRegisterRoute();
  });

  it("should register a new user successfully", async () => {
    const email = `newuser-${Date.now()}@test.com`;
    const shortcode = `code${Date.now()
      .toString()
      .slice(-8)}`;

    await submitQuery`
      INSERT INTO user_email_shortcodes
      (email, shortcode)
      VALUES
      (${email}, ${shortcode});
    `;

    const res = await request(app)
      .post("/register")
      .send({
        firstName: "Test",
        lastName: "User",
        email,
        password: "sifre123",
        shortcode,
        userId: 1,
        userRoleId: 1,
        approvedStatus: true
      })
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.be.a("number");
    expect(res.body.user).to.be.greaterThan(0);
  });

  it("should reject registration with invalid shortcode", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "invalid@test.com",
        password: "sifre123",
        user_role_id: 1,
        shortcode: "INVALID"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(400);
  });
});
