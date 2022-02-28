import React from "react";
const Footer = () => {
  return (
    <footer className="container-fluid bg-dark text-center text-light pt-2 pb-3">
      <div>Phone: +123456789</div>
      <div>Email: sunglassesonlinestore@email.com</div>
      <div className="row justify-content-center mt-2">
        <i class="fa fa-lg fa-brands fa-facebook col-auto"></i>
        <i class="fa fa-lg fa-brands fa-twitter col-auto"></i>
        <i class="fa fa-lg fa-brands fa-instagram col-auto"></i>
        <i class="fa fa-lg fa-brands fa-youtube col-auto"></i>
      </div>
    </footer>
  );
};
export default Footer;
