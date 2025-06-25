
// import React from "react"; 

// const NewPassword = () => {
//   return (
//     <>
//       <div className="login-register-area ptb-175">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-6">
//               <form className="login-register-form">
//                 <h4>New Password</h4>

//                 <div className="form-group">
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Password"
//                   />
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

// export default NewPassword;


import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Token invalide !");
      setMessageType("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage("Mot de passe réinitialisé avec succès !");
        setMessageType("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/authentication/login"), 3000); // Redirect to login after 3 seconds
      } else {
        setMessage("Échec de la réinitialisation du mot de passe.");
        setMessageType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur réseau lors de la réinitialisation.");
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
                <h4>New Password</h4>

                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

export default NewPassword;