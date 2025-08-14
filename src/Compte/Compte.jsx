import React, { useState, useEffect } from 'react';
import './Compte.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Compte = () => {
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole'); // Récupérer le rôle de l'utilisateur
  const [userInfo, setUserInfo] = useState({
    email: "",
    profession: "", // Nouveau champ pour les rôles spécifiques
    // Champs pour les organisations
    nomclub: "",
    localisation: "",
    nomresponsable: "",
    telephone: "",
    idfederal: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isError: false,
    isLoading: false
  });

  const isSpecialRole = userRole === 'Aiengineer' || userRole === 'Datascientest';

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setNotification({
          show: true,
          message: "Chargement des informations...",
          isError: false,
          isLoading: true
        });

        const response = await fetch(`http://127.0.0.1:7000/user/getbyemail/${userEmail}/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCSRFToken(),
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Échec du chargement des données");
        }

        const data = await response.json();
        setUserInfo(data);

        setNotification(prev => ({ ...prev, show: false }));
      } catch (error) {
        setNotification({
          show: true,
          message: error.message,
          isError: true,
          isLoading: false
        });
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      setNotification({
        show: true,
        message: "Mise à jour en cours...",
        isError: false,
        isLoading: true
      });

      const response = await fetch(`http://127.0.0.1:7000/user/updateuser/${userEmail}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify(userInfo)
      });

      if (response.status === 403) {
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Échec de la mise à jour");
      }

      setNotification({
        show: true,
        message: "Mise à jour réussie!",
        isError: false,
        isLoading: false
      });

    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        isError: true,
        isLoading: false
      });
    } finally {
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        show: true,
        message: "Les mots de passe ne correspondent pas!",
        isError: true,
        isLoading: false
      });
      return;
    }

    try {
      setNotification({
        show: true,
        message: "Changement de mot de passe en cours...",
        isError: false,
        isLoading: true
      });

      const response = await fetch(`http://127.0.0.1:7000/user/update_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        })
      });

      if (response.status === 403) {
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Échec du changement de mot de passe");
      }

      setNotification({
        show: true,
        message: "Mot de passe changé avec succès!",
        isError: false,
        isLoading: false
      });

      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        isError: true,
        isLoading: false
      });
    } finally {
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
    }
  };

  return (
    <div className="account-page">
      <Navbar/>
      
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

      <div className="contact-container">
        <div className="contact-header">
          <h1>Bienvenue Sur Votre Espace Personnel</h1>
          <p>Gérez vos informations personnelles</p>
        </div>

        <div className='rec2'>
          <div className="info-display">
            {isSpecialRole ? (
              <>
                <div className='d1'>
                  <div className="info-group">
                    <label>Email :</label>
                    <p>{userInfo.email}</p>
                  </div>
                  <div className="info-group">
                    <label>Profession :</label>
                    <p>{userInfo.profession}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='d1'>
                  <div className="info-group">
                    <label>Nom du club :</label>
                    <p>{userInfo.nomclub}</p>
                  </div>
                  <div className="info-group">
                    <label>Email du club :</label>
                    <p>{userInfo.email}</p>
                  </div>
                </div>
                
                <div className='d1'>
                  <div className="info-group">
                    <label>Localisation :</label>
                    <p>{userInfo.localisation}</p>
                  </div>
                  <div className="info-group">
                    <label>Responsable :</label>
                    <p>{userInfo.nomresponsable}</p>
                  </div>
                </div>
                
                <div className='d1'>
                  <div className="info-group">
                    <label>Téléphone :</label>
                    <p>{userInfo.telephone}</p>
                  </div>
                  <div className="info-group">
                    <label>ID Fédéral :</label>
                    <p>{userInfo.idfederal}</p>
                  </div>
                </div>
              </>
            )}
            
            <div className="button-container">
              <button 
                className='bn632-hover bn26'
                onClick={() => setShowInfoModal(true)}
              >
                Modifier les informations
              </button>
              
              <button 
                className='btn5'
                onClick={() => setShowPasswordModal(true)}
              >
                Changer mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Update Modal */}
      {showInfoModal && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <button className="close-btn1" onClick={() => setShowInfoModal(false)}>
              <CloseIcon />
            </button>
            <h2>Modifier les informations</h2>
            <form onSubmit={handleSaveInfo}>
              {isSpecialRole ? (
                <>
                  <div className='d1'>
                    <div className="form-group1">
                      <label htmlFor="email">Email :</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={userInfo.email} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group1">
                      <label htmlFor="profession">Profession :</label>
                      <input 
                        type="text" 
                        id="profession" 
                        name="profession" 
                        value={userInfo.profession} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='d1'>
                    <div className="form-group1">
                      <label htmlFor="nomclub">Nom du club :</label>
                      <input 
                        type="text" 
                        id="nomclub" 
                        name="nomclub" 
                        value={userInfo.nomclub} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group1">
                      <label htmlFor="email">Email du club :</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={userInfo.email} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className='d1'>
                    <div className="form-group1">
                      <label htmlFor="localisation">Localisation :</label>
                      <input 
                        type="text" 
                        id="localisation" 
                        name="localisation" 
                        value={userInfo.localisation} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group1">
                      <label htmlFor="nomresponsable">Responsable :</label>
                      <input 
                        type="text" 
                        id="nomresponsable" 
                        name="nomresponsable" 
                        value={userInfo.nomresponsable} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className='d1'>
                    <div className="form-group1">
                      <label htmlFor="telephone">Téléphone :</label>
                      <input 
                        type="tel" 
                        id="telephone" 
                        name="telephone" 
                        value={userInfo.telephone} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group1">
                      <label htmlFor="idfederal">ID Fédéral :</label>
                      <input 
                        type="text" 
                        id="idfederal" 
                        name="idfederal" 
                        value={userInfo.idfederal} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <button className='bn632-hover bn26' type="submit">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Password Update Modal - reste inchangé */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPasswordModal(false)}>
              <CloseIcon />
            </button>
            <h2>Changer le mot de passe</h2>
            <form onSubmit={handleSavePassword}>
              <div className="form-group1">
                <label htmlFor="currentPassword">Mot de passe actuel :</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  name="currentPassword" 
                  value={passwordForm.currentPassword} 
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              
              <div className="form-group1">
                <label htmlFor="newPassword">Nouveau mot de passe :</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword" 
                  value={passwordForm.newPassword} 
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
                <small>Minimum 8 caractères</small>
              </div>
              
              <div className="form-group1">
                <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={passwordForm.confirmPassword} 
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              
              <button className='bn632-hover bn26' type="submit">
                Enregistrer le nouveau mot de passe
              </button>
            </form>
          </div>
        </div>
      )}

      {userEmail && userRole === 'organisation' && (
  <div className="circle-container">
    <span className="message">Salut, comment je peux vous aider ?</span>
    <IconButton href='/chat'><div className="circle"><ChatBubbleIcon /></div></IconButton>
  </div>
)}
      
      <Footer/>
    </div>
  );
};

export default Compte;