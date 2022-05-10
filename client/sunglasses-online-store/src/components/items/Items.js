import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Item from "../item/Item";
import ItemUpdator from "../item-updator/ItemUpdator";
import { Modal } from "bootstrap";
const Items = (props) => {
  const [items, setItems] = useState(null);
  const error = useRef(null);
  const modal = useRef(null);
  const modalImage = useRef(null);
  let modalInstance = null;
  useEffect(() => {
    //compare functions callbacks for sort()
    function sortByAlphabetical(a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    }
    function sortByLowestPrice(a, b) {
      return a.price - b.price;
    }
    function sortByHighestPrice(a, b) {
      return b.price - a.price;
    }
    function sortByMostOrdered(a, b) {
      return b.times_ordered - a.times_ordered;
    }
    //getting the items from the database
    const getItems = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BASE_URL + "item/get_items",
          { params: props.requestQuery, withCredentials: true }
        );
        //sorting the items based on the request
        if (!props.sortBy || props.sortBy === "alphabetical")
          res.data.sort(sortByAlphabetical);
        else if (props.sortBy === "lowest-price")
          res.data.sort(sortByLowestPrice);
        else if (props.sortBy === "highest-price")
          res.data.sort(sortByHighestPrice);
        else if (props.sortBy === "most-ordered")
          res.data.sort(sortByMostOrdered);
        setItems(res.data);
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    };
    getItems();
  }, [props.requestQuery, props.sortBy]);
  //this function is triggered by the Item component in the Items component to view the clicked image
  const viewImage = (e) => {
    modalInstance = new Modal(modal.current, {});
    modalImage.current.src = e.target.src;
    modalImage.current.alt = e.target.alt;
    modalInstance.show();
  };
  //the component
  return (
    <div>
      <div className="modal" ref={modal}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content bg-transparent border-0">
            <div className="modal-header border-0">
              <button
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row justify-content-center">
                <div className="col d-flex justify-content-center">
                  <img
                    src="no-image.jpg"
                    alt="nothing"
                    className="rounded"
                    style={{
                      maxHeight: "80%",
                      maxWidth: "100%",
                    }}
                    ref={modalImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-center m-4">Sunglasses</h3>
      <div className="m-2 text-center">Update Items</div>
      <ItemUpdator requestQuery={props.requestQuery} />
      <div className="row justify-content-center">
        <Link className="btn btn-primary w-auto mb-4" to="/seller/add_item">
          Add New Item
        </Link>
      </div>
      <div className="alert alert-danger mx-4 d-none" ref={error}>
        error
      </div>
      {items &&
        items.map((item, index) => (
          <Item item={item} key={index} viewImage={viewImage} />
        ))}
    </div>
  );
};
export default Items;
