//importing modules
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//this navbar is for the users that are not logged in to the system
const DefaultNavbar = (props) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  //getting all the brands from the database
  useEffect(() => {
    const client = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    });
    const getBrandsFromDB = async () => {
      let res = await client.get("item/get_all_brands");
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
    else navigate("/home?brand=" + e.target.value);
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
    let url = "/home";
    if (selectedBrand !== "") url = url + "?brand=" + selectedBrand;
    if (searchInput !== "") url = url + "?name=" + searchInput;
    navigate(url);
  };
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid flex-md-plus-nowrap">
        <Link
          className="navbar-brand text-primary me-5 mb-1 mb-md-plus-0"
          to="/home"
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
              <option value="">All Brands</option>
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
                  defaultChecked
                />
                <label className="form-check-label" htmlFor="alphabetical">
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
                />
                <label className="form-check-label" htmlFor="lowest-price">
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
                />
                <label className="form-check-label" htmlFor="highest-price">
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
                />
                <label className="form-check-label" htmlFor="most-ordered">
                  Sort by most ordered
                </label>
              </div>
            </div>
          </div>
          <Link
            type="button"
            className="btn white-text-btn btn-sm me-2 ms-2 ms-md-plus-5"
            to="/cart"
          >
            <i className="fas fa-shopping-cart"></i>
          </Link>
          <Link
            type="button"
            className="btn btn-primary text-nowrap btn-sm"
            to="/sign_in"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default DefaultNavbar;
