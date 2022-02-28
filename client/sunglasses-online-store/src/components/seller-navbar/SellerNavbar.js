//importing modules
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//this navbar is for the seller
const SellerNavbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [itemsOrdersRadio, setItemsOrdersRadio] = useState("");
  const navigate = useNavigate();
  //handling search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  //handling search button click
  const handleSearchClick = () => {
    let url = "/seller/" + itemsOrdersRadio;
    if (searchInput !== "") url = url + "?name=" + searchInput;
    navigate(url);
  };
  //handle advanced search button click
  const handleAdvancedSearchClick = () => {
    let url =
      "/seller/" +
      itemsOrdersRadio +
      "/" +
      itemsOrdersRadio +
      "_advanced_search";
    navigate(url);
  };
  //handle items-orders radio buttons select
  const handleItemsOrdersChange = (e) => {
    setItemsOrdersRadio(e.target.value);
    navigate("/seller/" + e.target.value);
  };
  //handle sign out button click
  const handleSignOutClick = async () => {
    let res = await axios.delete(
      process.env.REACT_APP_BASE_URL + "user/sign_out"
    );
    if (res.status === 200) navigate("/home");
  };
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid flex-md-plus-nowrap">
        <div className="navbar-brand text-primary me-5 mb-1 mb-md-plus-0">
          Sunglasses Online Store
        </div>
        <div className="d-flex flex-grow-1 mb-1 mb-md-plus-0">
          <div className="input-group input-group-sm me-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearchClick}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          <button
            type="button"
            className="btn white-text-btn btn-sm me-2"
            onClick={handleAdvancedSearchClick}
          >
            <i className="fas fa-sliders-h"></i>
          </button>
          <div className="form-check text-light me-2 pt-1">
            <input
              type="radio"
              className="form-check-input"
              name="items-orders"
              value="items"
              id="items-radio"
              onClick={handleItemsOrdersChange}
              defaultChecked
            />
            <label className="form-check-label" htmlFor="items-radio">
              <small>Items</small>
            </label>
          </div>
          <div className="form-check text-light pt-1">
            <input
              type="radio"
              className="form-check-input"
              id="orders-radio"
              name="items-orders"
              value="orders"
              onClick={handleItemsOrdersChange}
            />
            <label className="form-check-label" htmlFor="orders-radio">
              <small>Orders</small>
            </label>
          </div>
          <button
            type="button"
            className="btn btn-primary text-nowrap btn-sm ms-5"
            onClick={handleSignOutClick}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
export default SellerNavbar;
