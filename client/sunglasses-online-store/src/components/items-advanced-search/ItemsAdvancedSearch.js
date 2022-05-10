import React, { useRef } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
const ItemsAdvancedSearch = () => {
  const brand = useRef(null);
  const name = useRef(null);
  const color = useRef(null);
  const size = useRef(null);
  const price = useRef(null);
  const quantity = useRef(null);
  const timesOrdered = useRef(null);
  const selectedSort = useRef("alphabetical");
  const navigate = useNavigate();
  //handle sort selection radio buttons
  const handleSortSelection = (e) => {
    selectedSort.current = e.target.value;
  };
  //handle search click button
  const handleSearchClick = () => {
    let params = {};
    if (brand.current.value) params.brand = brand.current.value;
    if (name.current.value) params.name = name.current.value;
    if (color.current.value) params.color = color.current.value;
    if (size.current.value) params.size = size.current.value;
    if (price.current.value) params.price = price.current.value;
    if (quantity.current.value) params.quantity = quantity.current.value;
    if (timesOrdered.current.value)
      params.times_ordered = timesOrdered.current.value;
    params.sort_by = selectedSort.current;
    navigate({
      pathname: "/seller/items",
      search: createSearchParams(params).toString(),
    });
  };
  //the component
  return (
    <div>
      <h3 className="m-5 text-center">Items Advanced Search</h3>
      <div className="mx-auto mb-4 p-4 d-flex flex-wrap justify-content-center container-form-width">
        <input
          type="text"
          placeholder="Brand"
          className="form-control input-width mb-4"
          ref={brand}
        />
        <input
          type="text"
          placeholder="Name"
          className="form-control input-width mb-4"
          ref={name}
        />
        <input
          type="text"
          placeholder="Color"
          className="form-control input-width mb-4"
          ref={color}
        />
        <input
          type="text"
          placeholder="Size"
          className="form-control input-width mb-4"
          ref={size}
        />
        <input
          type="number"
          placeholder="Price"
          className="form-control input-width mb-4"
          ref={price}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="form-control input-width mb-4"
          ref={quantity}
        />
        <input
          type="number"
          placeholder="Times Ordered"
          className="form-control input-width mb-4"
          ref={timesOrdered}
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
            id="most-ordered"
            value="most-ordered"
            className="form-check-input"
            onClick={handleSortSelection}
          />
          <label className="form-check-label" htmlFor="most-ordered">
            Sort by most ordered
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
export default ItemsAdvancedSearch;
