var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const public = path.join(__dirname, "public");

var transactionsRouter = require("./routes/transactions");
var authRouter = require("./routes/auth");
var currenciesRouter = require("./routes/currencies");

var app = express();
const port = 8080;

app.use("/", express.static(public));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(path.join(public, "index.html"));
});

app.use(express.static("public"));
app.use("/api", transactionsRouter);
app.use("/api/auth", authRouter);
app.use("/api", currenciesRouter);

app.listen(8080, () => {
  console.log(`Server is running on http://localhost:${8080}`);
});

module.exports = app;
