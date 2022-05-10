import React, { useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
const DeactivateAccount = () => {
  const error = useRef(null);
  const success = useRef(null);
  const password = useRef(null);
  const modal = useRef(null);
  const navigate = useNavigate();
  var modalInstance = null;
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      try {
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "user/check_password",
          {
            params: { password: password.current.value },
            withCredentials: true,
          }
        );
        if (res.data.check_password) {
          modalInstance = new Modal(modal.current, {});
          modalInstance.show();
        } else {
          error.current.childNodes[0].textContent = "Error: Incorrect password";
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
  //delete user function
  const deleteUser = async () => {
    try {
      await axios.delete(process.env.REACT_APP_BASE_URL + "user/delete_user", {
        withCredentials: true,
      });
      await axios.delete(process.env.REACT_APP_BASE_URL + "user/sign_out", {
        withCredentials: true,
      });
      success.current.textContent = "Account successfully deactivated";
      success.current.classList.remove("d-none");
      await new Promise((r) => setTimeout(r, 3000));
      navigate("/sign_in");
    } catch (err) {
      error.current.childNodes[0].textContent = "Error: " + err.response.data;
      error.current.classList.remove("d-none");
    }
  };
  //The component
  return (
    <div className="container-fluid">
      <div className="modal fade" ref={modal}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deactivate Your accound</h5>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete your account permanently?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-dismiss="modal">
                No
              </button>
              <button
                className="btn btn-danger"
                onClick={deleteUser}
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-form-width text-center mt-5 mx-auto border-0">
        <h3 className="mb-5">Deactivate your account</h3>
        <form
          className="needs-validation row row-cols-1 g-3 mb-3"
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className="col">
            <input
              type="password"
              placeholder="Password"
              ref={password}
              className="input-width form-control mx-auto"
              required
            />
            <div className="input-width text-start mx-auto invalid-feedback">
              Enter your password
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mt-2">
              Deactivate Account
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
export default DeactivateAccount;
