const request = require("supertest");
const express = require("express");
const app = require("../app");
const config = require("config");
const supertest = require("supertest");

const mockRequest = (sessionData) => {
  return {
    header: {
      authorization: `Bearer ${config.get("secret")}`
    },
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Post Endpoints", () => {

  it("Get Support List , It should respond with a 200 status", (done) => {
    request(app)
      .get("/support/get-support-team")
      .set({
        authorization: `Bearer ${config.get("secret")}`
      })
      .expect(200, done);
  });

  it("Get Support List , It should respond with a 401 status", (done) => {
    request(app).get("/support/get-support-team").expect(401, done);
  });

  it("Get Support QA , It should respond with a 200 status", (done) => {
    request(app)
      .get("/support/get-support-qa")
      .set({
        authorization: `Bearer ${config.get("secret")}`
      })
      .expect(200, done);
  });

  it("Get Support QA , It should respond with a 401 status", (done) => {
    request(app).get("/support/get-support-team").expect(401, done);
  });

  it("responds with json", function (done) {
    request(app)
      .post("/support/login")
      .send({
        id: 12345001,
        password: "123456"
      })
      .set({
        authorization: `Bearer ${config.get("secret")}`
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});