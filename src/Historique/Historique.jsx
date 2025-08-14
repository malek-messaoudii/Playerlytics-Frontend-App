import React, { useState } from 'react';
import './Historique.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Historique = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false,
    isLoading: false
  });
  
  const userRole = localStorage.getItem('userRole') || 'default';



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
          <h1>Historique de prédiction</h1>
          <p>Consultez l’historique complet de vos prédictions.</p>
          </div>
      </div>
      <Footer/>
    </div> 
  );
};

export default Historique;