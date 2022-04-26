import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import countries from "../../data";
const OrdersAdvancedSearch = () => {
  const brand = useRef(null);
  const name = useRef(null);
  const color = useRef(null);
  const size = useRef(null);
  const shipmentID = useRef(null);
  const destinationCountry = useRef(null);
  const status = useRef(null);
  const date = useRef(null);
  const selectedSort = useRef("alphabetical");
  const navigate = useNavigate();
  //handle sort selection radio buttons
  const handleSortSelection = (e) => {
    selectedSort.current = e.target.value;
  };
  //handle search click button
  const handleSearchClick = () => {
    let url = "/seller/items";
    if (brand.current.value) url = url + "?brand=" + brand.current.value;
    if (name.current.value) url = url + "?name=" + name.current.value;
    if (color.current.value) url = url + "?color=" + color.current.value;
    if (size.current.value) url = url + "?size=" + size.current.value;
    if (shipmentID.current.value)
      url = url + "?shipment_id=" + shipmentID.current.value;
    if (destinationCountry.current.value)
      url = url + "?destination_country=" + destinationCountry.current.value;
    if (status.current.value) url = url + "?status=" + status.current.value;
    if (date.current.value) url = url + "?date_time=" + date.current.value;
    url = url + "?sort_by=" + selectedSort.current;
    navigate(url);
  };
  //the component
  return (
    <div>
      <h3 className="m-5 text-center">Orders Advanced Search</h3>
      <div className="mx-auto mb-4 p-4 d-flex flex-wrap justify-content-center container-form-width">
        <input
          type="text"
          placeholder="Item Brand"
          className="form-control input-width mb-4"
          ref={brand}
        />
        <input
          type="text"
          placeholder="Item Name"
          className="form-control input-width mb-4"
          ref={name}
        />
        <input
          type="text"
          placeholder="Item Color"
          className="form-control input-width mb-4"
          ref={color}
        />
        <input
          type="text"
          placeholder="Item Size"
          className="form-control input-width mb-4"
          ref={size}
        />
        <input
          type="text"
          placeholder="Order Shipment ID"
          className="form-control input-width mb-4"
          ref={shipmentID}
        />
        <input
          type="text"
          placeholder="Order Status"
          className="form-control input-width mb-4"
          ref={status}
        />
        <select
          className="form-select input-width mb-4"
          defaultValue=""
          ref={destinationCountry}
        >
          <option value="">Order Destination Country</option>
          {countries.map((country, index) => (
            <option value={country.name} key={index}>
              {country.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="form-control input-width mb-4"
          ref={date}
        />
        <div className="form-check input-width">
          <input
            type="radio"
            name="sort"
            id="alphabetical"
            value="alphabetical"
            className="form-check-input"
            onClick={handleSortSelection}
            defaultChecked
          />
          <label className="form-check-label" htmlFor="alphabetical">
            Sort by alphabetical order
          </label>
        </div>
        <div className="form-check input-width">
          <input
            type="radio"
            name="sort"
            id="lowest-price"
            value="lowest-price"
            className="form-check-input"
            onClick={handleSortSelection}
          />
          <label className="form-check-label" htmlFor="lowest-price">
            Sort by lowest price
          </label>
        </div>
        <div className="form-check input-width">
          <input
            type="radio"
            name="sort"
            id="highest-price"
            value="highest-price"
            className="form-check-input"
            onClick={handleSortSelection}
          />
          <label className="form-check-label" htmlFor="highest-price">
            Sort by highest price
          </label>
        </div>
        <div className="form-check input-width mb-4">
          <input
            type="radio"
            name="sort"
            id="newest"
            value="newest"
            className="form-check-input"
            onClick={handleSortSelection}
          />
          <label className="form-check-label" htmlFor="newest">
            Sort by newest
          </label>
        </div>
        <div className="row justify-content-center w-100">
          <button
            className="btn btn-primary w-auto"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrdersAdvancedSearch;
