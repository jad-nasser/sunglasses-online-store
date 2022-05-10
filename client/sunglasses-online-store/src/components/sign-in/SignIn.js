import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertShowHide, setAlertShowHide] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("Error:");
  const [formValidation, setFormValidation] = useState("");
  //handle email input change function
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };
  //handle password input change function
  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
  };
  //handle form submit function
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormValidation("was-validated");
    if (e.target.checkValidity()) {
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}user/user_login`,
          {
            email: email,
            password: password,
          },
          { withCredentials: true }
        );
        if (res.status === 200) {
          window.location.reload();
        }
      } catch (err) {
        setAlertMessage("Error: " + err.response.data);
        setAlertShowHide("d-block");
      }
    }
  };
  //handle alert close button click function
  const handleAlertCloseClick = () => {
    setAlertShowHide("d-none");
  };
  return (
    <div className="container-fluid text-center">
      <h3 className="my-5">Welcome to Sunglasses Online Store</h3>
      <div className="container container-form-width mb-5">
        <form
          className={"row g-3 mt-3 mb-5 needs-validation " + formValidation}
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="col-12">
            <h4>Sign In</h4>
          </div>
          <div className="col-12">
            <div className="row justify-content-center">
              <div className="col-auto">
                <input
                  className="form-control w-auto"
                  type="email"
                  value={email}
                  onChange={handleEmailInputChange}
                  placeholder="Email"
                  required
                />
                <div className="invalid-feedback text-start">
                  Enter your email address
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row justify-content-center">
              <div className="col-auto">
                <input
                  className="form-control w-auto"
                  type="password"
                  value={password}
                  onChange={handlePasswordInputChange}
                  placeholder="Password"
                  required
                />
                <div className="invalid-feedback text-start">
                  Enter your password
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <button className="btn btn-primary mb-3" type="submit">
              Sign In
            </button>
            <div
              className={
                "alert alert-danger alert-dismissible fade show " +
                alertShowHide
              }
              role="alert"
            >
              <div>{alertMessage}</div>
              <button
                type="button"
                className="btn-close"
                onClick={handleAlertCloseClick}
              ></button>
            </div>
          </div>
        </form>
        <div className="mb-3">New to Sunglasses Online Store?</div>
        <Link className="btn btn-success mb-3" to="/sign_up">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
export default SignIn;
