import React, { useRef } from "react";
import axios from "axios";
const VerifyPhoneForTestingOnly = () => {
  const error = useRef(null);
  const success = useRef(null);
  const verifyPhone = async (e) => {
    try {
      await axios.post(
        process.env.REACT_APP_BASE_URL + "user/verify_phone_for_testing_only"
      );
      success.current.textContent = "Phone successfully verified";
      success.current.classList.remove("d-none");
    } catch (err) {
      error.current.childNodes[0].textContent = "Error: " + err.response.data;
      error.current.classList.remove("d-none");
    }
  };
  //handle error alert close button click
  const handleErrorAlertCloseClick = () => {
    error.current.classList.add("d-none");
  };
  //The component
  return (
    <div className="container-fluid text-center">
      <h3 className="my-5">Verify your Phone</h3>
      <button className="btn btn-primary mb-3" onClick={verifyPhone}>
        Verify Phone
      </button>
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
      <div className="alert alert-success text-start d-none" ref={success}>
        success
      </div>
    </div>
  );
};
export default VerifyPhoneForTestingOnly;
