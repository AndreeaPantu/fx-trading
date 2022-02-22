import { useEffect, useState } from "react";

function BlotterView({
  transactions,
  sortEntries,
  handleInputChange,
  inputCcy,
  inputDate,
}) {

  const [currencyPairings, setCurrencyPairings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/currencies/pairs')
    .then(response => response.json())
    .then(data => {
      setCurrencyPairings(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  },[]);

  return (
    <>
      <div className="blotter-buttons">
        <p className="subtitle">FILTERS</p>
        <div className="vertical-line"></div>
        <div className="row">
          <div className="input-group col mb-3">
            <label className="input-group-text" htmlFor="inputCcy">
              CCY Pair
            </label>
            <select
              name="inputCcy"
              className="form-select"
              id="inputCcy"
              value={inputCcy}
              onChange={handleInputChange}
            >
              <option value="Choose...">Choose...</option>
              {currencyPairings.map((item, index) => (
                <option value={item} id={item + "Ccy"} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group col mb-3">
            <span className="input-group-text">Date</span>
            <input
              type="date"
              className="form-control"
              name="inputDate"
              id="inputDateFilter"
              placeholder="12/02/2018"
              value={inputDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table
          id="blotter-table"
          className="table table-striped col-xs-7 table-condensed table-fixed"
        >
          <thead className="thead-primary">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">
                Username<span> </span>
                <i
                  className="fas fa-sort"
                  onClick={() => sortEntries("username", "alphabetical")}
                ></i>
              </th>
              <th scope="col">
                CCY Pair<span> </span>
                <i
                  className="fas fa-sort"
                  onClick={() => sortEntries("ccy_pair", "alphabetical")}
                ></i>
              </th>
              <th scope="col">Rate</th>
              <th scope="col">
                Action<span> </span>
                <i
                  className="fas fa-sort"
                  onClick={() => sortEntries("action", "alphabetical")}
                ></i>
              </th>
              <th scope="col">
                Notional<span> </span>
                <i
                  className="fas fa-sort"
                  onClick={() => sortEntries("notional", "numerical")}
                ></i>
              </th>
              <th scope="col">Tenor</th>
              <th scope="col">
                Transaction Date<span> </span>
                <i
                  className="fas fa-sort"
                  onClick={() => sortEntries("trans_date", "date")}
                ></i>
              </th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {transactions.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index+1}</th>
                <td>{item.username}</td>
                <td>{item.ccy_pair}</td>
                <td>{item.rate}</td>
                <td>{item.action}</td>
                <td>{item.notional}</td>
                <td>{item.tenor}</td>
                <td>{item.trans_date + " " + item.trans_hour}</td>
                <td>{(item.rate * item.notional).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default BlotterView;
