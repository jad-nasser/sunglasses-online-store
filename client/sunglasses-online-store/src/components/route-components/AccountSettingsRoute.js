import React from "react";
import { Outlet } from "react-router-dom";
import AccountSettings from "../account-settings/AccountSettings";
const AccountSettingsRoute = () => {
  return (
    <div className="row g-0">
      <div className="col-12 col-md-4 col-xl-3">
        <AccountSettings />
      </div>
      <div className="col-12 col-md-8 col-xl-9">
        <Outlet />
      </div>
    </div>
  );
};
export default AccountSettingsRoute;
