import React from "react";

import Table from "../components/AlertTable";
import CustomWatchlist from "../components/CustomWatchlist";

const WatchList = () => {
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-1/2  flex flex-col items-center my-20">
        <h1 className="text-4xl font-semibold ">Alert WatchList</h1>
        <Table />
      </div>
      <div className="w-1/2  my-20">
        <CustomWatchlist />
      </div>
    </div>
  );
};

export default WatchList;
