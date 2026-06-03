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
  app.post("/outlines/:outlineId/resubmit", authentication, handler);
  return app;
}

function makeToken(userId = 1) {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
}

safeDescribe("#postResubmitOutline", () => {
  let app;

  beforeEach(() => {
    stubModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus",
      async () => {}
    );
    stubModule(
      "~root/actions/outlineApproval/resubmitOutline/queries/updateWorkflowResubmit",
      async () => {}
    );
    stubModule(
      "~root/actions/outlineApproval/resubmitOutline/queries/insertResubmission",
      async () => {}
    );

    clearModule("~root/actions/outlineApproval/resubmitOutline");
    clearModule("~root/app/controllers/outlineApproval");

    const {
      postResubmitOutline
    } = require("~root/app/controllers/outlineApproval");
    app = buildApp(postResubmitOutline);
  });

  afterEach(() => {
    clearModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus"
    );
    clearModule(
      "~root/actions/outlineApproval/resubmitOutline/queries/updateWorkflowResubmit"
    );
    clearModule(
      "~root/actions/outlineApproval/resubmitOutline/queries/insertResubmission"
    );
    clearModule("~root/actions/outlineApproval/resubmitOutline");
    clearModule("~root/app/controllers/outlineApproval");
  });

  it("returns 200 and success message when outline is resubmitted", async () => {
    const res = await request(app)
      .post("/outlines/15/resubmit")
      .set("Authorization", `Bearer ${makeToken(3)}`)
      .set("Accept", "application/json")
      .send({ submissionNote: "Fixed all issues." });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Outline resubmitted for review."
    });
  });

  it("returns 200 when submissionNote is not provided", async () => {
    const res = await request(app)
      .post("/outlines/15/resubmit")
      .set("Authorization", `Bearer ${makeToken(3)}`)
      .set("Accept", "application/json")
      .send({});

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Outline resubmitted for review."
    });
  });

  it("returns 401 when no auth token is provided", async () => {
    const res = await request(app)
      .post("/outlines/15/resubmit")
      .set("Accept", "application/json")
      .send({ submissionNote: "Fixed all issues." });

    expect(res.statusCode).to.equal(401);
  });

  it("returns 500 when insertResubmission throws an error", async () => {
    stubModule(
      "~root/actions/outlineApproval/resubmitOutline/queries/insertResubmission",
      async () => {
        throw new Error("DB error");
      }
    );
    clearModule("~root/actions/outlineApproval/resubmitOutline");
    clearModule("~root/app/controllers/outlineApproval");

    const {
      postResubmitOutline
    } = require("~root/app/controllers/outlineApproval");
    const errorApp = buildApp(postResubmitOutline);

    const res = await request(errorApp)
      .post("/outlines/15/resubmit")
      .set("Authorization", `Bearer ${makeToken(3)}`)
      .set("Accept", "application/json")
      .send({ submissionNote: "Fixed." });

    expect(res.statusCode).to.equal(500);
  });
});
