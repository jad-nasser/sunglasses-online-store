import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import countries from "../../data";
const SignUp = () => {
  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const phone = useRef(null);
  const phoneExtension = useRef(null);
  const country = useRef(null);
  const state = useRef(null);
  const city = useRef(null);
  const street = useRef(null);
  const aptBldg = useRef(null);
  const zip = useRef(null);
  const form = useRef(null);
  const errorAlert = useRef(null);
  const successAlert = useRef(null);
  const emailError = useRef(null);
  const passwordError = useRef(null);
  const navigate = useNavigate();
  //creating phone codes options
  const phoneCodesOptions = countries.map((countryValue, index) => (
    <option key={index} value={countryValue.code}>
      {countryValue.name + " " + countryValue.code}
    </option>
  ));
  //creating countries options
  const countriesOptions = countries.map((countryValue, index) => (
    <option value={countryValue.name} key={index}>
      {countryValue.name}
    </option>
  ));
  //handle email input change function
  const handleEmailInputChange = (e) => {
    if (e.target.validity.valid) emailError.current.textContent = "";
    else if (e.target.validity.valueMissing)
      emailError.current.textContent = "Enter your email address";
    else if (e.target.validity.patternMismatch)
      emailError.current.textContent = "Enter a valid email address";
  };
  //handle password input change function
  const handlePasswordInputChange = (e) => {
    confirmPassword.current.pattern = e.target.value;
    if (e.target.validity.valid) passwordError.current.textContent = "";
    else if (e.target.validity.valueMissing)
      passwordError.current.textContent = "Enter your account password";
    else if (e.target.validity.patternMismatch)
      passwordError.current.textContent =
        "Password length should be at least 8 elements with at least one lowercase letter, uppercase letter, digit, and special character from these: @$!%*?&";
  };
  //handle form submit function
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.current.classList.add("was-validated");
    emailError.current.classList.remove("d-none");
    passwordError.current.classList.remove("d-none");
    if (e.target.checkValidity()) {
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}user/create_user`,
          {
            email: email.current.value,
            password: password.current.value,
            phone: phoneExtension.current.value + phone.current.value,
            first_name: firstName.current.value,
            last_name: lastName.current.value,
            country: country.current.value,
            city: city.current.value,
            street: street.current.value,
            state_province_county: state.current.value,
            zip_code: zip.current.value,
            bldg_apt_address: aptBldg.current.value,
          }
        );
        if (res.status === 200) {
          successAlert.current.textContent = "Account successfully created";
          successAlert.current.classList.remove("d-none");
          navigate("/sign_in");
        }
      } catch (err) {
        errorAlert.current.childNodes[0].textContent =
          "Error: " + err.response.data;
        errorAlert.current.classList.remove("d-none");
      }
    }
  };
  //handle alert close button click function
  const handleErrorAlertCloseClick = () => {
    errorAlert.current.classList.add("d-none");
  };
  return (
    <div className="container-fluid text-center">
      <h3 className="my-5">Sign Up</h3>
      <div className="container container-2cols-form-width mb-5">
        <form
          ref={form}
          className="mt-3 needs-validation"
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="mb-2">Contact Info</div>
          <div className="row row-cols-1 row-cols-md-2 g-3 justify-content-evenly mb-4">
            <div className="col w-auto">
              <input
                ref={firstName}
                className="form-control input-width needs-validation was-validated"
                type="text"
                placeholder="First Name"
                required
              />
              <div className="invalid-feedback text-start">
                Enter your first name
              </div>
            </div>
            <div className="col w-auto">
              <input
                ref={lastName}
                className="form-control input-width"
                type="text"
                placeholder="Last Name"
                required
              />
              <div className="invalid-feedback text-start">
                Enter your last name
              </div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="email"
                ref={email}
                onChange={handleEmailInputChange}
                placeholder="Email"
                pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
                required
              />
              <div
                ref={emailError}
                className="text-danger text-start small mt-1 d-none"
              >
                Enter your email address
              </div>
            </div>
            <div className="col w-auto">
              <div className="input-group has-validation input-width">
                <select
                  className="form-select flex-grow-0 phone-code-input-width"
                  defaultValue=""
                  ref={phoneExtension}
                  data-testid="code"
                  required
                >
                  <option value="">Code</option>
                  {phoneCodesOptions}
                </select>
                <input
                  className="form-control"
                  type="number"
                  ref={phone}
                  placeholder="Phone"
                  required
                />
                <div className="invalid-feedback text-start">
                  Enter your phone number
                </div>
              </div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="password"
                ref={password}
                onChange={handlePasswordInputChange}
                placeholder="Password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                required
              />
              <div
                ref={passwordError}
                className="text-danger text-start input-width small mt-1 d-none"
              >
                Enter your account password
              </div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="password"
                ref={confirmPassword}
                placeholder="Confirm Password"
                pattern=""
                required
              />
              <div className="invalid-feedback text-start">
                Confirm your account password
              </div>
            </div>
          </div>
          <div className="mb-2">Order Destination Address</div>
          <div className="row row-cols-1 row-cols-md-2 g-3  justify-content-evenly mb-4">
            <div className="col w-auto">
              <select
                className="form-select input-width"
                defaultValue=""
                ref={country}
                data-testid="country"
                required
              >
                <option value="">Country</option>
                {countriesOptions}
              </select>
              <div className="invalid-feedback text-start">Select country</div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="text"
                ref={state}
                placeholder="State / Province / County"
                required
              />
              <div className="invalid-feedback text-start">
                Enter state, province, or county name
              </div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="text"
                ref={city}
                placeholder="City"
                required
              />
              <div className="invalid-feedback text-start">Enter city name</div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="text"
                ref={street}
                placeholder="Street"
                required
              />
              <div className="invalid-feedback text-start">
                Enter street name
              </div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="text"
                ref={aptBldg}
                placeholder="Apt / Bldg and Floor"
                required
              />
              <div className="invalid-feedback text-start">
                Enter appartment / bldg and floor
              </div>
            </div>
            <div className="col w-auto">
              <input
                className="form-control input-width"
                type="number"
                ref={zip}
                placeholder="ZIP / Postal Code"
                required
              />
              <div className="invalid-feedback text-start">
                Enter ZIP/Postal code
              </div>
            </div>
          </div>
          <div>
            <button className="btn btn-primary mb-3" type="submit">
              Sign Up
            </button>
            <div
              ref={errorAlert}
              className="alert alert-danger alert-dismissible fade show d-none"
              role="alert"
            >
              <div>Error:</div>
              <button
                type="button"
                className="btn-close"
                onClick={handleErrorAlertCloseClick}
              ></button>
            </div>
            <div
              ref={successAlert}
              className="alert alert-success show d-none"
              role="alert"
            >
              success
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
