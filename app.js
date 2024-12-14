const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const index = require("./routes/index.js");
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],

  // https://web.dev/articles/cross-origin-resource-sharing
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  // "... tells browsers whether the server allows credentials to be included in cross-origin HTTP requests.",
  // "... Credentials include cookies, Transport Layer Security (TLS) client certificates, or authentication headers
  // containing a username and password. By default, these credentials are not sent in cross-origin requests, and doing
  // so can make a site vulnerable to Cross-Site Request Forgery (CSRF) attacks."
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", index);
app.use("/auth/", auth);
app.use("/user/", user);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      message: "Internal Server Error: " + err.stack
    })
});

app.listen(3000, () => console.log("Server Listening @ port 3000"));
