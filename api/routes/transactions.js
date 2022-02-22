const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const filePath = "../db/transactions.json";

/* GET transactions */
router.get("/transactions", (req, res) => {
  let jsonData = readFromFile(filePath);
  let transactions = jsonData.transactions;
  //make entries appear newest first
  transactions = transactions.reverse();
  res.status(200).json(transactions);
});

/* POST transactions */
router.post("/transactions", (req, res) => {
  let jsonData = readFromFile(filePath);
  let transactions = jsonData.transactions;

  if (
    req.body.username &&
    req.body.ccy_pair &&
    req.body.rate &&
    req.body.action &&
    req.body.notional &&
    req.body.tenor &&
    req.body.trans_date &&
    req.body.trans_hour
  ) {
    let transaction = {
      id: uuid.v4(),
      username: req.body.username,
      ccy_pair: req.body.ccy_pair,
      rate: req.body.rate,
      action: req.body.action,
      notional: req.body.notional,
      tenor: req.body.tenor,
      trans_date: req.body.trans_date,
      trans_hour: req.body.trans_hour,
    };
    let isValid = validateTransaction(transaction);
    if (isValid) {
      transactions.push(transaction);
      writeToFile(jsonData, filePath, res);
    } else {
      res.status(400).send({ message: "Not valid fields" });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
});

function validateTransaction(transaction) {
  const regexUsername = /^[a-zA-Z ,.'-]{3,20}$/;
  const regexCcyPair = /[A-Z]{3}\/[A-Z]{3}/;
  const tenorOptions = ["Spot", "1M", "3M"];
  const actionOptions = ["sell", "buy"];
  const rate = Number(transaction.rate);
  const notional = Number(transaction.notional);
  if (!regexUsername.test(transaction.username)) return false;
  else if (!regexCcyPair.test(transaction.ccy_pair)) return false;
  else if (actionOptions.indexOf(transaction.action) === -1) return false;
  else if (tenorOptions.indexOf(transaction.tenor) === -1) return false;
  else if (isNaN(rate)) return false;
  else if (isNaN(notional)) return false;
  else if (notional < 1) return false;
  else {
    let ccyPair = transaction.ccy_pair.split("/");
    //get the list of available currencies
    let jsonData = readFromFile("../db/currencies.json");
    let currencies = jsonData.currencies_available;

    if (!currencies.includes(ccyPair[0]) || !currencies.includes(ccyPair[1])) {
      return false;
    }
    return true;
  }
}
// write data to a json file
function writeToFile(content, relPath, res) {
  fs.writeFile(
    path.resolve(__dirname, relPath),
    JSON.stringify(content, null, 2),
    function (err) {
      if (err) {
        return err;
      } else {
        res
          .status(200)
          .send({ message: "Transaction registered successfully" });
      }
    }
  );
}
// return the data from a json file
function readFromFile(relPath) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, relPath));
  let data = JSON.parse(rawdata);
  return data;
}

module.exports = router;
