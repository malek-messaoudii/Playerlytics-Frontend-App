import React, { useState } from 'react';
import './Contact.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Contact = () => {
  const [formData, setFormData] = useState({
    metier: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nomclub: '',
    message: ''
  });
  const [userType, setUserType] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false,
    isLoading: false
  });
  
  const userRole = localStorage.getItem('userRole') || 'default';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    showNotification("Envoi du message en cours...", false, true);

    try {
      // Prepare the data to match your API requirements
      const payload = {
        metier: userType || (userRole === 'organisation' ? 'club' : ''),
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        nomclub: formData.nomclub,
        message: formData.message
      };

      const response = await fetch('http://127.0.0.1:7000/contact/addcontact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Échec de l\'envoi du message');
      }

      showNotification('Message envoyé avec succès!', false);
      
      // Reset form after successful submission
      setFormData({
        metier: '',
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        nomclub: '',
        message: ''
      });
      setUserType('');

    } catch (error) {
      showNotification(error.message || 'Erreur lors de l\'envoi du message', true);
    }
  };

  return (
    <div>
      <Navbar/>
      {userRole === 'organisation' && (
        <div className="circle-container">
          <span className="message">Salut, comment je peux vous aider ?</span>
          <IconButton href='/chat'>
            <div className="circle">
              <ChatBubbleIcon />
            </div>
          </IconButton>
        </div>
      )}
      
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
      
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contactez-nous</h1>
          <p>Une question ? Un projet ? Nous sommes à votre écoute.</p>
        </div>

        <div className="contact-content">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
            {userRole === 'default' && (
              <div className="form-group checkbox-group">
                <label>Vous êtes : *</label>
                <div className="checkbox-options">                   
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={userType === 'club'}
                        onChange={() => setUserType('club')}
                      />
                    }
                    label="Un club"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={userType === 'investor'}
                        onChange={() => setUserType('investor')}
                      />
                    }
                    label="Un investisseur"
                  />
                </div>
              </div>
            )}

              <label htmlFor="nom">Nom : *</label>
              <input 
                type="text" 
                id="nom" 
                name="nom" 
                value={formData.nom}
                onChange={handleChange}
                required 
                placeholder="Votre nom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom">Prénom : *</label>
              <input 
                type="text" 
                id="prenom" 
                name="prenom" 
                value={formData.prenom}
                onChange={handleChange}
                required 
                placeholder="Votre prénom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email : *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="votre@email.com"
              />
            </div>

            {(userRole === 'organisation' || userType === 'club') && (
              <div className="form-group">
                <label htmlFor="nomclub">Nom du club : {userRole === 'organisation' ? '*' : ''}</label>
                <input 
                  type="text" 
                  id="nomclub" 
                  name="nomclub" 
                  value={formData.nomclub}
                  onChange={handleChange}
                  required={userRole === 'organisation'}
                  placeholder="Votre club sportif"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="telephone">Téléphone : *</label>
              <input 
                type="tel" 
                id="telephone" 
                name="telephone" 
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message : *</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required 
                rows="5"
                placeholder="Votre message..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={notification.isLoading}
            >
              {'Envoyer le message'}
            </button>
          </form>

          <div className="contact-info">
            <h3>Coordonnées</h3>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> playerlytics@gmail.com
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="contact-icon" /> +216 72 485 627
            </p>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" /> Tunisie, Tunis
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div> 
  );
};

export default Contact;