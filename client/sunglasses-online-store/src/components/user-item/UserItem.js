//importing modules
import React from "react";
import { Link } from "react-router-dom";
//user item is made up of many sunglasses items that has the same name.
//because in this system for example two sunglasses with same type but has different colors from each other
//are considered two different items.
const UserItem = (props) => {
  //calculating max and min price
  let maxPrice = props.items[0].price;
  let minPrice = maxPrice;
  for (let i = 0; i < props.items.length; i++) {
    if (props.items[i].price < minPrice) minPrice = props.items[i].price;
    else if (props.items[i].price > maxPrice) maxPrice = props.items[i].price;
  }
  //setting the price string that will be rendered
  let price = "";
  if (minPrice === maxPrice) price = minPrice + "$";
  else price = `${minPrice}$ - ${maxPrice}$`;
  //setting the image address that will be rendered
  let imgSrc = process.env.REACT_APP_BASE_URL + props.items[0].images[0];
  //return the UserItem component
  return (
    <Link to="/view_item" role="button" className="btn p-0 text-center m-4">
      <img
        src={imgSrc}
        alt={props.items[0].name}
        className="rounded border"
        style={{ maxWidth: "200px" }}
      />
      <p className="mb-0">{props.items[0].name}</p>
      <p>{price}</p>
    </Link>
  );
};

export default UserItem;
