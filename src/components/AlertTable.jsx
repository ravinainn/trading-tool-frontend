import React, { useEffect, useState } from "react";

import CustomTicker from "./CustomTicker";

const Table = () => {
  const [data, setData] = useState([]);
  const [showRvolInput, setShowRvolInput] = useState(false);
  const [rvolDays, setRvolDays] = useState("");
  const [columns, setColumns] = useState([
    "symbol",
    "currPrice",
    "alertPrice",
    "RVol50",
  ]);
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    const alertData = async () => {
      const response = await fetch("http://127.0.0.1:5000/get_alerts");
      const alertData = await response.json();
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
    let ws;

    const establishWebSocketConnection = () => {
      ws = new WebSocket("ws://localhost:8765");

      ws.onmessage = (event) => {
        const quote = JSON.parse(event.data);
        setQuotes((prevQuotes) => ({ ...prevQuotes, [quote.symbol]: quote }));

        if (quote.alerts && quote.alerts.length > 0) {
          quote.alerts.forEach((q) => {
            const alertItem = data.find((ele) => ele.alertId === q);

            if (alertItem && alertItem.alertPrice) {
              showDesktopNotification(quote.symbol, alertItem.alertPrice);
            } else {
              console.log("Alert item or alert price not found for alertId:");
            }
          });
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(establishWebSocketConnection, 1000); // Reconnect after 1 second
      };

      ws.onerror = (error) => {
        console.log("WebSocket error:", error);
      };
    };

    establishWebSocketConnection();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [data]);

  const showDesktopNotification = (symbol, alertPrice) => {
    console.log(Notification.permission);
    if ("Notification" in window && Notification.permission === "granted") {
      const notificationTitle = `Alert for ${symbol}`;
      console.log(alertPrice);
      const notificationBody =
        typeof alertPrice === "number"
          ? `Alert Price: ${alertPrice}`
          : "Alert triggered";
      console.log(notificationBody);
      alert(notificationBody);
      try {
        new Notification(notificationTitle, {
          body: notificationBody,
        });
        console.log("Notification created successfully");
        const audio = new Audio("/noti.mp3");
        audio.play().catch((e) => console.error("Error playing sound:", e));
      } catch (error) {
        console.error("Error creating notification:", error);
      }
      new Notification(notificationTitle, { body: notificationBody });
      console.log("hello");
    }
  };

  const addRvolColumn = () => {
    if (rvolDays && !isNaN(rvolDays)) {
      const newColumnName = `rvol${rvolDays}`;
      if (!columns.includes(newColumnName)) {
        setColumns([...columns, newColumnName]);
        const updatedData = data.map((item) => ({
          ...item,
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
                  ? "Current Price"
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
                {quotes[row.symbol] &&
                  Math.round(quotes[row.symbol].price * 100) / 100}
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
      <CustomTicker />
    </div>
  );
};

export default Table;
