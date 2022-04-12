import React, { useRef } from "react";
import axios from "axios";
import FormData from "form-data";
const ItemUpdator = (props) => {
  const brand = useRef(null);
  const name = useRef(null);
  const color = useRef(null);
  const size = useRef(null);
  const quantity = useRef(null);
  const price = useRef(null);
  const images = useRef(null);
  const updateButton = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //method for updating the items in the server
  const updateItems = async (e) => {
    e.preventDefault();
    //collecting the data from the inputs
    let updateInfo = {};
    let files = [];
    if (brand.current.value) updateInfo.brand = brand.current.value;
    if (name.current.value) updateInfo.name = name.current.value;
    if (color.current.value) updateInfo.color = color.current.value;
    if (size.current.value) updateInfo.size = size.current.value;
    if (!isNaN(quantity.current.value))
      updateInfo.quantity = quantity.current.value;
    if (!isNaN(price.current.value)) updateInfo.price = price.current.value;
    if (images.current.files.length !== 0) files = images.current.files;
    //sending the data to the database
    try {
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("search", props.requestQuery);
        formData.append("update", updateInfo);
        for (let i = 0; i < files.length; i++) {
          formData.append("ItemImage", files[i], files[i].name);
        }
        await axios.patch(
          process.env.REACT_APP_BASE_URL + "item/update_items",
          formData
        );
      } else
        await axios.patch(
          process.env.REACT_APP_BASE_URL + "item/update_items",
          { search: props.requestQuery, update: updateInfo }
        );
      success.current.childNodes[0].textContent = "Items successfully updated";
      success.current.classList.remove("d-none");
    } catch (err) {
      error.current.childNodes[0].textContent = "Error: " + err.response.data;
      error.current.classList.remove("d-none");
    }
  };
  //this method is triggred when the success alert close button is clicked in an alert
  const handleSuccessCloseClick = () => {
    success.current.classList.add("d-none");
  };
  //this method is triggred when the error alert close button is clicked in an alert
  const handleErrorCloseClick = () => {
    error.current.classList.add("d-none");
  };
  //this method is triggered when an input is changed
  //when an input have a value the update button is enabled
  //when all the inputs have no value the update button will be disabled
  const handleInputChange = (e) => {
    if (e.target.value || (e.target.files && e.target.files.length !== 0)) {
      updateButton.current.disabled = false;
    } else {
      if (
        !brand.current.value &&
        !name.current.value &&
        !color.current.value &&
        !size.current.value &&
        !quantity.current.value &&
        !price.current.value &&
        images.current.files.length === 0
      ) {
        updateButton.current.disabled = true;
      }
    }
  };
  return (
    <div className="w-75 border mx-auto my-4">
      <form onSubmit={updateItems}>
        <div className="d-flex flex-wrap mt-2">
          <input
            type="text"
            placeholder="Change Name"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={name}
          />
          <input
            type="text"
            placeholder="Change Brand"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={brand}
          />
          <input
            type="text"
            placeholder="Change Color"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={color}
          />
          <input
            type="text"
            placeholder="Change Size"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={size}
          />
          <input
            type="number"
            placeholder="Change Quantity"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={quantity}
          />
          <input
            type="number"
            placeholder="Change Price"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={price}
          />
        </div>
        <div className="m-2">
          <label htmlFor="files" className="form-lable mb-1 ms-1">
            Change Images
          </label>
          <input
            type="file"
            id="files"
            className="form-control"
            onChange={handleInputChange}
            ref={images}
            accept=".jpg,.jpeg,.png"
            multiple
          />
        </div>
        <div className="row justify-content-center mb-2">
          <button
            type="submit"
            className="btn btn-warning w-auto m-2"
            ref={updateButton}
            disabled
          >
            Update Items
          </button>
        </div>
      </form>
      <div
        className="alert alert-success alert-dismissible mx-2 d-none"
        ref={success}
      >
        <div>success</div>
        <button
          className="btn-close"
          onClick={handleSuccessCloseClick}
        ></button>
      </div>
      <div
        className="alert alert-danger alert-dismissible mx-2 d-none"
        ref={error}
      >
        <div>error</div>
        <div className="btn-close" onClick={handleErrorCloseClick}></div>
      </div>
    </div>
  );
};
export default ItemUpdator;
