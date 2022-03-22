import React, { useRef } from "react";
import axios from "axios";
const EditEmail = () => {
  const email = useRef(null);
  const emailError = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    emailError.current.classList.remove("d-none");
    if (e.target.checkValidity()) {
      try {
        await axios.patch(process.env.REACT_APP_BASE_URL + "user/update_user", {
          email: email.current.value,
        });
        success.current.textContent = "Email address successfully changed";
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
  //email change handler
  const handleEmailChange = (e) => {
    if (e.target.validity.valid) emailError.current.textContent = "";
    else if (e.target.validity.valueMissing)
      emailError.current.textContent = "Enter new email address";
    else if (
      e.target.validity.typeMismatch ||
      e.target.validity.patternMismatch
    )
      emailError.current.textContent = "Enter a valid email address";
  };
  //The component
  return (
    <div className="container-fluid">
      <div className="container-form-width text-center mt-5 mx-auto border-0">
        <h3 className="mb-5">Change Your Email</h3>
        <form
          className="needs-validation row row-cols-1 g-3 mb-3"
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="col">
            <input
              type="email"
              placeholder="New Email Address"
              ref={email}
              onChange={handleEmailChange}
              className="input-width form-control mx-auto"
              required
              pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
            />
            <div
              className="input-width text-start mx-auto text-danger d-none"
              ref={emailError}
            >
              Enter new email address
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mt-2">
              Change Email
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
export default EditEmail;
