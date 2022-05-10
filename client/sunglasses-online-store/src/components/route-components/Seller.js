import React from "react";
import { Outlet } from "react-router-dom";
import SellerNavbar from "../seller-navbar/SellerNavbar";
const Seller = () => {
  return (
    <>
      <SellerNavbar />
      <div style={{ minHeight: "35rem" }}>
        <Outlet />
      </div>
    </>
  );
};
export default Seller;
