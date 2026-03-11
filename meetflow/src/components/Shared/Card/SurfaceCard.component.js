import React from "react";
import "./Card.css";

const SurfaceCard = (props) => {
  return <div className="card">{props.children}</div>;
};

export default SurfaceCard;
