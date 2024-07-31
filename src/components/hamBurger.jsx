import React from "react";
import { MdBookmark } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";

const HamBurger = () => {
  return (
    <div className=" border-black w-20 h-screen flex flex-col justify-between items-center py-10">
      <Link to={"/"}>
        <MdBookmark className="text-3xl" />
      </Link>
      <Link to={"/setting"}>
        <IoMdSettings className="text-3xl" />
      </Link>
    </div>
  );
};

export default HamBurger;
