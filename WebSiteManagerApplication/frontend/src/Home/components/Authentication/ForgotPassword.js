
// import React from "react"; 

// const ForgotPassword = () => {
//   return (
//     <>
//       <div className="login-register-area ptb-175">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-6">
//               <form className="login-register-form">
//                 <h4>Forgot your Password</h4>

//                 <div className="form-group">
//                   <input type="email" className="form-control" placeholder="Email" />
//                 </div>

                 
//                 <div className="form-group">
//                   <button
//                     type="submit"
//                     className="default-btn active rounded-10 w-100 text-center d-block border-0"
//                   >
//                     Reset Password
//                   </button>
//                 </div> 
//               </form>
//             </div> 
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPassword;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <>
      <div className="login-register-area ptb-175">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;