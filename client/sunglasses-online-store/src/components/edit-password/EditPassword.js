import React, { useRef } from "react";
import axios from "axios";
const EditPassword = () => {
  const password = useRef(null);
  const oldPassword = useRef(null);
  const confirmPassword = useRef(null);
  const passwordError = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    passwordError.current.classList.remove("d-none");
    if (e.target.checkValidity()) {
      try {
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "user/check_password",
          { password: oldPassword.current.value }
        );
        if (res.data.check_password) {
          await axios.patch(
            process.env.REACT_APP_BASE_URL + "user/update_user",
            {
              password: password.current.value,
            }
          );
          success.current.textContent = "Password successfully changed";
          success.current.classList.remove("d-none");
        } else {
          error.current.childNodes[0].textContent =
            "Error: Old password is not correct";
          error.current.classList.remove("d-none");
        }
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
  const handlePasswordChange = (e) => {
    confirmPassword.current.pattern = e.target.value;
    if (e.target.validity.valid) passwordError.current.textContent = "";
    else if (e.target.validity.valueMissing)
      passwordError.current.textContent = "Enter new password";
    else if (
      e.target.validity.typeMismatch ||
      e.target.validity.patternMismatch
    )
      passwordError.current.textContent =
        "Password length should be at least 8 elements with at least one lowercase letter, uppercase letter, digit, and special character from these: @$!%*?&";
  };
  //The component
  return (
    <div className="container-fluid">
      <div className="container-form-width text-center mt-5 mx-auto border-0">
        <h3 className="mb-5">Change Your Password</h3>
        <form
          className="needs-validation row row-cols-1 g-3 mb-3"
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="col">
            <input
              type="password"
              placeholder="Old password"
              ref={oldPassword}
              className="input-width form-control mx-auto"
              required
            />
            <div className="invalid-feedback input-width text-start mx-auto">
              Enter old password
            </div>
          </div>
          <div className="col">
            <input
              type="password"
              placeholder="New password"
              ref={password}
              onChange={handlePasswordChange}
              className="input-width form-control mx-auto"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            />
            <div
              className="input-width text-start mx-auto text-danger d-none"
              ref={passwordError}
            >
              Enter new password
            </div>
          </div>
          <div className="col">
            <input
              type="password"
              placeholder="Confirm password"
              ref={confirmPassword}
              className="input-width form-control mx-auto"
              required
            />
            <div className="input-width text-start mx-auto invalid-feedback">
              Confirm your password
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mt-2">
              Change Password
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
export default EditPassword;
