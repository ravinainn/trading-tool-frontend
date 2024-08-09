import axios from "axios";
import React, { useState } from "react";

const CustomTicker = () => {
  const [symbol, setSymbol] = useState("");
  const [alert, setAlert] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://trading-tool-e65y.onrender.com/yfinance_direct_alert",
        {
          symbol: symbol,
          price: alert,
        }
      );
      console.log("Response:", response.data);
      setSymbol("");
      setAlert(0);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="border border-gray-300 p-2 mr-2 rounded"
        placeholder="Enter Ticker:"
      />
      <input
        type="number"
        value={alert}
        onChange={(e) => setAlert(e.target.value)}
        className="border border-gray-300 p-2 mr-2 rounded"
        placeholder="Alert Price:"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
};

export default CustomTicker;
