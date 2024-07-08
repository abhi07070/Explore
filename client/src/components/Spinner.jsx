import React from "react";
import spinner from "../Images/spinner.gif";
const Spinner = () => {
  return (
    <div className="loader">
      <div className="loader__image">
        <img src={spinner} alt="" />
      </div>
    </div>
  );
};

export default Spinner;
