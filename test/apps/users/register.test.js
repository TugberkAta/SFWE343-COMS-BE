const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#POST register", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "newuser100@test.com",
        password: "sifre123",
        user_role_id: 1,
        shortcode: "new2"
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
        user_role_id: 1,
        shortcode: "INVALID"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(400);
  });
});
