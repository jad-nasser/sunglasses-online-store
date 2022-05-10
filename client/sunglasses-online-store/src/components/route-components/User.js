import React from "react";
import { Outlet } from "react-router-dom";
import CustomerNavbar from "../customer-navbar/CustomerNavbar";
const User = () => {
  return (
    <>
      <CustomerNavbar />
      <div style={{ minHeight: "35rem" }}>
        <Outlet />
      </div>
    </>
  );
};
export default User;
