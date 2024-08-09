import React, { useEffect, useState } from "react";

import CustomTicker from "./CustomTicker";
import axios from "axios";
import { io } from "socket.io-client";
const backendURL = process.env.REACT_APP_BACKEND_URL;

const initialDummyTags = [
  { name: "Urgent", color: "#FF0000" },
  { name: "Personal", color: "#FFA500" },
  { name: "Work", color: "#0000FF" },
  { name: "Family", color: "#800080" },
  { name: "Health", color: "#008000" },
  { name: "Finance", color: "#00FF00" },
  { name: "Education", color: "#FFFF00" },
  { name: "Hobby", color: "#FFC0CB" },
  { name: "Travel", color: "#00FFFF" },
  { name: "Food", color: "#8B4513" },
  { name: "Sports", color: "#FF4500" },
  { name: "Technology", color: "#808080" },
  { name: "Music", color: "#4B0082" },
  { name: "Art", color: "#FF1493" },
  { name: "Books", color: "#2E8B57" },
  { name: "Movies", color: "#DA70D6" },
  { name: "Pets", color: "#8B008B" },
  { name: "Shopping", color: "#FF69B4" },
  { name: "Gardening", color: "#32CD32" },
  { name: "Fitness", color: "#FF6347" },
];

const Table = () => {
  const [data, setData] = useState([]);
  const [showRvolInput, setShowRvolInput] = useState(false);
  const [rvolDays, setRvolDays] = useState("");
  const [columns, setColumns] = useState([
    "symbol",
    "currPrice",
    "alertPrice",
    "RVol50",
    "tags",
    "status",
  ]);
  const [quotes, setQuotes] = useState({});

  const [tags, setTags] = useState([]);

  const alertData = async () => {
    const response = await fetch(
      "https://trading-tool-e65y.onrender.com/get_alerts"
    );
    const alertData = await response.json();
    // console.log(alertData);
    const formattedData = alertData.map((item) => ({
      alertId: item[0],
      symbol: item[1],
      currPrice: item[0],
      alertPrice: item[2],
      tagids: item[4] || [],
      enabled: item[5],
    }));
    setData(formattedData);
  };
  const getTags = async () => {
    const response = await axios.get(
      "https://trading-tool-e65y.onrender.com/get_tags"
    );

    setTags(response.data.tags);
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    alertData();
    getTags();
  }, []);

  useEffect(() => {
    const socket = io("https://trading-tool-e65y.onrender.com", {
      transports: ["websocket"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket.emit("join", "/quotes");
    });
    socket.on("quote", (quote) => {
      setQuotes((prevQuotes) => ({ ...prevQuotes, [quote.symbol]: quote }));
      console.log("hello");
      if (quote.alerts && quote.alerts.length > 0) {
        quote.alerts.forEach((q) => {
          const alertItem = data.find((ele) => ele.alertId === q);

          if (alertItem && alertItem.alertPrice) {
            showDesktopNotification(quote.symbol, alertItem.alertPrice);
          } else {
            console.log("Alert item or alert price not found for alertId:", q);
          }
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    socket.on("connect_error", (error) => {
      console.log("Socket.IO connection error:", error);
    });
    return () => {
      socket.disconnect();
    };
    // let ws;

    // const establishWebSocketConnection = () => {
    //   ws = new WebSocket("ws://localhost:8765");

    //   ws.onmessage = (event) => {
    //     const quote = JSON.parse(event.data);
    //     setQuotes((prevQuotes) => ({ ...prevQuotes, [quote.symbol]: quote }));
    //     // console.log(quote);

    //     if (quote.alerts && quote.alerts.length > 0) {
    //       quote.alerts.forEach((q) => {
    //         const alertItem = data.find((ele) => ele.alertId === q);

    //         if (alertItem && alertItem.alertPrice) {
    //           showDesktopNotification(quote.symbol, alertItem.alertPrice);
    //         } else {
    //           console.log("Alert item or alert price not found for alertId:");
    //         }
    //       });
    //     }
    //   };

    //   ws.onclose = () => {
    //     console.log("WebSocket connection closed. Reconnecting...");
    //     setTimeout(establishWebSocketConnection, 1000); // Reconnect after 1 second
    //   };

    //   ws.onerror = (error) => {
    //     console.log("WebSocket error:", error);
    //   };
    // };

    // establishWebSocketConnection();
    // return () => {
    //   if (ws) {
    //     ws.close();
    //   }
    // };
  }, []);

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
      // alert(notificationBody);
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

  const handleTagSelection = async (alertId, tagid) => {
    try {
      await axios.post("https://trading-tool-e65y.onrender.com/add_alert_tag", {
        alert_id: alertId,
        tag_id: tagid,
      });
      alertData();
    } catch (error) {
      console.log(error);
    }
    // setData((prevData) =>
    //   prevData.map((alert) =>
    //     alert.alertId === alertId
    //       ? {
    //           ...alert,
    //           tags: [...alert.tags, { name: tagName, color: tagColor }],
    //         }
    //       : alert
    //   )
    // );
  };

  const handleRemoveTag = async (alertId, tag) => {
    await axios.post(
      "https://trading-tool-e65y.onrender.com/remove_alert_tag",
      { alert_id: alertId, tad_id: tag.tagid }
    );
    alertData();
    // setData((prevData) =>
    //   prevData.map((alert) =>
    //     alert.alertId === alertId
    //       ? {
    //           ...alert,
    //           tags: alert.tags.filter((tag) => tag.name !== tagToRemove.name),
    //         }
    //       : alert
    //   )
    // );
  };

  const toggleAlertStatus = (alertId) => {
    setData((prevData) =>
      prevData.map((alert) =>
        alert.alertId === alertId
          ? { ...alert, enabled: !alert.enabled }
          : alert
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <CustomTicker />
      <br></br>
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
                  : column === "tags"
                  ? "Tags"
                  : column === "status"
                  ? "Status"
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

              {/* Tag */}
              <td className="border border-gray-300 p-2">
                <div className="flex flex-wrap gap-1 mb-2">
                  {row.tagids.map((tagid, i) => {
                    const tag = tags.find((t) => t.tagid == tagid);
                    // console.log(tag);
                    if (!tag) return null;
                    return (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-white text-sm flex items-center"
                        style={{ backgroundColor: tag.tagcolor }}
                      >
                        {tag.tagname}
                        <button
                          onClick={() => handleRemoveTag(row.alertId, tag)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
                <select
                  onChange={(e) => {
                    const tagid = e.target.value;
                    handleTagSelection(row.alertId, tagid);
                  }}
                  className="border rounded p-1"
                >
                  {/* <option value="">Add a tag</option> */}
                  {tags.map((tag, i) => (
                    <option key={i} value={tag.tagid}>
                      {tag.tagname}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={row.enabled}
                      onChange={() => toggleAlertStatus(row.alertId)}
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${
                        row.enabled ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                        row.enabled ? "transform translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">
                    {row.enabled ? "Enabled" : "Disabled"}
                  </div>
                </label>
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
