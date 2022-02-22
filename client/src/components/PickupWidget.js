import React, { useState } from "react";

function PickupWidget(props) {
  const [mainCurreccySelect, setMainCurrencySelect] = useState("Choose...");
  const [secondCurreccySelect, setSecondCurrencySelect] = useState("Choose...");
  const sendSelectedCurrency = [mainCurreccySelect, secondCurreccySelect];

  return (
    <div className="col" id={`cardPick${props.id}`}>
      <div className="card">
        <div className="card-currency--border px-3 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <p className="subtitle">Pick a currency</p>
          </div>
          <button
            className="btn-close"
            type="button"
            aria-label="Close"
            onClick={() => {
              props.closeCard(props.id);
            }}
          ></button>
        </div>
        <div className="card-input--center mt-3 px-3">
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputMainCurrency">
              Primary
            </label>
            <select
              className="form-select"
              id="inputMainCurrency"
              value={mainCurreccySelect}
              onChange={(e) => setMainCurrencySelect(e.target.value)}
            >
              <option value="opt_none">Choose...</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="RON">RON</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputSecondCurrency">
              Secondary
            </label>
            <select
              className="form-select"
              id="inputSecondCurrency"
              value={secondCurreccySelect}
              onChange={(e) => setSecondCurrencySelect(e.target.value)}
            >
              <option value="opt_none">Choose...</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="RON">RON</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>
        <div className="card-actions px-3 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() =>
              props.swapToMainWidget(sendSelectedCurrency, props.id)
            }
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default PickupWidget;
