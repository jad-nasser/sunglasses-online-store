import React, { useRef } from "react";
import axios from "axios";
const EditName = () => {
  const firstName = useRef(null);
  const lastName = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      try {
        await axios.patch(process.env.REACT_APP_BASE_URL + "user/update_user", {
          first_name: firstName.current.value,
          last_name: lastName.current.value,
        });
        success.current.textContent = "Name successfully changed";
        success.current.classList.remove("d-none");
      } catch (err) {
        error.current.childNodes[0].textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    }
  };
  //handle error alert close button click
  const handleErrorAlertCloseClick = () => {
    error.current.classList.add("d-none");
  };
  //The component
  return (
    <div className="container-fluid">
      <div className="container-form-width text-center mt-5 mx-auto border-0">
        <h3 className="mb-5">Change Your Name</h3>
        <form
          className="needs-validation row row-cols-1 g-3 mb-3"
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="col">
            <input
              type="text"
              placeholder="New First Name"
              ref={firstName}
              className="input-width form-control mx-auto"
              required
            />
            <div className="invalid-feedback input-width text-start mx-auto">
              Enter new first name
            </div>
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="New Last Name"
              ref={lastName}
              className="input-width form-control mx-auto"
              required
            />
            <div className="invalid-feedback input-width text-start mx-auto">
              Enter new last name
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mt-2">
              Change Name
            </button>
          </div>
        </form>
        <div className="alert alert-success text-start d-none" ref={success}>
          success
        </div>
        <div
          className="alert alert-danger alert-dismissible text-start d-none"
          ref={error}
        >
          <div>error</div>
          <button
            className="btn-close"
            onClick={handleErrorAlertCloseClick}
          ></button>
        </div>
      </div>
    </div>
  );
};
export default EditName;
