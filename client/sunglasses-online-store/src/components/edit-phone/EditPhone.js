import React, { useRef } from "react";
import axios from "axios";
import countries from "../../data";
const EditPhone = () => {
  const phone = useRef(null);
  const code = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      try {
        await axios.patch(
          process.env.REACT_APP_BASE_URL + "user/update_user",
          {
            phone: code.current.value + phone.current.value,
          },
          { withCredentials: true }
        );
        success.current.textContent = "Phone number successfully changed";
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
  //creating the options for the phone code selection
  const phoneCodesOptions = countries.map((countryValue, index) => (
    <option key={index} value={countryValue.code}>
      {countryValue.name + " " + countryValue.code}
    </option>
  ));
  //The component
  return (
    <div className="container-fluid">
      <div className="container-form-width text-center mt-5 mx-auto border-0">
        <h3 className="mb-5">Change Your Phone Number</h3>
        <form
          className="needs-validation row row-cols-1 g-3 mb-3"
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="col">
            <div className="input-group has-validation input-width mx-auto">
              <select
                ref={code}
                data-testid="code"
                defaultValue=""
                className="phone-code-input-width flex-grow-0 form-select"
                required
              >
                <option value="">Code</option>
                {phoneCodesOptions}
              </select>
              <input
                type="number"
                placeholder="New phone number"
                ref={phone}
                className="form-control"
                required
              />
              <div className="invalid-feedback input-width text-start mx-auto">
                Enter new phone number
              </div>
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mt-2">
              Change Phone
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
export default EditPhone;
