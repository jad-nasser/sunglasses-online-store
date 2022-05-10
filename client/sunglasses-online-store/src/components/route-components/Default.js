import React from "react";
import { Outlet } from "react-router-dom";
import DefaultNavbar from "../default-navbar/DefaultNavbar";
const Default = () => {
  return (
    <>
      <DefaultNavbar />
      <div style={{ minHeight: "35rem" }}>
        <Outlet />
      </div>
    </>
  );
};
export default Default;
