
import React from "react";
import LoginForm from "./LoginForm.js";
import banner from '../../images/page-banner/banner.jpeg'
import { Link } from "react-router-dom";
import mokup from '../../images/mokaup/mokup-11.png';

const Authentication = () => {
  return (
    <div className="banner-area banner-bg-2 bg-color-fff7ed overflow-hidden">
      <div className="container-fluid mw-1640">
        <div className="row align-items-start" >
          {/* Colonne gauche avec padding */}
          <div className="col-lg-6 col-md-6 d-flex flex-column ps-lg-5 ps-3" style={{ marginTop: '-40px' }}>
            {/* Textes en haut */}
            
            {/* Images en dessous avec largeur réduite */}
            <div className="page-banner-img position-relative z-1 mt-3 ps-lg-5" style={{ marginTop: '-40px' }}>
              <img
                src={banner}
                alt="Page banner"
                style={{ width: "100%", maxWidth: 700, height: "50%",  maxHeight: 500, borderRadius: '30px' }}
              />
              {/* <img
                src={mokup}
                className="mokup-11 position-absolute top-0 start-0 end-0 w-100 h-100"
                alt="mokup"
              /> */}
            </div>
          </div>
          {/* Colonne droite décalée vers la droite */}
          <div className="col-lg-6 col-md-6 d-flex flex-column ps-lg-6 ps-5" style={{ marginTop: '-20px' }}>
            <div className="page-banner-content mb-4" style={{ marginTop: '-20px', marginLeft: '40px' }}>
              <h2>Login Register</h2>
              <ul className="p-0 mb-0 list-unstyled d-flex align-items-center">
                <li>
                  <Link to='/'>Home</Link>
                </li>
                <li className="ms-2"> Login Register</li>
              </ul>
            </div>

            <div className="w-100" style={{ maxWidth: 550 }}>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
