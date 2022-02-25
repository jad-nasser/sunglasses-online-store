//importing modules
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//this navbar is for the users that are logged in to the system
const CustomerNavbar = (props) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  //getting all the brands from the database
  useEffect(() => {
    const getBrandsFromDB = async () => {
      let res = await axios.get(
        process.env.REACT_APP_BASE_URL + "item/get_all_brands"
      );
      if (!res || !res.data || !res.data.brands) return;
      setBrands(res.data.brands);
      return;
    };
    getBrandsFromDB();
  }, []);
  //making a list of brands for <select>
  const brandsList = brands.map((brand, index) => (
    <option key={index} value={brand}>
      {brand}
    </option>
  ));
  //handling brand selection event of the <select>
  const handleBrandSelection = (e) => {
    setSelectedBrand(e.target.value);
    if (e.target.value === "") navigate("/home");
    else navigate("/user/home?brand=" + e.target.value);
  };
  //handling search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  //handling sort change
  const handleSortChange = (e) => {
    props.changeSort(e.target.value);
  };
  //handling search button click
  const handleSearchClick = () => {
    let url = "/user/home";
    if (selectedBrand !== "") url = url + "?brand=" + selectedBrand;
    if (searchInput !== "") url = url + "?name=" + searchInput;
    navigate(url);
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
        <Link
          className="navbar-brand text-primary me-5 mb-1 mb-md-plus-0"
          to="/user/home"
        >
          Sunglasses Online Store
        </Link>
        <div className="d-flex flex-grow-1 mb-1 mb-md-plus-0">
          <div className="input-group input-group-sm me-2">
            <select
              className="form-select flex-grow-0 w-auto"
              onChange={handleBrandSelection}
              value={selectedBrand}
            >
              <option value="" selected>
                All Brands
              </option>
              {brandsList}
            </select>
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
          <div className="dropdown">
            <button
              type="button"
              className="btn white-text-btn btn-sm dropdown-toggle"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
            >
              <i className="fas fa-sliders-h"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-dark user-select-none px-2 text-nowrap">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="sort-by"
                  value="alphabetical"
                  id="alphabetical"
                  onClick={handleSortChange}
                  checked
                />
                <label className="form-check-label" for="alphabetical">
                  Sort by alphabetical order
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="sort-by"
                  id="lowest-price"
                  value="lowest-price"
                  onClick={handleSortChange}
                  checked
                />
                <label className="form-check-label" for="lowest-price">
                  Sort by lowest price
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="sort-by"
                  id="highest-price"
                  value="highest-price"
                  onClick={handleSortChange}
                  checked
                />
                <label className="form-check-label" for="highest-price">
                  Sort by highest price
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="sort-by"
                  id="most-ordered"
                  value="most-ordered"
                  onClick={handleSortChange}
                  checked
                />
                <label className="form-check-label" for="most-ordered">
                  Sort by most ordered
                </label>
              </div>
            </div>
          </div>
          <Link
            type="button"
            className="btn white-text-btn btn-sm me-1 me-md-plus-2 ms-2 ms-md-plus-5 px-1 px-md-plus-2"
            to="/user/cart"
          >
            <i className="fas fa-shopping-cart"></i>
          </Link>
          <Link
            type="button"
            className="btn white-text-btn btn-sm me-1 me-md-plus-2 px-1 px-md-plus-2"
            to="/user/account_settings"
          >
            <i className="fa fa-solid fa-gear"></i>
          </Link>
          <button
            type="button"
            className="btn btn-primary text-nowrap btn-sm"
            onClick={handleSignOutClick}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
export default CustomerNavbar;
