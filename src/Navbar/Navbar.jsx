import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { mdiEmailOutline,  mdiAccountGroup, mdiBellOutline, mdiChartBar, mdiAccountCircle, mdiLogout, mdiMenu, mdiClose, mdiBookOpenPageVariant, mdiRobot, mdiTable, mdiChartLine } from '@mdi/js';
import Icon from '@mdi/react';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'default'; 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false,
    isLoading: false
  });

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
      }, 3000);
    }
  };

  const handleLogout = () => {
    showNotification('Fin de session en cours...', false, true);
    
    setTimeout(() => {
      localStorage.removeItem('userRole');
      localStorage.removeItem('authTokens');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }, 1500);
  };

  const getNavbarConfig = () => {
    const configs = {
      admin: {
        links: [
          { path: "", icon: mdiEmailOutline },
          { path: "", icon: mdiBellOutline },
          { path: "", icon: mdiChartBar },
          { path: "", icon: mdiAccountCircle }
        ]
      },
      organisation: {
        links: [
          { path: "/accueil", text: "Accueil" },
          { path: "/rapports", text: "Rapport Analytique" },
          { path: "/prediction", text: "Nouvelle prédiction" },
          { path: "/fraude", text: "Détection de fraude" },
        ],
        userIcon: {
          icon: mdiAccountCircle,
          action: toggleSidebar,
          className: "custom-user-icon" 
        }
      },
      'Aiengineer': {
        links: [
          { path: "/accueil", text: "Accueil"},
          { path: "/modele", text: "Mes modèles"},
          { path: "/evaluation", text: "Évaluation"},
        ],
        userIcon: {
          icon: mdiAccountCircle,
          action: toggleSidebar,
          className: "custom-user-icon" 
        }
      },
      'Datascientest': {
        links: [
          { path: "/accueil", text: "Accueil"},
          { path: "/analyses", text: "Gestion des analyses"},
        ],
        userIcon: {
          icon: mdiAccountCircle,
          action: toggleSidebar,
          className: "custom-user-icon" 
        }
      },
      default: {
        links: [
          { path: "/accueil", text: "Accueil" },
          { path: "/contact", text: "Contactez-nous" }
        ],
        authButton: { 
          text: "SE CONNECTER", 
          path: "/login" 
        }
      }
    };

    return configs[userRole] || configs.default;
  };

  const config = getNavbarConfig();

  return (
    <>
      <nav className={`navbar ${userRole}-navbar`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <a href='/accueil'><img src={logo} alt="Logo" height={45} /></a>
          </div>

          <div className="navbar-links">
            {config.links.map((link, index) => (
              link.icon ? (
                <a key={index} href={link.path} className={`nav-link ${userRole}-link`}>
                  <Icon path={link.icon} size={1} className="nav-icon" />
                  <span className="icon-text">{link.text}</span>
                </a>
              ) : (
                <a key={index} href={link.path} className={`nav-link ${userRole}-link`}>
                  {link.text}
                </a>
              )
            ))}
            
            {userRole === 'organisation' && config.userIcon && (
              <button 
                className="user-icon-button"
                onClick={config.userIcon.action}
                aria-label="Ouvrir le menu utilisateur"
              >
                <Icon path={config.userIcon.icon} size={1.4} />
              </button>
            )}

            {userRole === 'Aiengineer' && config.userIcon && (
              <button 
                className="user-icon-button"
                onClick={config.userIcon.action}
                aria-label="Ouvrir le menu utilisateur"
              >
                <Icon path={config.userIcon.icon} size={1.4} />
              </button>
            )}

            {userRole === 'Datascientest' && config.userIcon && (
              <button 
                className="user-icon-button"
                onClick={config.userIcon.action}
                aria-label="Ouvrir le menu utilisateur"
              >
                <Icon path={config.userIcon.icon} size={1.4} />
              </button>
            )}

            {config.authButton && (
              config.authButton.path ? (
                <a href={config.authButton.path}>
                  <button className={`auth-button ${userRole}-button`}>
                    {config.authButton.text}
                  </button>
                </a>
              ) : (
                <button 
                  className={`auth-button ${userRole}-button`}
                  onClick={config.authButton.action}
                >
                  {config.authButton.text}
                </button>
              )
            )}
          </div>

          <div className="mobile-menu">
            <button className="mobile-menu-button" onClick={toggleSidebar}>
              <Icon path={mdiMenu} size={1} />
            </button>
          </div>
        </div>
      </nav>
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
      {/* Sidebar pour l'Aiengineer*/}
      {userRole === 'Aiengineer' && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button 
              className="sidebar-close-button"
              onClick={toggleSidebar}
              aria-label="Fermer le menu"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>
          <div className="sidebar-content">
            <button 
              className="sidebar-item" 
              onClick={() => {
                window.location.href = '/compte';
                setSidebarOpen(false);
              }}
            >
              <Icon path={mdiAccountCircle} size={1} className="sidebar-icon" />
              <span>Mon compte</span>
            </button>
            <button 
              className="sidebar-item logout-item" 
              onClick={handleLogout}
            >
              <Icon path={mdiLogout} size={1} className="sidebar-icon" />
              <span>Déconnexion</span>
            </button>
          </div>
          <div 
            className="sidebar-overlay" 
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
            aria-label="Fermer le menu"
          ></div>
        </div>
      )}

      {userRole === 'Datascientest' && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button 
              className="sidebar-close-button"
              onClick={toggleSidebar}
              aria-label="Fermer le menu"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>
          <div className="sidebar-content">
            <button 
              className="sidebar-item" 
              onClick={() => {
                window.location.href = '/compte';
                setSidebarOpen(false);
              }}
            >
              <Icon path={mdiAccountCircle} size={1} className="sidebar-icon" />
              <span>Mon compte</span>
            </button>
            <button 
              className="sidebar-item logout-item" 
              onClick={handleLogout}
            >
              <Icon path={mdiLogout} size={1} className="sidebar-icon" />
              <span>Déconnexion</span>
            </button>
          </div>
          <div 
            className="sidebar-overlay" 
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
            aria-label="Fermer le menu"
          ></div>
        </div>
      )}

      {userRole === 'organisation' && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button 
              className="sidebar-close-button"
              onClick={toggleSidebar}
              aria-label="Fermer le menu"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>
          <div className="sidebar-content">
            <button 
              className="sidebar-item" 
              onClick={() => {
                window.location.href = '/compte';
                setSidebarOpen(false);
              }}
            >
              <Icon path={mdiAccountCircle} size={1} className="sidebar-icon" />
              <span>Mon compte</span>
            </button>
            <button 
              className="sidebar-item" 
              onClick={() => {
                window.location.href = '/historique';
                setSidebarOpen(false);
              }}
            >
              <Icon path={mdiChartBar} size={1} className="sidebar-icon" />
              <span>Mon Historique de prédiction</span>
            </button>
            <button 
              className="sidebar-item" 
              onClick={() => {
                window.location.href = '/joueurs';
                setSidebarOpen(false);
              }}
            > 
            <Icon path={mdiAccountGroup} size={1} className="sidebar-icon" />
              <span>Mes joueurs </span>         
            </button>
            <button 
              className="sidebar-item" 
              onClick={() => {
                window.location.href = '/contact';
                setSidebarOpen(false);
              }}
            >
              <Icon path={mdiEmailOutline} size={1} className="sidebar-icon" />
              <span>Contactez-nous</span>
            </button>
            <button 
              className="sidebar-item logout-item" 
              onClick={handleLogout}
            >
              <Icon path={mdiLogout} size={1} className="sidebar-icon" />
              <span>Déconnexion</span>
            </button>
          </div>
          <div 
            className="sidebar-overlay" 
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
            aria-label="Fermer le menu"
          ></div>
        </div>
      )}
    </>
  );
};

export default Navbar;