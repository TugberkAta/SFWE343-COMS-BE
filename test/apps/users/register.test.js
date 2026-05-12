const { expect } = require("chai");
const request = require("supertest");
const { submitQuery } = require("~root/lib/database");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");
const postUserSchema = require("~root/app/controllers/users/register/schemas/postUserSchema");

postUserSchema.validate = async () => ({});

safeDescribe("#POST register", () => {
  it("should register a new user successfully", async () => {
    const email = `newuser+${Date.now()}@test.com`;
    const shortcode = `newuser${Date.now()}`;

    await submitQuery`
      INSERT INTO user_email_shortcodes (email, shortcode)
      VALUES (${email}, ${shortcode});
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
  });

  it("should reject registration with invalid shortcode", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "invalid@test.com",
        password: "sifre123",
        shortcode: "INVALID"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(400);
  });
});
