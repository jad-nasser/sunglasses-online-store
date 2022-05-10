import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const ViewItem = (props) => {
  const [itemGroupMatrix, setItemGroupMatrix] = useState(null);
  const [selectedItem, setSelectedItem] = useState({ x: 0, y: 0 });
  const quantity = useRef(null);
  const totalPrice = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //getting all the items that have a specific name according to the request query and
  //sort them in a matrix according to their color (represented by y) and their size (represented by x)
  useEffect(() => {
    const getItemGroupMatrix = async () => {
      try {
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "item/get_items",
          { params: props.requestQuery, withCredentials: true }
        );
        let matrix = [];
        for (let i = 0; i < res.data.length; i++) {
          let found = false;
          if (res.data[i].quantity === 0) continue;
          for (let j = 0; j < matrix.length; j++) {
            if (res.data[i].color === matrix[j][0].color) {
              found = true;
              matrix[j].push(res.data[i]);
              break;
            }
          }
          if (!found) matrix[matrix.length] = [res.data[i]];
        }
        if (matrix.length !== 0) setItemGroupMatrix(matrix);
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
        error.current.scrollIntoView();
      }
    };
    getItemGroupMatrix();
  }, [props.requestQuery]);
  //this method is to add the selected item in the local storage for the shopping cart
  //it will check if the item is already available in the local storage to replace it, if not then
  //the item will be added with the other items in the local storage
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      let lsItems = JSON.parse(localStorage.getItem("items"));
      if (!lsItems) lsItems = [];
      let found = false;
      for (let i = 0; i < lsItems.length; i++) {
        if (
          lsItems[i].id === itemGroupMatrix[selectedItem.y][selectedItem.x]._id
        ) {
          found = true;
          lsItems[i] = {
            id: itemGroupMatrix[selectedItem.y][selectedItem.x]._id,
            quantity: parseInt(quantity.current.value),
          };
          break;
        }
      }
      if (!found)
        lsItems.push({
          id: itemGroupMatrix[selectedItem.y][selectedItem.x]._id,
          quantity: parseInt(quantity.current.value),
        });
      localStorage.setItem("items", JSON.stringify(lsItems));
      success.current.textContent = "Item added to the shopping cart";
      success.current.classList.remove("d-none");
      success.current.scrollIntoView();
    }
  };
  //handle item size selection
  const handleSizeSelection = (e) => {
    if (selectedItem.x !== parseInt(e.target.value)) {
      if (quantity.current.value)
        totalPrice.current.textContent =
          itemGroupMatrix[selectedItem.y][parseInt(e.target.value)].price *
            parseInt(quantity.current.value) +
          "$";
      else totalPrice.current.textContent = 0 + "$";
      setSelectedItem({ x: parseInt(e.target.value), y: selectedItem.y });
    }
  };
  //handle item color selection
  const handleColorSelection = (e) => {
    if (selectedItem.y !== parseInt(e.target.value)) {
      if (quantity.current.value)
        totalPrice.current.textContent =
          itemGroupMatrix[parseInt(e.target.value)][0].price *
            parseInt(quantity.current.value) +
          "$";
      else totalPrice.current.value = 0 + "$";
      setSelectedItem({ x: 0, y: parseInt(e.target.value) });
    }
  };
  //handle quantity input change
  const handleQuantityChange = (e) => {
    //prevent the user from typing decimal number and numbers that are greater than the available quantity
    let numVal = e.target.value ? parseInt(e.target.value) : 0;
    if (numVal > itemGroupMatrix[selectedItem.y][selectedItem.x].quantity)
      numVal = itemGroupMatrix[selectedItem.y][selectedItem.x].quantity;
    e.target.value = numVal;
    //changing total price
    totalPrice.current.textContent =
      numVal * itemGroupMatrix[selectedItem.y][selectedItem.x].price + "$";
  };
  //the component
  return (
    <>
      {!itemGroupMatrix && <h3 className="text-center m-4">Item not found</h3>}
      {itemGroupMatrix && (
        <div>
          <h3
            className="text-center"
            style={{ marginBottom: "5rem", marginTop: "5rem" }}
          >
            {itemGroupMatrix[0][0].name}
          </h3>
          <div className="row justify-content-center m-4">
            <div
              className="carousel carousel-dark slide shadow p-0 rounded w-75"
              id="carousel"
              data-bs-ride="carousel"
              data-bs-interval="false"
            >
              <div className="carousel-indicators">
                {itemGroupMatrix[selectedItem.y][selectedItem.x].images.map(
                  (image, index) => (
                    <button
                      key={index}
                      data-bs-target="#carousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                    ></button>
                  )
                )}
              </div>
              <div className="carousel-inner">
                {itemGroupMatrix[selectedItem.y][selectedItem.x].images.map(
                  (image, index) => (
                    <div
                      key={index}
                      className={
                        index === 0 ? "carousel-item active" : "carousel-item"
                      }
                    >
                      <img
                        src={process.env.REACT_APP_BASE_URL + image}
                        className="rounded w-100"
                        alt={index}
                      />
                    </div>
                  )
                )}
              </div>
              <button
                className="carousel-control-prev"
                data-bs-target="#carousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button
                className="carousel-control-next"
                data-bs-target="#carousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>
          <form
            onSubmit={handleAddToCartClick}
            className="needs-validation"
            noValidate
          >
            <div className="row mx-4" style={{ marginTop: "5rem" }}>
              <div className="col">
                <div className="d-flex flex-wrap">
                  <span className="me-2 my-2">Color:</span>
                  {itemGroupMatrix.map((items, index) => (
                    <div
                      key={index}
                      className="form-check form-check-inline me-4 my-2"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id={"color" + index}
                        name="select-color"
                        value={index}
                        defaultChecked={index === selectedItem.y ? true : false}
                        onClick={handleColorSelection}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={"color" + index}
                      >
                        {items[0].color}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="my-2"></div>
                <div className="d-flex flex-wrap">
                  <span className="me-2 my-2">Size:</span>
                  {itemGroupMatrix[selectedItem.y].map((item, index) => (
                    <div
                      key={index}
                      className="form-check form-check-inline me-4 my-2"
                    >
                      <input
                        type="radio"
                        className="form-check-input"
                        value={index}
                        name="select-size"
                        id={"size" + index}
                        defaultChecked={index === selectedItem.x ? true : false}
                        onClick={handleSizeSelection}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={"size" + index}
                      >
                        {item.size}
                      </label>
                    </div>
                  ))}
                </div>
                <div className=" me-4 my-2 d-flex flex-nowrap">
                  <label className="me-2" htmlFor="quantity">
                    Quantity:{" "}
                  </label>
                  <div className="ms-2">
                    <input
                      type="number"
                      id="quantity"
                      className="form-control form-control-sm w-auto"
                      min="1"
                      max={
                        itemGroupMatrix[selectedItem.y][selectedItem.x].quantity
                      }
                      onChange={handleQuantityChange}
                      ref={quantity}
                      required
                    />
                    <div className="invalid-feedback">
                      Enter the needed quantities
                    </div>
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <div className="mt-2 mb-4 d-flex flex-wrap justify-content-end">
                  <div className="me-2 text-nowrap">Price of One Piece:</div>
                  <div>
                    {itemGroupMatrix[selectedItem.y][selectedItem.x].price}$
                  </div>
                </div>
                <div className="my-4 d-flex flex-wrap justify-content-end">
                  <div className="me-2">Total Price:</div>
                  <div ref={totalPrice}>0$</div>
                </div>

                <div className="my-4 d-flex flex-wrap justify-content-end">
                  <div className="me-2">Available Quantity:</div>
                  <div>
                    {itemGroupMatrix[selectedItem.y][selectedItem.x].quantity}
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <button type="submit" className="btn btn-primary m-4 w-auto">
                Add to cart
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="m-4 mt-0 alert alert-success d-none" ref={success}>
        success
      </div>
      <div className="m-4 mt-0 alert alert-danger d-none" ref={error}>
        error
      </div>
    </>
  );
};
export default ViewItem;
