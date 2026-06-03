const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const safeDescribe = require("~test/utils/safeDescribe");

function stubModule(modulePath, mockExport) {
  const resolved = require.resolve(modulePath);
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: mockExport
  };
}

function clearModule(modulePath) {
  const resolved = require.resolve(modulePath);
  delete require.cache[resolved];
}

function buildApp(handler) {
  const authentication = require("~root/app/middlewares/authentication");
  const app = express();
  app.use(express.json());
  app.post("/outlines/:outlineId/submit", authentication, handler);
  return app;
}

function makeToken(userId = 1) {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
}

safeDescribe("#postSubmitOutline", () => {
  let app;

  beforeEach(() => {
    stubModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus",
      async () => {}
    );
    stubModule(
      "~root/actions/outlineApproval/submitOutline/queries/insertApprovalWorkflow",
      async () => ({ insertId: 1 })
    );

    clearModule("~root/actions/outlineApproval/submitOutline");
    clearModule("~root/app/controllers/outlineApproval");

    const {
      postSubmitOutline
    } = require("~root/app/controllers/outlineApproval");
    app = buildApp(postSubmitOutline);
  });

  afterEach(() => {
    clearModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus"
    );
    clearModule(
      "~root/actions/outlineApproval/submitOutline/queries/insertApprovalWorkflow"
    );
    clearModule("~root/actions/outlineApproval/submitOutline");
    clearModule("~root/app/controllers/outlineApproval");
  });

  it("returns 200 and success message when outline is submitted", async () => {
    const res = await request(app)
      .post("/outlines/42/submit")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Outline submitted for review."
    });
  });

  it("returns 401 when no auth token is provided", async () => {
    const res = await request(app)
      .post("/outlines/42/submit")
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(401);
  });

  it("returns 500 when a query throws an error", async () => {
    stubModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus",
      async () => {
        throw new Error("DB error");
      }
    );
    clearModule("~root/actions/outlineApproval/submitOutline");
    clearModule("~root/app/controllers/outlineApproval");

    const {
      postSubmitOutline
    } = require("~root/app/controllers/outlineApproval");
    const errorApp = buildApp(postSubmitOutline);

    const res = await request(errorApp)
      .post("/outlines/42/submit")
      .set("Authorization", `Bearer ${makeToken()}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(500);
  });
});
