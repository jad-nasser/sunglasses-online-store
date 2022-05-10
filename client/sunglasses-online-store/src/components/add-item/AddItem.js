import React, { useRef } from "react";
import axios from "axios";
import FormData from "form-data";
const AddItem = (props) => {
  const name = useRef(null);
  const brand = useRef(null);
  const color = useRef(null);
  const size = useRef(null);
  const price = useRef(null);
  const quantity = useRef(null);
  const images = useRef(null);
  const success = useRef(null);
  const error = useRef(null);
  //handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      //the code under condition "props.test" will run only during testing because appending files not
      //working in react testing library but it works in actual enviroment
      if (props.test) {
        //adding the new item to the database
        try {
          await axios.post(
            process.env.REACT_APP_BASE_URL + "item/create_item",
            {}
          );
          success.current.textContent = "Item successfully added";
          success.current.classList.remove("d-none");
          success.current.scrollIntoView();
          await new Promise((res) => setTimeout(res, 2000));
          success.current.classList.add("d-none");
        } catch (err) {
          error.current.textContent = "Error: " + err.response.data;
          error.current.classList.remove("d-none");
          error.current.scrollIntoView();
          await new Promise((res) => setTimeout(res, 2000));
          error.current.classList.add("d-none");
        }
      }
      //code for actual enviroment
      else {
        //adding the new item to the database
        try {
          const formData = new FormData();
          formData.append("name", name.current.value);
          formData.append("brand", brand.current.value);
          formData.append("color", color.current.value);
          formData.append("size", size.current.value);
          formData.append("price", Number(price.current.value));
          formData.append("quantity", parseInt(quantity.current.value));
          for (let i = 0; i < images.current.files.length; i++) {
            formData.append(
              "ItemImage",
              images.current.files[i],
              images.current.files[i].name
            );
          }
          await axios.post(
            process.env.REACT_APP_BASE_URL + "item/create_item",
            formData,
            { withCredentials: true }
          );
          success.current.textContent = "Item successfully added";
          success.current.classList.remove("d-none");
          success.current.scrollIntoView();
          await new Promise((res) => setTimeout(res, 2000));
          success.current.classList.add("d-none");
        } catch (err) {
          error.current.textContent = "Error: " + err.response.data;
          error.current.classList.remove("d-none");
          error.current.scrollIntoView();
          await new Promise((res) => setTimeout(res, 2000));
          error.current.classList.add("d-none");
        }
      }
    }
  };
  //the component
  return (
    <div>
      <h3 className="text-center m-4">Add New Sunglasses Item</h3>
      <form
        className="container-form-width my-4 mx-auto p-4 needs-validation"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className="d-flex flex-wrap justify-content-center">
          <div className="input-width mb-4 mt-4">
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              ref={name}
              required
            />
            <div className="invalid-feedback">Enter item name</div>
          </div>
          <div className="input-width mb-4">
            <input
              className="form-control"
              type="text"
              placeholder="Brand"
              ref={brand}
              required
            />
            <div className="invalid-feedback">Enter item brand</div>
          </div>
          <div className="input-width mb-4">
            <input
              className="form-control"
              type="text"
              placeholder="Color"
              ref={color}
              required
            />
            <div className="invalid-feedback">Enter item color</div>
          </div>
          <div className="input-width mb-4">
            <input
              className="form-control"
              type="text"
              placeholder="Size"
              ref={size}
              required
            />
            <div className="invalid-feedback">Enter item size</div>
          </div>
          <div className="d-flex justify-content-between input-width">
            <div style={{ width: "100px" }} className="mb-4">
              <input
                className="form-control"
                type="number"
                placeholder="Price"
                ref={price}
                min="0"
                required
              />
              <div className="invalid-feedback">Enter item price</div>
            </div>
            <div style={{ width: "100px" }} className="mb-4">
              <input
                className="form-control"
                type="number"
                placeholder="Quantity"
                ref={quantity}
                min="0"
                step="1"
                required
              />
              <div className="invalid-feedback">Enter item quantity</div>
            </div>
          </div>
          <div className="input-width mb-4">
            <label htmlFor="images" className="form-label">
              Images:
            </label>
            <input
              type="file"
              id="images"
              multiple
              required
              className="form-control"
              accept=".jpg,.jpeg,.png"
              data-testid="images-uploader"
              ref={images}
            />
            <div className="invalid-feedback">Select item images</div>
          </div>
        </div>
        <div className="row justify-content-center">
          <button type="submit" className="w-auto btn btn-primary">
            Add New Item
          </button>
        </div>
      </form>
      <div
        className="alert alert-success mb-4 mx-auto d-none"
        style={{ maxWidth: "30rem" }}
        ref={success}
      >
        success
      </div>
      <div
        className="alert alert-danger mb-4 mx-auto d-none"
        style={{ maxWidth: "30rem" }}
        ref={error}
      >
        error
      </div>
    </div>
  );
};
export default AddItem;
