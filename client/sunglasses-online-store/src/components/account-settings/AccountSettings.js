import React from "react";
import { Link } from "react-router-dom";
const AccountSettings = () => {
  return (
    <div>
      <div className="border-bottom d-md-none">
        <div className="d-flex justify-content-end">
          <button
            className="btn m-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#options"
          >
            <i class="fa fa-solid fa-bars"></i>
          </button>
        </div>
        <div className="collapse text-center" id="options">
          <ul className="list-group">
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/account_info"
                className="text-decoration-none"
              >
                Account Info
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_name"
                className="text-decoration-none"
              >
                Change Your Name
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_email"
                className="text-decoration-none"
              >
                Change Your Email
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/verify_email"
                className="text-decoration-none"
              >
                Verify Your Email
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_phone"
                className="text-decoration-none"
              >
                Change Your Phone
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/verify_phone"
                className="text-decoration-none"
              >
                Verify Your Phone
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_password"
                className="text-decoration-none"
              >
                Change Your Password
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_order_destination"
                className="text-decoration-none"
              >
                Change Order Destination
              </Link>
            </li>
            <li className="list-group-item border-0 mb-2">
              <Link
                to="/user/account_settings/deactivate_account"
                className="text-decoration-none"
              >
                Deactivate Your Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <ul className="list-group m-3 d-none d-md-block">
        <li
          className="list-group-item list-group-item-action active"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/account_info"
            className="text-reset text-decoration-none"
          >
            Account Info
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/edit_name"
            className="text-reset text-decoration-none"
          >
            Change Your Name
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/edit_email"
            className="text-reset text-decoration-none"
          >
            Change Your Email
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/verify_email"
            className="text-reset text-decoration-none"
          >
            Verify Your Email
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/edit_phone"
            className="text-reset text-decoration-none"
          >
            Change Your Phone
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/verify_phone"
            className="text-reset text-decoration-none"
          >
            Verify Your Phone
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/edit_password"
            className="text-reset text-decoration-none"
          >
            Change Your Password
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/edit_order_destination"
            className="text-reset text-decoration-none"
          >
            Change Order Destination
          </Link>
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
        >
          <Link
            to="/user/account_settings/deactivate_account"
            className="text-reset text-decoration-none"
          >
            Deactivate Your Account
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default AccountSettings;
