const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#POST login", () => {
  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "bahriyetest1@test.com",
        password: "sifre123"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("accessToken");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "bahriyetest1@test.com",
        password: "wrongpassword"
      })
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(401);
  });
});
