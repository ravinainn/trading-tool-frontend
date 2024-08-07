import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomWatchlist = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [watchlistInputs, setWatchlistInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_watchlists");
      setWatchlists(response.data.watchlists);
      // Initialize inputs for each watchlist
      const inputs = response.data.watchlists.reduce((acc, watchlist) => {
        acc[watchlist.watchlistname] = "";
        return acc;
      }, {});
      setWatchlistInputs(inputs);
    } catch (error) {
      console.error("Error fetching watchlists:", error);
      setError("Failed to fetch watchlists. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    if (newWatchlistName.trim() === "") return;

    try {
      await axios.post("http://127.0.0.1:5000/add_watchlist", {
        watchlist_name: newWatchlistName,
        symbols: [],
      });
      setNewWatchlistName("");
      fetchWatchlists();
    } catch (error) {
      console.error("Error creating watchlist:", error);
    }
  };

  const handleDeleteWatchlist = async (watchlistName) => {
    try {
      await axios.post("http://127.0.0.1:5000/delete_watchlist", {
        watchlist_name: watchlistName,
      });
      fetchWatchlists();
    } catch (error) {
      console.error("Error deleting watchlist:", error);
    }
  };

  const handleAddStock = async (watchlistName) => {
    const newStockSymbol = watchlistInputs[watchlistName];
    if (newStockSymbol.trim() === "") return;

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/add_watchlist_item",
        {
          watchlist_name: watchlistName,
          symbol: newStockSymbol,
        }
      );
      console.log(response);
      console.log(response.data);
      setWatchlistInputs((prev) => ({ ...prev, [watchlistName]: "" }));
      fetchWatchlists();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleDeleteStock = async (watchlistName, stockSymbol) => {
    try {
      await axios.post("http://127.0.0.1:5000/delete_watchlist_item", {
        watchlist_name: watchlistName,
        symbol: stockSymbol,
      });
      fetchWatchlists();
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <div className="border-r-2  p-4">
      <h1 className="text-4xl font-semibold mb-4">Custom WatchList</h1>
      <form onSubmit={handleCreateWatchlist} className="mb-4">
        <input
          type="text"
          value={newWatchlistName}
          onChange={(e) => setNewWatchlistName(e.target.value)}
          placeholder="Enter watchlist name"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Watchlist
        </button>
      </form>
      {watchlists.length === 0 ? (
        <p>No Watchlist Found. Create a new Watchlist </p>
      ) : (
        watchlists.map((watchlist, index) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">
                {watchlist.watchlistname}
              </h2>
              <button
                onClick={() => handleDeleteWatchlist(watchlist.watchlistname)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete Watchlist
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddStock(watchlist.watchlistname);
              }}
              className="mb-4"
            >
              <input
                type="text"
                value={watchlistInputs[watchlist.watchlistname] || ""}
                onChange={(e) =>
                  setWatchlistInputs((prev) => ({
                    ...prev,
                    [watchlist.watchlistname]: e.target.value,
                  }))
                }
                placeholder="Enter stock symbol"
                className="border p-2 mr-2"
              />
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded"
              >
                Add Stock
              </button>
            </form>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Symbol</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.symbols && watchlist.symbols.length > 0 ? (
                  watchlist.symbols.map((symbol, stockIndex) => (
                    <tr key={stockIndex}>
                      <td className="border p-2">{symbol}</td>
                      <td className="border p-2">
                        <button
                          onClick={() =>
                            handleDeleteStock(watchlist.watchlistname, symbol)
                          }
                          className="bg-red-500 text-white p-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="border p-2 text-center">
                      No stocks in this watchlist
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomWatchlist;
