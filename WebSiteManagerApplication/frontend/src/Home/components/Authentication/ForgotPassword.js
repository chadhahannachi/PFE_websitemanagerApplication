import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import banner from '../../images/logo-black.png'
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/reset-password-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Un email de réinitialisation a été envoyé.");
        setMessageType("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/authentication/login"), 3000); // Redirect to login after 3 seconds
      } else {
        setMessage("Erreur lors de la demande. Vérifiez votre email.");
        setMessageType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage("Erreur réseau lors de la demande.");
      setMessageType("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="banner-area banner-bg-2 bg-color-fff7ed overflow-hidden">
      <div className="container-fluid mw-1640" >
        <div className="row align-items-center" >
          {/* Colonne gauche */}
          <div className="col-lg-6 col-md-6 d-flex flex-column justify-content-center ps-lg-6 ps-5" >
            <div className="page-banner-content mb-4">
              <h2>Forgot Password</h2>
              <ul className="p-0 mb-0 list-unstyled d-flex align-items-center">
                <li>
                  <Link to='/'>Home</Link>
                </li>
                <li className="ms-2"> Forgot Password</li>
              </ul>
            </div>
            <div style={{ maxWidth: 550 }} >
            <form className="login-register-form" onSubmit={handleSubmit}>
              <h4>Forgot your Password</h4>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="default-btn active rounded-10 w-100 text-center d-block border-0"
                >
                  Reset Password
                </button>
              </div>
              {openSnackbar && (
                <div
                  className={`alert alert-${messageType === "success" ? "success" : "danger"} mt-3`}
                  role="alert"
                >
                  {message}
                  <button
                    type="button"
                    className="btn-close float-end"
                    onClick={handleCloseSnackbar}
                    aria-label="Close"
                  ></button>
                </div>
              )}
            </form></div>
          </div>
          {/* Colonne droite */}
          <div className="col-lg-6 col-md-6 d-flex flex-column ps-lg-1 ps-3" >
          <div className="page-banner-img position-relative z-1 mt-3 ps-lg-1" >
              <img
                src={banner}
                alt="Page banner"
                style={{ width: "100%", maxWidth: 700, height: "50%",  maxHeight: 500, borderRadius: '30px' }}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;












