import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss"

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });

  const formatSpots = (spots) => {
    let formattedSpots;

    if(spots === 0) {formattedSpots = 'no spots'};
    if(spots === 1) {formattedSpots = '1 spot'};
    if(spots > 1) {formattedSpots = `${spots} spots`};

    return formattedSpots;
  }
  

  return (
    <li 
      className={dayClass} 
      onClick={props.setDay}
    >
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)} remaining</h3>
    </li>
  );
}