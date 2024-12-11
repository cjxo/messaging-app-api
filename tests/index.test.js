const index = require("../routes/index.js");

const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", index);

test("Welcomes user to Messaging API", done => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({ message: "Welcome to Messaging API." })
    .expect(200, done);
});
