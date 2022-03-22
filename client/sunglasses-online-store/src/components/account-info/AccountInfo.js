import React, { useRef, useEffect } from "react";
import axios from "axios";
const AccountInfo = () => {
  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const phone = useRef(null);
  const country = useRef(null);
  const state = useRef(null);
  const city = useRef(null);
  const street = useRef(null);
  const aptBldg = useRef(null);
  const zip = useRef(null);
  const isPhoneVerified = useRef(null);
  const isEmailVerified = useRef(null);
  const error = useRef(null);
  //getting the user info from the database
  useEffect(() => {
    const getUser = async () => {
      try {
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "user/get_user"
        );
        firstName.current.textContent = res.data.user_info.first_name;
        lastName.current.textContent = res.data.user_info.last_name;
        email.current.textContent = res.data.user_info.email;
        phone.current.textContent = res.data.user_info.phone;
        country.current.textContent = res.data.user_info.country;
        city.current.textContent = res.data.user_info.city;
        street.current.textContent = res.data.user_info.street;
        state.current.textContent = res.data.user_info.state_province_county;
        aptBldg.current.textContent = res.data.user_info.bldg_apt_address;
        zip.current.textContent = res.data.user_info.zip_code;
        if (!res.data.user_info.is_phone_verified) {
          isPhoneVerified.current.textContent = "Not verified";
          isPhoneVerified.current.classList.remove("text-success");
          isPhoneVerified.current.classList.add("text-danger");
        }
        if (!res.data.user_info.is_email_verified) {
          isEmailVerified.current.textContent = "Not verified";
          isEmailVerified.current.classList.remove("text-success");
          isEmailVerified.current.classList.add("text-danger");
        }
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    };
    getUser();
  }, []);
  //the component
  return (
    <div className="container-fluid">
      <h3 className="my-5 text-center">Account Info</h3>
      <div className="container-2cols-form-width mx-auto border-0">
        <div className="row row-cols-2 g-3">
          <div className="col">
            <label htmlFor="first-name">First Name:</label>
            <span ref={firstName} id="first-name" className="ms-1">
              first name
            </span>
          </div>
          <div className="col">
            <label htmlFor="last-name">Last Name:</label>
            <span ref={lastName} id="last-name" className="ms-1">
              last name
            </span>
          </div>
          <div className="col">
            <label htmlFor="email">Email:</label>
            <span ref={email} id="email" className="mx-1">
              email
            </span>
            <span ref={isEmailVerified} className="text-success">
              Verified
            </span>
          </div>
          <div className="col">
            <label htmlFor="phone">Phone:</label>
            <span ref={phone} id="phone" className="mx-1">
              phone
            </span>
            <span ref={isPhoneVerified} className="text-success">
              Verified
            </span>
          </div>
          <div className="col">
            <label htmlFor="country">Country:</label>
            <span ref={country} id="country" className="ms-1">
              country
            </span>
          </div>
          <div className="col">
            <label htmlFor="state">State / Province / County:</label>
            <span ref={state} id="state" className="ms-1">
              state/province/county
            </span>
          </div>
          <div className="col">
            <label htmlFor="city">City:</label>
            <span ref={city} id="city" className="ms-1">
              city
            </span>
          </div>
          <div className="col">
            <label htmlFor="street">Street:</label>
            <span ref={street} id="street" className="ms-1">
              street
            </span>
          </div>
          <div className="col">
            <label htmlFor="apt-bldg">Bldg / Apt Address:</label>
            <span ref={aptBldg} id="apt-bldg" className="ms-1">
              bldg/apt
            </span>
          </div>
          <div className="col">
            <label htmlFor="zip">ZIP Code:</label>
            <span ref={zip} id="zip" className="ms-1">
              zip code
            </span>
          </div>
        </div>
        <div className="alert alert-danger d-none mt-3" ref={error}>
          error
        </div>
      </div>
    </div>
  );
};
export default AccountInfo;
