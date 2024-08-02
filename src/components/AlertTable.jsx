import React, { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState([]);
  const [showRvolInput, setShowRvolInput] = useState(false);
  const [rvolDays, setRvolDays] = useState("");
  const [columns, setColumns] = useState([
    "symbol",
    "currPrice",
    "alertPrice",
    "RVol(50)",
  ]);
  const [quotes, setQuotes] = useState({});

  const showCustomAlert = (symbol, price) => {
    setAlertMessage(`Alert for ${symbol}: Price ${price}`);
    setIsAlertVisible(true);
    playAlertSound();
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    const alertData = async () => {
      const response = await fetch("http://127.0.0.1:5000/get_alerts");
      const alertData = await response.json();
      // console.log(alertData);

      // Convert data to array of objects
      const formattedData = alertData.map((item) => ({
        alertId: item[0],
        symbol: item[1],
        currPrice: item[0],
        alertPrice: item[2],
      }));

      setData(formattedData);
    };
    alertData();
  }, []);

  useEffect(() => {
    const establishWebSocketConnection = async () => {
      const ws = new WebSocket("ws://localhost:8765");
      ws.onmessage = (event) => {
        console.log("hello");

        const quote = JSON.parse(event.data);
        console.log(quote);
        setQuotes((prevQuotes) => ({ ...prevQuotes, [quote.symbol]: quote }));

        // showDesktopNotification("TCS.NS", 3000);     // For testing
        if (quote.alerts && quote.alerts.length > 0) {
          quote.alerts.forEach((q) => {
            const alertPrice = data.find((ele) => ele.alertId === q);
            if (alertPrice) {
              showDesktopNotification(quote.symbol, alertPrice);
            }
          });
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.log("WebSocket error:", error);
      };
    };

    establishWebSocketConnection();
  }, []);

  const showDesktopNotification = (symbol, alertPrice) => {
    console.log("Notification permission:", Notification.permission);
    if ("Notification" in window && Notification.permission === "granted") {
      const notificationTitle = `Alert for ${symbol}`;
      const notificationBody =
        typeof alertPrice === "number"
          ? `Alert Price: ${alertPrice}`
          : "Alert triggered";
      console.log(
        "Creating notification:",
        notificationTitle,
        notificationBody
      );
      new Notification(notificationTitle, { body: notificationBody });
    }
  };

  const addRvolColumn = () => {
    if (rvolDays && !isNaN(rvolDays)) {
      const newColumnName = `rvol${rvolDays}`;
      if (!columns.includes(newColumnName)) {
        setColumns([...columns, newColumnName]);
        const updatedData = data.map((item) => ({
          ...item,
          // [newColumnName]: (Math.random() * 2 + 0.5).toFixed(2), // Placeholder random RVOL value
          // Get req to get the rvol of ticker
        }));
        setData(updatedData);
      }
      setShowRvolInput(false);
      setRvolDays("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th key={column} className="border border-gray-300 p-2">
                {column === "symbol"
                  ? "Symbol"
                  : column === "currPrice"
                  ? "Curr Price"
                  : column === "alertPrice"
                  ? "Alert Price"
                  : `RVOL(${column.slice(4)})`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 p-2">{row.symbol}</td>
              <td className="border border-gray-300 p-2">
                {quotes[row.symbol] && quotes[row.symbol].price}
              </td>
              <td className="border border-gray-300 p-2">{row.alertPrice}</td>

              <td className="border border-gray-300 p-2">
                {quotes[row.symbol] && quotes[row.symbol].rvol_50}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        {!showRvolInput ? (
          <button
            onClick={() => setShowRvolInput(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add RVOL Column
          </button>
        ) : (
          <div className="flex items-center">
            <input
              type="number"
              value={rvolDays}
              onChange={(e) => setRvolDays(e.target.value)}
              placeholder="Enter number of days"
              className="border border-gray-300 p-2 mr-2 rounded"
            />
            <button
              onClick={addRvolColumn}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
