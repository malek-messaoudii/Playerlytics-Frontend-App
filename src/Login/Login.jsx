import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isError: false,
    isLoading: false
  });

  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  const fetchUserid = async (email) => {
    try {
      const response = await fetch("http://127.0.0.1:7000/user/getid/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user id");
      }

      return data.id;
    } catch (error) {
      console.error("Error fetching user id:", error);
      return "default"; // Default role if there's an error
    }
  };

  const fetchUserRole = async (email) => {
    try {
      const response = await fetch("http://127.0.0.1:7000/user/getrole/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user role");
      }

      return data.role;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return "default"; // Default role if there's an error
    }
  };

  const fetchUserNomclub = async (email) => {
    try {
      const response = await fetch("http://127.0.0.1:7000/user/getnomclub/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch club name");
      }
  
      return data.nomclub; // ✅ Fix: return nomclub, not data.role
    } catch (error) {
      console.error("Error fetching club name:", error);
      return null;
    }
  };
  


  const handleLogin = async (e) => {
    e.preventDefault();
  
    setNotification({
      show: true,
      message: "Connexion en cours...",
      isError: false,
      isLoading: true
    });
  
    try {
      const loginResponse = await fetch("http://127.0.0.1:7000/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });
  
      const loginData = await loginResponse.json();
  
      if (!loginResponse.ok) {
        let errorMessage = "Email ou mot de passe incorrect";
  
        if (loginData.email) {
          errorMessage = "Email incorrect ou introuvable";
        } else if (loginData.password) {
          errorMessage = "Mot de passe incorrect";
        } else if (loginData.non_field_errors) {
          errorMessage = loginData.non_field_errors[0]; // message backend
        }
  
        throw new Error(errorMessage);
      }
  
      const role = await fetchUserRole(email);
      const nomclub = await fetchUserNomclub(email);
      const id = await fetchUserid(email);


  
      localStorage.setItem("userEmail", email);
      localStorage.setItem("authTokens", JSON.stringify(loginData.tokens));
      localStorage.setItem("userData", JSON.stringify(loginData.organisation));
      localStorage.setItem("userRole", role);
      localStorage.setItem("clubname", nomclub);
      localStorage.setItem("id", id);


  
      if (role === 'admin') {
        navigate("/admin");
      } else if (role === 'organisation') {
        navigate("/accueil");
      } else if (role === 'Datascientest') {
        navigate("/accueil"); 
      } else if (role === 'Aiengineer') {
        navigate("/accueil"); 
      } else {
        throw new Error("Rôle utilisateur non reconnu");
      }
  
    } catch (err) {
      setNotification({
        show: true,
        message: err.message,
        isError: true,
        isLoading: false
      });
  
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
  
    } finally {
      setNotification(prev => ({ ...prev, isLoading: false }));
    }
  };
  

  return (
    <div className="login-page">
      <Navbar />
      <div className="notification-container">
        {notification.show && (
          <div className={`notification ${notification.isError ? 'error' : ''}`}>
            <div className="notification-content">
              {notification.isLoading && !notification.isError && (
                <div className="spinner"></div>
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}
      </div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Connectez-vous</h1>
            <p className="login-subtitle">Accédez à votre tableau de bord</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group1">
              <label className="form-label">Email : *</label>
              <div className="input-container1">
                <span className="icon icon-email"></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email du club"
                  className="form-input1"
                  required
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div className="form-group1">
              <label className="form-label">Mot de passe : *</label>
              <div className="input-container1">
                <span className="icon icon-lock"></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="form-input1"
                  required
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              <div className="forgot-password">
                <a href="/forgot-password">Mot de passe oublié ?</a>
              </div>
            </div>

            <button 
              className="login-button" 
              type="submit"
              disabled={notification.isLoading}
            >
              SE CONNECTER
            </button>
          </form>

          <div className="auth-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OU</span>
            <span className="divider-line"></span>
          </div>

          <button className="google-auth-button" disabled={notification.isLoading}>
            <FcGoogle className="google-icon" />
            S'authentifier avec Google
          </button>

          <div className="create-account">
            <p>Vous n'avez pas de compte ? <a href="/signup">Créer un compte</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}