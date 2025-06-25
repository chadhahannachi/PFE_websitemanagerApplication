
import React, { useState, useEffect } from "react";
import DarkAndLightMode from "./DarkAndLightMode.tsx";

import { Link, useLocation } from "react-router-dom";
import logoBlack from '../../images/logo-black.png';
import logoWhite from '../../images/logo-white.png';

const Navbar = () => {
  // Toggle active class
  const [isActive, setActive] = useState(false);
  const handleToggleSearchModal = () => {
    setActive(!isActive);
  };

const location = useLocation();
const currentRoute = location.pathname;

  const [menu, setMenu] = useState(true);

  const toggleNavbar = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    let elementId = document.getElementById("navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        elementId?.classList.add("sticky");
      } else {
        elementId?.classList.remove("sticky");
      }
    });
  }, []);

  const classOne = menu
    ? "collapse navbar-collapse mean-menu"
    : "collapse navbar-collapse show";
  const classTwo= menu
    ? "navbar-toggler navbar-toggler-right collapsed"
    : "navbar-toggler navbar-toggler-right";

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-color-f3f4f6" id="navbar">
        <div className="container-fluid mw-1640">
          <Link className="navbar-brand" to="/">
            <img src={logoBlack} className="main-logo" alt="Black logo" />
            <img
              src={logoWhite}
              className="white-logo d-none"
              alt="White logo"
            />
          </Link>

          {/* Toggle navigation */}
          <button
            onClick={toggleNavbar}
            className={classTwo}
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="icon-bar top-bar"></span>
            <span className="icon-bar middle-bar"></span>
            <span className="icon-bar bottom-bar"></span>
          </button>

          <div className={classOne} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto ms-70">
              
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#" 
                  onClick={(e) => e.preventDefault()}
                >
                  Home
                </Link>

                <ul className="dropdown-menu">
                  
                  <li>
                    <Link  
                      className={`dropdown-item ${
                        currentRoute === "/hometh/" ? "active" : ""
                      }`}
                      to="/hometh/"
                    >
                      Back To Home
                    </Link>
                  </li>
                </ul>
              </li>

             

             

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Templates
                </Link>

                <ul className="dropdown-menu">
                 

                  <li>
                    <Link  
                      to="/checkout/"
                      className={`dropdown-item ${
                        currentRoute === "/checkout/" ? "active" : ""
                      }`}
                    >
                      Paiement
                    </Link>
                  </li>
                  <li>
                    <Link  
                      to="/pay-done/"
                      className={`dropdown-item ${
                        currentRoute === "/pay-done/" ? "active" : ""
                      }`}
                    >
                      Pay Done
                    </Link>
                  </li>
                
                </ul>
              </li>

              
            </ul>
          </div>

          {/* others-options */}
          <div className="others-options">
            <ul className="d-flex align-items-center">
              <li>
                <button
                  className="search-icon border-0 bg-transparent p-0"
                  onClick={handleToggleSearchModal}
                >
                  <i className="flaticon-loupe"></i>
                </button>
              </li>
              <li>
                <Link
                  to="/authentication/"
                  className="default-btn active d-none d-lg-block"
                >
                  Login Now
                </Link>
                <Link to="/authentication/" className="d-lg-none account">
                  <i className="flaticon-account"></i>
                </Link>
              </li>
              <li>
                {/* DarkAndLightMode */}
                <DarkAndLightMode />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Search Form */}
      <div 
        className={`offcanvas offcanvas-top src-form-wrapper ${
          isActive ? "show" : ""
        }`} 
      >
        <div className="container">
          <div className="offcanvas-body small">
            <form className="src-form">
              <input type="text" className="form-control" placeholder="Search Here..." />
              <button type="submit" className="src-btn">
                <i className="ri-search-line"></i>
              </button>
            </form>
          </div>
        </div>

        <button type="button" className="btn-close" onClick={handleToggleSearchModal}>
          <i className="ri-close-line"></i>
        </button>
      </div>
    </>
  );
};

export default Navbar;
