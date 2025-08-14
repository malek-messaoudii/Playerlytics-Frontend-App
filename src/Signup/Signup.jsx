import React, { useState } from "react";
import "./Signup.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    nomclub: "",
    email: "",
    localisation: "",
    nomresponsable: "",
    telephone: "",
    idfederal: "",
    password: "",
    confirmpassword: ""
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isError: false,
    isLoading: false
  });
  
  const navigate = useNavigate();

  // Validation du code fédéral
  const validateFederalId = (id) => {
    const regex = /^[a-zA-Z]+-[a-zA-Z]+-\d+$/;
    if (!id) return { valid: false, message: "Le code fédéral est requis" };
    if (!regex.test(id)) return { valid: false};
    return { valid: true };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validation du code fédéral
    const federalIdValidation = validateFederalId(formData.idfederal);
    if (!federalIdValidation.valid) {
      showNotification(federalIdValidation.message, true);
      return false;
    }

    // Validation des mots de passe
    if (formData.password !== formData.confirmpassword) {
      showNotification("Les mots de passe ne correspondent pas", true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;


    try {
      const response = await fetch("http://127.0.0.1:7000/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Erreur lors de l'inscription";
        if (response.status === 400) {
          if (data.email) errorMessage = "Cet email est déjà utilisé";
          else if (data.telephone) errorMessage = "Ce numéro de téléphone est déjà utilisé";
          else if (data.password) errorMessage = `Problème avec le mot de passe: ${data.password[0]}`;
          else if (data.non_field_errors) errorMessage = data.non_field_errors[0];
          else if (data.idfederal) errorMessage = data.idfederal[0];
        }
        throw new Error(errorMessage);
      }

      showNotification("Inscription réussie! Redirection...", false);
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Inscription réussie! Vous pouvez maintenant vous connecter." } 
        });
      }, 1500);
      
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const showNotification = (message, isError, isLoading = false) => {
    setNotification({
      show: true,
      message,
      isError,
      isLoading
    });
    
    if (!isLoading) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  return (
    <div className="register-club-page">
      <Navbar />
      
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

      <div className="register-container">
        <div className="register-card">
          <header className="register-header">
            <h1>Créez votre compte</h1>
          </header>

          <form onSubmit={handleSubmit} className="register-form">
            {[
              { label: "Nom du club", name: "nomclub", type: "text", placeholder: "Nom officiel du club" },
              { 
                label: "Email du club", 
                name: "email", 
                type: "email", 
                placeholder: "contact@club.com",
                required: true
              },
              { label: "Localisation", name: "localisation", type: "text", placeholder: "Ville ou adresse" },
              { label: "Responsable", name: "nomresponsable", type: "text", placeholder: "Prénom et nom" },
              { 
                label: "Téléphone", 
                name: "telephone", 
                type: "tel", 
                placeholder: "Numéro de téléphone",
                required: true
              },
              { 
                label: "Identifiant fédéral", 
                name: "idfederal", 
                type: "text", 
                placeholder: "CLUB-FFF-1234",
                pattern: "^[a-zA-Z]+-[a-zA-Z]+-\\d+$",
                required: true
              },
              { 
                label: "Mot de passe", 
                name: "password", 
                type: "password", 
                placeholder: "8 caractères minimum", 
                minLength: 8,
                required: true
              },
              { 
                label: "Confirmer mot de passe", 
                name: "confirmpassword", 
                type: "password", 
                placeholder: "Retapez votre mot de passe",
                required: true
              },
            ].map((field, index) => (
              <div className="form-group2" key={index}>
                <label>{field.label} : *</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={field.minLength}
                  pattern={field.pattern}
                  title={field.title}
                />
              </div>
            ))}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={notification.isLoading}
            >
              Créer le compte
            </button>
          </form>

          <div className="login-redirect">
            <p>Déjà inscrit ? <a href="/login">Connectez-vous</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}