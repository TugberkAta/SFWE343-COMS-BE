const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#POST email-auth", () => {
  it("should attempt to send email for registered email", async () => {
    const res = await request(app)
      .post("/email-auth")
      .send({
        email: "bahriyetest1@test.com"
      })
      .set("Accept", "application/json");

    expect([200, 502]).to.include(res.statusCode);
  });

  it("should reject unregistered email", async () => {
    const res = await request(app)
      .post("/email-auth")
      .send({
        email: "notexist@test.com"
      })
      .set("Accept", "application/json");
    expect([400, 502]).to.include(res.statusCode);
  });
});
