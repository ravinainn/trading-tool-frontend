import React from "react";

import Table from "../components/AlertTable";
import CustomWatchlist from "../components/CustomWatchlist";

const WatchList = () => {
  return (
    <div className="w-full flex justify-center my-20">
      <CustomWatchlist />
      <div className="w-1/2  flex flex-col items-center ">
        <h1 className="text-4xl font-semibold ">Alert WatchList</h1>
        <Table />
      </div>
    </div>
  );
};

export default WatchList;
