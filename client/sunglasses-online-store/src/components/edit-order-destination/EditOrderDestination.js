import React, { useRef } from "react";
import axios from "axios";
import countries from "../../data";
const EditOrderDestination = () => {
  const country = useRef(null);
  const state = useRef(null);
  const city = useRef(null);
  const street = useRef(null);
  const aptBldg = useRef(null);
  const zip = useRef(null);
  const form = useRef(null);
  const errorAlert = useRef(null);
  const successAlert = useRef(null);
  //creating countries options
  const countriesOptions = countries.map((countryValue, index) => (
    <option value={countryValue.name} key={index}>
      {countryValue.name}
    </option>
  ));
  //handle form submit function
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.current.classList.add("was-validated");
    if (e.target.checkValidity()) {
      try {
        let res = await axios.patch(
          `${process.env.REACT_APP_BASE_URL}user/update_user`,
          {
            country: country.current.value,
            city: city.current.value,
            street: street.current.value,
            state_province_county: state.current.value,
            zip_code: zip.current.value,
            bldg_apt_address: aptBldg.current.value,
          }
        );
        if (res.status === 200) {
          successAlert.current.textContent =
            "Order destination successfully changed";
          successAlert.current.classList.remove("d-none");
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
      <h3 className="my-5">Change Order Destination Address</h3>
      <div className="container container-2cols-form-width mb-5 border-0">
        <form
          ref={form}
          className="mt-3 needs-validation"
          onSubmit={handleFormSubmit}
          noValidate
        >
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
              Change Order Destination
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
export default EditOrderDestination;
