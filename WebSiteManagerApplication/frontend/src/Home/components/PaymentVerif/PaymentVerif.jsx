import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button, TextField, CircularProgress } from "@mui/material";
import NavbarStyleTwo from "../Layout/NavbarStyleTwo";

const PaymentVerif = () => {
  const params = new URLSearchParams(window.location.search);
  const licenceId = params.get("licence_id");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/stripe/confirm-verification",
        {
          licenceId,
          verificationCode,
        }
      );
      if (response.data.status === "success") {
        navigate("/payment-success");
      } else {
        setError(response.data.message || "Erreur inconnue");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la vérification du code"
      );
    }
    setLoading(false);
  };

  return (
    <>
          <NavbarStyleTwo />
    <div className="chackout-area ptb-175">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="chackout-content your-booking">
                <h4>Vérification du paiement</h4>
                <div className="mb-40"></div>
                <p>
                  Un code de vérification a été envoyé à votre adresse email. Veuillez entrer ce code pour finaliser votre paiement.
                </p>
            
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Code de vérification"
                    className="form-control"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    inputProps={{ maxLength: 6, pattern: "[A-Za-z0-9]{6}" }}
                    style={{ marginBottom: "1em" }}
                  />
                  <br />
                  <button
                    type="submit"
                    className="default-btn rounded-10 active border-0"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Vérifier le paiement"}
                  </button>
                </form>
                {error && <Alert severity="error" style={{ marginTop: "1em" }}>{error}</Alert>}       
              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  );
};

export default PaymentVerif;
