import React, { useRef } from "react";
import { Link } from "react-router-dom";
const AccountSettings = () => {
  //an element just to scroll to it when any link is clicked in small screen size
  const scrollTo = useRef(null);
  //all the aim of this method is just to scroll for better user experience on small screen size
  const handleLinkClick = () => {
    scrollTo.current.scrollIntoView();
  };
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
            <i className="fa fa-solid fa-bars"></i>
          </button>
        </div>
        <div className="collapse text-center" id="options">
          <ul className="list-group">
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/account_info"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Account Info
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_name"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Change Your Name
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_email"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Change Your Email
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/verify_email"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Verify Your Email
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_phone"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Change Your Phone
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/verify_phone"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Verify Your Phone
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_password"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Change Your Password
              </Link>
            </li>
            <li className="list-group-item border-0">
              <Link
                to="/user/account_settings/edit_order_destination"
                className="text-decoration-none"
                onClick={handleLinkClick}
              >
                Change Order Destination
              </Link>
            </li>
            <li className="list-group-item border-0 mb-2">
              <Link
                to="/user/account_settings/deactivate_account"
                className="text-decoration-none"
                onClick={handleLinkClick}
                ref={scrollTo}
              >
                Deactivate Your Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="list-group m-3 d-none d-md-block">
        <Link
          to="/user/account_settings/account_info"
          className="list-group-item list-group-item-action"
        >
          Account Info
        </Link>
        <Link
          to="/user/account_settings/edit_name"
          className="list-group-item list-group-item-action"
        >
          Change Your Name
        </Link>
        <Link
          to="/user/account_settings/edit_email"
          className="list-group-item list-group-item-action"
        >
          Change Your Email
        </Link>
        <Link
          to="/user/account_settings/verify_email"
          className="list-group-item list-group-item-action"
        >
          Verify Your Email
        </Link>
        <Link
          to="/user/account_settings/edit_phone"
          className="list-group-item list-group-item-action"
        >
          Change Your Phone
        </Link>
        <Link
          to="/user/account_settings/verify_phone"
          className="list-group-item list-group-item-action"
        >
          Verify Your Phone
        </Link>
        <Link
          to="/user/account_settings/edit_password"
          className="list-group-item list-group-item-action"
        >
          Change Your Password
        </Link>
        <Link
          to="/user/account_settings/edit_order_destination"
          className="list-group-item list-group-item-action"
        >
          Change Order Destination
        </Link>
        <Link
          to="/user/account_settings/deactivate_account"
          className="list-group-item list-group-item-action"
        >
          Deactivate Your Account
        </Link>
      </div>
    </div>
  );
};
export default AccountSettings;
