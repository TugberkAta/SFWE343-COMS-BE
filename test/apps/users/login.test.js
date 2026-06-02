const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#POST login", () => {
  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "ahmet@akinsql.com",
        password: "password"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("accessToken");

    const payload = jwt.decode(res.body.accessToken);
    expect(payload).to.include.keys(
      "userTypeId",
      "typeName",
      "permissionsJson"
    );
    expect(payload.permissionsJson).to.be.an("array");
    expect(payload.permissionsJson).to.include("users.read");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "ahmet@akinsql.com",
        password: "wrongpassword"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(401);
  });
});
