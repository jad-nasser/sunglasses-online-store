import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
//this component is to gather the react router search params and pass them to the child components and also
//this component  check if a user can enter a specific page according to its type and if the
//user type is different than the page type then the user will be redirected to another pages
const RouteComponent = (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let properties = {};
  let sortBy = null;
  //checking the user type and rediret the user to another page if the user is not in the correct page
  useEffect(() => {
    const checkUser = async () => {
      try {
        //checking if a user is the seller
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "user/check_seller_login",
          { withCredentials: true }
        );
        if (res.data === true) {
          if (props.pageType !== "seller") {
            navigate("/seller/items");
          }
        } else {
          //checking if the user is a customer
          let res2 = await axios.get(
            process.env.REACT_APP_BASE_URL + "user/check_customer_login",
            { withCredentials: true }
          );
          if (res2.data === true) {
            if (props.pageType !== "customer") navigate("/user/home");
          }
          //then the user is default (not logged in to the system)
          else {
            if (props.pageType !== "default") navigate("/sign_in");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkUser();
  }, [props.pageType, navigate]);
  //getting all search parameters
  searchParams.forEach((value, key, parent) => {
    if (key === "sort_by") sortBy = value;
    else properties[key] = value;
  });
  //the component
  return (
    <>
      {React.cloneElement(props.children, {
        requestQuery: properties,
        sortBy: sortBy,
      })}
    </>
  );
};
export default RouteComponent;
