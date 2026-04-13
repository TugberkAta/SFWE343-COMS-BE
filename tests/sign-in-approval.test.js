const request = require("supertest");
const app = require("../app");

describe("Sign In Approval API", () => {
  const adminToken = "YOUR_ADMIN_TOKEN_HERE";

  it("GET /users/no-role", async () => {
    const res = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /users/with-role", async () => {
    const res = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /approve-user", async () => {
    const res = await request(app)
      .post("/approve-user")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        userId: "1",
        user_role_id: "2",
        approved_status: true
      });

    expect(res.statusCode).toBe(200);
  });

  it("Auth Restriction Check", async () => {
    const res = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer invalid_token`);

    expect(res.statusCode).not.toBe(200);
  });
});
