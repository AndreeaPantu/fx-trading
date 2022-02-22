var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");

//let responses = [];

/* GET all currencies available in the app */
router.get("/currencies", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesAvailable = fileContents.currencies_available;
  res.status(200).json(currenciesAvailable);
});

/* GET all currency rates with pairings */
router.get("/currencies/rates", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  res.status(200).json(currenciesRates);
});

/* GET all currency pairings */
router.get("/currencies/pairs", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesPairings = fileContents.currency_pairings;
  res.status(200).json(currenciesPairings);
});

/* GET one currency pairing from request query */
// {
//   base_currency: "EUR",
//   quote_currency: "RON"
// }
router.get("/currencies/quote", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  if (req.query.base_currency && req.query.quote_currency) {
    let foundBase = currenciesRates.find(
      (pair) => pair.base_currency === req.query.base_currency
    ).quotes;
    let foundPair = null;
    for (item in foundBase) {
      if (item === req.query.quote_currency) {
        foundPair = foundBase[item];
        break;
      }
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
    });

    let timer = setInterval(() => getNewCurrencyData(res, foundPair), 3000);

    res.socket.on("end", () => {
      //responses = responses.filter((x) => x != res);
      clearInterval(timer);
      res.emit("close");
    });
    //responses.push(res);
  } else {
    res.status(400).json({ message: "Bad request" });
  }
});

function getNewCurrencyData(res, currencyObj) {
  let sendObj = {
    sell: (
      Math.random() * (currencyObj.sell + 0.1 - (currencyObj.sell - 0.1)) +
      (currencyObj.sell - 0.1)
    ).toFixed(2),
    buy: (
      Math.random() * (currencyObj.buy + 0.1 - (currencyObj.buy - 0.1)) +
      (currencyObj.buy - 0.1)
    ).toFixed(2),
  };

  return res.status(200).write(`data: ${JSON.stringify(sendObj)}\n\n`);
}

/* POST one base currency */
router.post("/currencies", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  
  //verify if it is in the list of currencies
  if (req.body.base_currency) {
    let foundCurrency = currenciesRates.find(
      (pair) => pair.base_currency === req.body.base_currency
    );
    if (foundCurrency) {
      res.status(200).json(foundCurrency);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
});

/* POST one currency pairing from request body*/
// {
//   base_currency: "EUR",
//   quote_currency: "RON"
// }
router.post("/currencies/quote", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  if (req.body.base_currency && req.body.quote_currency) {
    let foundBase = currenciesRates.find(
      (pair) => pair.base_currency === req.body.base_currency
    ).quotes;

    for (item in foundBase) {
      if (item === req.body.quote_currency) {
        res.status(200).json({
          sell: (
            Math.random() *
              (foundBase[item].sell + 0.1 - (foundBase[item].sell - 0.1)) +
            (foundBase[item].sell - 0.1)
          ).toFixed(2),
          buy: (
            Math.random() *
              (foundBase[item].buy + 0.1 - (foundBase[item].buy - 0.1)) +
            (foundBase[item].buy - 0.1)
          ).toFixed(2),
        });
      }
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
