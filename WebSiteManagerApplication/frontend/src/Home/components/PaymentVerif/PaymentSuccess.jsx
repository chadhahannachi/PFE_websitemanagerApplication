import React from "react";
import NavbarStyleTwo from "../Layout/NavbarStyleTwo";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {

  const navigate = useNavigate();


  return (
  
    <>
      <NavbarStyleTwo />
      <div className="chackout-area ptb-175">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="chackout-content your-booking">
                <h4>Succes de paiement</h4>
                <div className="mb-40"></div>
                <p>
                  Votre paiement a été effectué avec succès.
                </p>
            
                <button
                  type="button"
                  className="default-btn rounded-10 active border-0"
                  onClick={() => navigate("/authentication")}
                >
                  Passer à la page de connexion
                </button>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  );
};

export default PaymentSuccess;
