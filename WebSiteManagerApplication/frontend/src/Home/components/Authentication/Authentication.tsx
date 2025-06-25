
import React from "react";
import LoginForm from "./LoginForm.js";

const Authentication = () => {
  return (
    <>
      <div className="login-register-area ptb-175">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              {/* LoginForm */}
              <LoginForm />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
