import React, { useState, useEffect } from "react";
import HamBurger from "./components/hamBurger";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import WatchList from "./pages/watchlist";
import Settings from "./pages/settings";

function App() {
  const [stockData, setStockData] = useState(null);

  // useEffect(() => {
  //   const fetchLatestStockData = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:5000/get_latest_stock_data"
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setStockData(data);
  //     } catch (error) {
  //       console.error("Error fetching latest stock data:", error);
  //     }
  //   };
  //   fetchLatestStockData();
  // }, []);

  // if (!stockData) return <div>Loading...</div>;

  // return (
  //   <div className="flex ">
  //     <div className="border-2 border-black w-1/5 h-screen overflow-y-scroll">
  //       <h2 className="text-2xl text-center py-10 ">Latest Stock Alert</h2>
  //       <div className="p-2">
  //         <span className="text-base text-semibold">Alert: </span>
  //         {stockData ? stockData.symbol : "TCS"} at{" "}
  //         {stockData ? stockData.price : "4000"}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <BrowserRouter>
      <div className="flex ">
        <HamBurger />
        <Routes>
          <Route path="/" element={<WatchList />} />
          <Route path="/setting" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
