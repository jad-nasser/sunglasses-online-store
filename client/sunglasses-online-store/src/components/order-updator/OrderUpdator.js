import React, { useRef } from "react";
import axios from "axios";
const OrderUpdator = (props) => {
  const shipmentID = useRef(null);
  const status = useRef(null);
  const updateButton = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  //method for updating the orders in the server
  const updateOrders = async (e) => {
    e.preventDefault();
    //collecting the data from the inputs
    let updateInfo = {};
    if (status.current.value) updateInfo.status = status.current.value;
    if (shipmentID.current.value)
      updateInfo.shipment_id = shipmentID.current.value;
    //sending the data to the database
    try {
      await axios.patch(
        process.env.REACT_APP_BASE_URL + "order/update_orders",
        { search: props.requestQuery, update: updateInfo }
      );
      success.current.childNodes[0].textContent = "Orders successfully updated";
      success.current.classList.remove("d-none");
    } catch (err) {
      error.current.childNodes[0].textContent = "Error: " + err.response.data;
      error.current.classList.remove("d-none");
    }
  };
  //this method is triggred when the success alert close button is clicked in an alert
  const handleSuccessCloseClick = () => {
    success.current.classList.add("d-none");
  };
  //this method is triggred when the error alert close button is clicked in an alert
  const handleErrorCloseClick = () => {
    error.current.classList.add("d-none");
  };
  //this method is triggered when an input is changed
  //when an input have a value the update button is enabled
  //when all the inputs have no value the update button will be disabled
  const handleInputChange = (e) => {
    if (e.target.value) {
      updateButton.current.disabled = false;
    } else {
      if (!status.current.value && !shipmentID.current.value) {
        updateButton.current.disabled = true;
      }
    }
  };
  return (
    <div className="w-50 border mx-auto mb-4">
      <form onSubmit={updateOrders}>
        <div className="d-flex flex-wrap justify-content-center mt-2">
          <input
            type="text"
            placeholder="Change Shipment ID"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={shipmentID}
          />
          <input
            type="text"
            placeholder="Change Status"
            className="form-control w-auto m-2"
            onChange={handleInputChange}
            ref={status}
          />
        </div>
        <div className="row justify-content-center mb-2">
          <button
            type="submit"
            className="btn btn-warning w-auto m-2"
            ref={updateButton}
            disabled
          >
            Update
          </button>
        </div>
      </form>
      <div
        className="alert alert-success alert-dismissible mx-2 d-none"
        ref={success}
      >
        <div>success</div>
        <button
          className="btn-close"
          onClick={handleSuccessCloseClick}
        ></button>
      </div>
      <div
        className="alert alert-danger alert-dismissible mx-2 d-none"
        ref={error}
      >
        <div>error</div>
        <div className="btn-close" onClick={handleErrorCloseClick}></div>
      </div>
    </div>
  );
};
export default OrderUpdator;
