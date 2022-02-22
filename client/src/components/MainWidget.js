import React, { useState } from "react";

function MainWidget({
  id,
  mainCurrency,
  secondCurrency,
  sellRate,
  buyRate,
  closeCard,
  sendDataTransactions,
  swapCurrency,
  iconBuy,
  iconSell,
}) {
  const [notionalInput, setNotionalInput] = useState("");
  const [tenorSelect, setTenorSelect] = useState("Choose...");

  function handleReset() {
    setNotionalInput("");
    setTenorSelect("Choose...");
  }

  return (
    <>
      <div className="col" id={"card" + id}>
        <div className="card">
          <div className="card-currency px-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <p className="subtitle">
                <span
                  className="text-large"
                  id={"mainCurrency" + id}
                  value={mainCurrency}
                >
                  {mainCurrency}
                </span>
                <span>/</span>
                <span
                  className="secondCurrency"
                  id={"secondCurrency" + id}
                  value={secondCurrency}
                >
                  {secondCurrency}
                </span>
              </p>
              <div className="icon-exchange">
                <i
                  className="fas fa-exchange-alt"
                  id={id}
                  onClick={() => swapCurrency(id)}
                ></i>
              </div>
            </div>
            <button
              className="btn-close"
              type="button"
              aria-label="Close"
              onClick={() => closeCard(id)}
            ></button>
          </div>
          <div className="card-rates px-3 d-flex justify-content-between">
            <p className="subtitle mb-0">
              SELL:
              <span
                className="text-large"
                value={sellRate}
                id={"sellRate" + id}
              >
                {sellRate}
              </span>
              <span className={"icon-" + iconSell}>
                <i
                  className={"fas fa-caret-" + iconSell}
                  id={"iconDown" + id}
                ></i>
              </span>
            </p>
            <p className="subtitle mb-0">
              BUY:{" "}
              <span className="text-large" value={buyRate} id={"buyRate" + id}>
                {buyRate}
              </span>
              <span className={"icon-" + iconBuy}>
                <i className={"fas fa-caret-" + iconBuy} id={"iconUp" + id}></i>
              </span>
            </p>
          </div>
          <div className="card-input mt-3 px-3">
            <div className="input-group mb-3">
              <span className="input-group-text" id={"inputNotional" + id}>
                Notional
              </span>
              <input
                className="form-control"
                type="number"
                placeholder="Amount"
                min="1"
                value={notionalInput}
                onChange={(e) => setNotionalInput(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="inputCcy1">
                Tenor
              </label>
              <select
                value={tenorSelect}
                onChange={(e) => setTenorSelect(e.target.value)}
                className="form-select"
              >
                <option value="Choose..." id="optionDefault">
                  Choose...
                </option>
                <option value="Spot">Spot</option>
                <option value="1M">1 Month</option>
                <option value="3M">3 Month</option>
              </select>
            </div>
          </div>
          <div className="card-actions px-3 d-flex justify-content-between">
            <button
              className="btn btn-success"
              type="button"
              id="sellBtn"
              onClick={() => {
                sendDataTransactions(
                  "sell",
                  mainCurrency,
                  secondCurrency,
                  sellRate,
                  notionalInput,
                  tenorSelect
                );
                handleReset();
              }}
            >
              Sell
            </button>
            <button
              className="btn btn-primary"
              type="button"
              id="buyBtn"
              onClick={() => {
                sendDataTransactions(
                  "buy",
                  mainCurrency,
                  secondCurrency,
                  buyRate,
                  notionalInput,
                  tenorSelect
                );
                handleReset();
              }}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainWidget;
