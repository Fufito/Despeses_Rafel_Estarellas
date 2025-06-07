import React, { useState } from "react";
import "./Login.css";
import { loginUser } from '../../firebase/firebase'
import { useNavigate, Navigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Email:", email);
    console.log("Contrasenya:", password);

    const res = await loginUser(email, password);

    if (res.code == undefined){
      console.log(res.user.uid);
      //Navigate
      //navigate("/projectes", {replace:true});
      return <Navigate to="/" replace />
    } else {
      setError(res.message);
    }

  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Inicia sessió</h1>
        {error && <p className="error-message">{error}</p>} {/* Missatge d'error */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correu electrònic
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contrasenya
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-button">
            Inicia sessió
          </button>
        </form>
      </div>
    </div>
  )
}