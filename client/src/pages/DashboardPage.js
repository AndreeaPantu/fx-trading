import AddWidget from "../components/AddWidget";
import BlotterView from "../components/BlotterView";
import MainWidget from "../components/MainWidget";
import NavBar from "../components/NavBar";
import PickupWidget from "../components/PickupWidget";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { Component } from "react";

let eventSource;
class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widgetArray: [],
      indexArrayCount: [],
      isAdd: true,
      transactions: [],
      unfilteredTransactions: [],
      sendSelectedCurrency: [],
      sortObj: {
        username: true,
        ccy_pair: true,
        action: true,
        notional: true,
        trans_date: true,
      },
      inputCcy: "Choose...",
      inputDate: "",
      eventSourceList: [],
    };

    this.addPickupWidget = this.addPickupWidget.bind(this);
    this.closeCard = this.closeCard.bind(this);
    this.swapToMainWidget = this.swapToMainWidget.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.sendDataTransactions = this.sendDataTransactions.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.clearCookie = this.clearCookie.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.swapCurrency = this.swapCurrency.bind(this);
    this.sortEntries = this.sortEntries.bind(this);
    //this.filterBlotterTable = this.filterBlotterTable.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  getTransactions() {
    let url = "http://localhost:8080/api/transactions";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) =>
      res.json().then((data) => {
        this.setState({
          transactions: data,
          unfilteredTransactions: data,
        });
      })
    );
  }

  componentDidMount() {
    let username = this.getCookie("username");
    if (!username) {
      toast.error(`🦄 You have to be logged in to use this page!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
    this.getTransactions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.indexArrayCount !== this.state.indexArrayCount) {
      if (this.state.isAdd) {
        if (this.state.widgetArray.length === 0) {
          let zero = 0;
          this.setState({
            ...this.state,
            widgetArray: [
              ...this.state.widgetArray,
              <PickupWidget
                closeCard={this.closeCard}
                key={zero}
                id={zero}
                swapToMainWidget={this.swapToMainWidget}
              />,
            ],
          });
        } else if (this.state.widgetArray.length <= 4) {
          this.setState({
            ...this.state,
            widgetArray: [
              ...this.state.widgetArray,
              <PickupWidget
                closeCard={this.closeCard}
                key={
                  this.state.indexArrayCount[
                    this.state.indexArrayCount.length - 1
                  ]
                }
                id={
                  this.state.indexArrayCount[
                    this.state.indexArrayCount.length - 1
                  ]
                }
                swapToMainWidget={this.swapToMainWidget}
              />,
            ],
          });
        }
      }
    }
  }

  addPickupWidget() {
    if (this.state.widgetArray.length === 0) {
      this.setState({
        ...this.state,
        isAdd: true,
        indexArrayCount: [...this.state.indexArrayCount, 0],
      });
    } else if (this.state.widgetArray.length <= 4) {
      this.setState({
        ...this.state,
        isAdd: true,
        indexArrayCount: [
          ...this.state.indexArrayCount,
          this.state.indexArrayCount[this.state.indexArrayCount.length - 1] + 1,
        ],
      });
    } else {
      toast.error(`🦄 You cannot have more than 5 widgets at a time!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  closeCard(id) {
    const newWidgetArray = [...this.state.widgetArray];
    let index = newWidgetArray.findIndex(
      (item, index) => this.state.indexArrayCount[index] === Number(id)
    );
    newWidgetArray.splice(index, 1);
    const newCurrencyArray = [...this.state.sendSelectedCurrency];
    newCurrencyArray.splice(index, 1);
    const newIndexArray = this.state.indexArrayCount.filter(
      (item) => item !== id
    );
    // if we close a MainWidget we also need to close the event
    if (this.state.widgetArray[index].props.sellRate) {
      this.stop(id);
    }
    this.setState({
      ...this.state,
      isAdd: false,
      indexArrayCount: newIndexArray,
      widgetArray: newWidgetArray,
      sendSelectedCurrency: newCurrencyArray,
    });
  }

  swapToMainWidget(sendSelectedCurrency, idToSwap) {
    const inputMainCurrency = sendSelectedCurrency[0];
    const inputSecondCurrency = sendSelectedCurrency[1];
    const baseUrl = "http://localhost:8080/api/";

    if (
      inputMainCurrency &&
      inputSecondCurrency &&
      inputMainCurrency !== "opt_none" &&
      inputSecondCurrency !== "opt_none" &&
      inputMainCurrency !== "Choose..." &&
      inputSecondCurrency !== "Choose..."
    ) {
      if (inputMainCurrency === inputSecondCurrency) {
        toast.error(`🦄 You must choose two different currencies.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        let currencyObj = {
          base_currency: inputMainCurrency,
          quote_currency: inputSecondCurrency,
        };
        fetch(baseUrl + "currencies/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currencyObj),
        })
          .then((res) =>
            res.json().then((data) => ({ status: res.status, body: data }))
          )
          .then((response) => {
            if (response.status === 200) {
              let array = [...this.state.widgetArray];
              let indexCard = array.findIndex(
                (item, index) =>
                  this.state.indexArrayCount[index] === Number(idToSwap)
              );
              if (indexCard !== -1) {
                array.splice(
                  indexCard,
                  1,
                  <MainWidget
                    key={idToSwap}
                    mainCurrency={inputMainCurrency}
                    secondCurrency={inputSecondCurrency}
                    sellRate={response.body.sell}
                    buyRate={response.body.buy}
                    closeCard={this.closeCard}
                    id={idToSwap}
                    sendDataTransactions={this.sendDataTransactions}
                    swapCurrency={this.swapCurrency}
                    iconSell={"down"}
                    iconBuy={"up"}
                  />
                );
                this.setState(
                  {
                    widgetArray: array,
                    sendSelectedCurrency: [
                      ...this.state.sendSelectedCurrency,
                      {
                        id: idToSwap,
                        mainCurrency: sendSelectedCurrency[0],
                        secondCurrency: sendSelectedCurrency[1],
                        sellRate: response.body.sell,
                        buyRate: response.body.buy,
                      },
                    ],
                  },
                  this.start(
                    currencyObj.base_currency,
                    currencyObj.quote_currency,
                    idToSwap,
                    idToSwap
                  )
                );
              }
            } else {
              toast.error(response.body, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } else {
      toast.error(`🦄 Currency fields cannot be empty.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  sendDataTransactions(
    actionSellOrBuy,
    mainCurrencyToSend,
    secondCurrencyToSend,
    sellOrBuyRateToSend,
    notional,
    tenor
  ) {
    let userName = this.getCookie("username");

    if (tenor !== "Choose..." && notional >= 1) {
      const monthNames = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      const dateObj = new Date();
      const month = monthNames[dateObj.getMonth()];
      const day = String(dateObj.getDate()).padStart(2, "0");
      const year = dateObj.getFullYear();
      function addZero(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
      let h = addZero(dateObj.getHours());
      let m = addZero(dateObj.getMinutes());
      let time = h + ":" + m;
      const outputDate = day + "/" + month + "/" + year;

      let url = "http://localhost:8080/api/transactions";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${userName}`,
          ccy_pair: `${mainCurrencyToSend}/${secondCurrencyToSend}`,
          rate: sellOrBuyRateToSend,
          action: actionSellOrBuy,
          notional: notional,
          tenor: tenor,
          trans_date: outputDate,
          trans_hour: time,
        }),
      })
        .then((res) =>
          res
            .json()
            .then((data) => ({ status: res.status, body: data.message }))
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(`🦄 Transaction completed!`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            this.getTransactions();
            // reset the inputs for mainWidget
          } else {
            toast.error(`🦄 Transaction failed.`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (notional && tenor === "Choose...") {
      toast.error(`🦄 Please choose a tenor value.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!notional && tenor !== "Choose...") {
      toast.error(`🦄 Please choose a National value.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!notional && tenor === "Choose...") {
      toast.error(`🦄 Please choose national and tenor values.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (notional <= 1) {
      toast.error(`🦄 Notional value must be at least 1.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  clearCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  handleLogout() {
    this.clearCookie("username");
    toast.success(`🦄 You have been logged out.`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);

    if (this.state.eventSourceList.length > 0) {
      this.state.eventSourceList.forEach((item) => {
        item.eventSourceObj.close();
      });
    }
  }

  swapCurrency(id) {
    let elementToSwap = this.state.sendSelectedCurrency.find(
      (item) => item.id === id
    );

    let array = [...this.state.widgetArray];
    let indexCard = array.findIndex(
      (item, index) => this.state.indexArrayCount[index] === Number(id)
    );
    let newArrayToSwap = [...this.state.sendSelectedCurrency];
    if (indexCard !== -1) {
      newArrayToSwap.splice(indexCard, 1, {
        id: id,
        mainCurrency: elementToSwap.secondCurrency,
        secondCurrency: elementToSwap.mainCurrency,
        sellRate: elementToSwap.buyRate,
        buyRate: elementToSwap.sellRate,
      });
      array.splice(
        indexCard,
        1,
        <MainWidget
          key={id}
          mainCurrency={elementToSwap.secondCurrency}
          secondCurrency={elementToSwap.mainCurrency}
          sellRate={elementToSwap.buyRate}
          buyRate={elementToSwap.sellRate}
          closeCard={this.closeCard}
          id={id}
          sendDataTransactions={this.sendDataTransactions}
          swapCurrency={this.swapCurrency}
        />
      );
      this.setState({
        widgetArray: array,
        sendSelectedCurrency: newArrayToSwap,
      });
    }
  }

  sortEntries(property, sortType) {
    let filteredRegistrations = [];
    let currentSelectionTable = this.state.transactions;

    switch (sortType) {
      case "alphabetical":
        if (this.state.sortObj[property]) {
          filteredRegistrations = currentSelectionTable.sort((a, b) =>
            a[property].toLowerCase().localeCompare(b[property].toLowerCase())
          );
        } else {
          filteredRegistrations = currentSelectionTable.sort((a, b) =>
            b[property].toLowerCase().localeCompare(a[property].toLowerCase())
          );
        }
        break;
      case "numerical":
        if (this.state.sortObj[property]) {
          filteredRegistrations = currentSelectionTable.sort(
            (a, b) => a[property] - b[property]
          );
        } else {
          filteredRegistrations = currentSelectionTable.sort(
            (a, b) => b[property] - a[property]
          );
        }
        break;
      case "date":
        if (this.state.sortObj[property]) {
          filteredRegistrations = currentSelectionTable.sort((a, b) => {
            let { firstDate, secondDate } = this.parseDates(
              a,
              b,
              property,
              "trans_hour"
            );
            return firstDate - secondDate;
          });
        } else {
          filteredRegistrations = currentSelectionTable.sort((a, b) => {
            let { firstDate, secondDate } = this.parseDates(
              a,
              b,
              property,
              "trans_hour"
            );
            return secondDate - firstDate;
          });
        }
        break;
    }
    this.setState({
      transactions: filteredRegistrations,
      unfilteredTransactions: filteredRegistrations,
      sortObj: {
        ...this.state.sortObj,
        [property]: !this.state.sortObj[property],
      },
    });
  }

  parseDates(a, b, property, propertyHour) {
    let incomingDateA = a[property].substring(0, 10);
    let newIncomingDateA = incomingDateA.split("/");
    [newIncomingDateA[0], newIncomingDateA[1]] = [
      newIncomingDateA[1],
      newIncomingDateA[0],
    ];

    incomingDateA = newIncomingDateA.join("/");
    let incomingHourA = a[propertyHour];
    let dateA = `${incomingDateA} ${incomingHourA}`;
    let firstDate = new Date(dateA);

    let incomingDateB = b[property].substring(0, 10);
    let newIncomingDateB = incomingDateB.split("/");
    [newIncomingDateB[0], newIncomingDateB[1]] = [
      newIncomingDateB[1],
      newIncomingDateB[0],
    ];

    incomingDateB = newIncomingDateB.join("/");
    let incomingHourB = b[propertyHour];
    let dateB = `${incomingDateB} ${incomingHourB}`;
    let secondDate = new Date(dateB);

    return {
      firstDate: firstDate,
      secondDate: secondDate,
    };
  }

  handleInputChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState(
      {
        [name]: value,
      },
      this.filterBlotterTable
    );
  }

  filterBlotterTable() {
    const inputCcy = this.state.inputCcy;
    let currentSelectionTable = this.state.unfilteredTransactions;
    let selectedDate = this.state.inputDate;
    let dateArray = selectedDate.split("-").reverse();
    selectedDate = dateArray.join("/");

    //ccy input and date input exist
    if (inputCcy !== "Choose..." && selectedDate.length !== 0) {
      currentSelectionTable = currentSelectionTable
        .filter((i) => i.ccy_pair === inputCcy)
        .filter((i) => i.trans_date.startsWith(selectedDate));
      if (currentSelectionTable.length === 0) {
        toast.error(
          `There are no registrations available for selected filters. Please select another options.`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    }
    //ccy input exists but date input doesn`t
    else if (inputCcy !== "Choose..." && selectedDate.length === 0) {
      currentSelectionTable = currentSelectionTable.filter(
        (i) => i.ccy_pair === inputCcy
      );
      if (currentSelectionTable.length === 0) {
        toast.error(
          `There are no registrations available for selected filters. Please select another options.`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    }
    //date input exists but ccy input doesn`t
    else if (inputCcy === "Choose..." && selectedDate.length !== 0) {
      currentSelectionTable = currentSelectionTable.filter((i) =>
        i.trans_date.startsWith(selectedDate)
      );
      if (currentSelectionTable.length === 0) {
        toast.error(
          `There are no registrations available for selected filters. Please select another options.`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    }
    //display filterd table registration
    this.setState({ transactions: currentSelectionTable });
  }

  start(base_currency, quote_currency, inputId, currentCardId) {
    const baseUrl = "http://localhost:8080/api/";
    // when "Start" button pressed
    if (!window.EventSource) {
      // IE or an old browser
      alert("The browser doesn't support EventSource.");
      return;
    }

    eventSource = new EventSource(
      baseUrl +
        `currencies/quote?base_currency=${base_currency}&quote_currency=${quote_currency}`
    );

    this.setState({
      eventSourceList: [
        ...this.state.eventSourceList,
        {
          id: currentCardId,
          eventSourceObj: eventSource,
        },
      ],
    });

    eventSource.onopen = (e) => {
      console.log("Event: open");
    };

    eventSource.onerror = (e) => {
      console.log("Event: error");
      if (this.readyState === EventSource.CONNECTING) {
        console.log(`Reconnecting (readyState=${this.readyState})...`);
      } else {
        console.log("Error has occurred.");
      }
    };

    eventSource.onmessage = (e) => {
      let currencyObj = JSON.parse(e.data);

      //populate the itemstop

      let array = [...this.state.sendSelectedCurrency];
      let indexItem = array.findIndex(
        (item, index) =>
        array[index].id === Number(currentCardId)
      );
      let arrayWidget = [...this.state.widgetArray];
      let indexWidget = arrayWidget.findIndex((item, index) => arrayWidget[index].props.id === Number(currentCardId));
      let initialSellRate = this.state.sendSelectedCurrency[indexItem].sellRate;
      let initialBuyRate = this.state.sendSelectedCurrency[indexItem].buyRate;

      array.splice(indexItem, 1, {
        buyRate: currencyObj.buy,
        id: currentCardId,
        mainCurrency: base_currency,
        secondCurrency: quote_currency,
        sellRate: currencyObj.sell,
      });
      arrayWidget.splice(
        indexWidget,
        1,
        <MainWidget
          key={currentCardId}
          mainCurrency={base_currency}
          secondCurrency={quote_currency}
          sellRate={currencyObj.sell}
          buyRate={currencyObj.buy}
          closeCard={this.closeCard}
          id={currentCardId}
          sendDataTransactions={this.sendDataTransactions}
          swapCurrency={this.swapCurrency}
          iconSell={initialSellRate < currencyObj.sell ? "up" : "down"}
          iconBuy={initialBuyRate < currencyObj.buy ? "up" : "down"}
        />
      );

      this.setState({
        sendSelectedCurrency: array,
        widgetArray: arrayWidget,
      });
    };
  }

  stop(eventSourceId) {
    // when "Stop" button pressed
    if (eventSource) {
      let eventSourceIndex = this.state.eventSourceList.findIndex(
        (item) => item.id === eventSourceId
      );
      let foundEventSource = this.state.eventSourceList.splice(
        eventSourceIndex,
        1
      );
      foundEventSource[0].eventSourceObj.close();
    }
  }

  render() {
    let username = this.getCookie("username");
    return username !== "" ? (
      <div id="app">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <NavBar handleLogout={this.handleLogout} />
        <main className="container-fluid row mb-5">
          <section className="col-sm-12 col-md-12 col-lg-6">
            <h5 className="color-titles">Fx Rates View</h5>
            <div className="cards-container">
              <div className="row row-cols-1 row-cols-sm-2 g-4">
                {/* {<MainWidget />} */}
                {this.state.widgetArray.length > 0 &&
                  this.state.widgetArray.map((item) => item)}
                <AddWidget addPickupWidget={this.addPickupWidget} />
              </div>
            </div>
          </section>
          <section className="col-sm-12 col-md-12 col-lg-6">
            <h5 className="color-titles">Blotter View</h5>
            <hr />
            <BlotterView
              transactions={this.state.transactions}
              sortEntries={this.sortEntries}
              handleInputChange={this.handleInputChange}
              inputCcy={this.state.inputCcy}
              inputDate={this.state.inputDate}
            />
          </section>
        </main>
      </div>
    ) : (
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    );
  }
}

export default DashboardPage;
