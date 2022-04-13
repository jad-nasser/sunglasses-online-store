import React from "react";
const Item = (props) => {
  return (
    <div className="m-4 d-inline-flex">
      <div style={{ maxWidth: "200px" }} className="me-2">
        <img
          src={process.env.REACT_APP_BASE_URL + props.item.images[0]}
          alt={props.item.name}
          className="rounded border mb-2"
          style={{ maxWidth: "200px" }}
        />
        {props.item.images.map((image, index) => (
          <button className="btn me-2 mb-2 p-0 border" key={index}>
            <img
              src={process.env.REACT_APP_BASE_URL + image}
              alt={index}
              className="rounded"
              style={{ maxWidth: "40px" }}
              onClick={props.viewImage}
            />
          </button>
        ))}
      </div>
      <div style={{ maxWidth: "200px" }}>
        <div>ID: {props.item._id}</div>
        <div>Brand: {props.item.brand}</div>
        <div>Name: {props.item.name}</div>
        <div>Color: {props.item.color}</div>
        <div>Size: {props.item.size}</div>
        <div>Price: {props.item.price}$</div>
        <div>Quantity: {props.item.quantity}</div>
        <div>Times Ordered: {props.item.times_ordered}</div>
      </div>
    </div>
  );
};
export default Item;
