import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Connexion réussie:", data);
        alert("Connexion réussie !");
        localStorage.setItem("token", data.token);
        navigate('/');
      } else {
        console.error("Erreur lors de la connexion:", data.message);
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur réseau lors de la connexion");
    }
  };

  return (
    <>
      <form className="login-register-form" onSubmit={handleSubmit}>
        <h4>Log In To Your Account</h4>

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
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group d-flex justify-content-between">
          <div className="form-check">
          </div>
          <Link to="/authentication/forgot-password">Forgot your password?</Link>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="default-btn active rounded-10 w-100 text-center d-block border-0"
          >
            Log In
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;