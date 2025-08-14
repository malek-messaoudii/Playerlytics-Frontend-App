import React, { useState } from 'react';
import { 
  Dashboard, 
  People, 
  SupervisorAccount,
  Settings,
  ExitToApp,
  ChevronLeft,
  ChevronRight 
} from '@mui/icons-material';
import './Sidebar.css';
import { href } from 'react-router-dom';
import DashboardAdmin from '../DashboardAdmin/DashboardAdmin';
import Gestionorg from '../Gestionorg/Gestionorg';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { 
      icon: <Dashboard />, 
      label: "Tableau de bord", 
      value: "dashboard",
      path: "/admin" 
    },
    { 
      icon: <People />, 
      label: "Gestion des clubs sportifs", 
      value: "users",
      path: "/Gestionorg" 
    },
    { 
      icon: <SupervisorAccount />, 
      label: "Gestion des sous-administrateurs", 
      value: "subadmins",
      path: "/gestionadmin" 
    },
    { 
      icon: <Settings />, 
      label: "Paramètres", 
      value: "settings",
      path: "/admin/parametres" 
    }
  ];

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

  return (
    <div className={`admin-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
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
      <div className="sidebar-header">
        {expanded && <h2> Tableau de bord</h2>}
        <button 
          className="toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      
      <nav className="sidebar-nav1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.value}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-nav ${isActive ? 'active' : ''}`
                }
                end
              >
                <span className="icon">{item.icon}</span>
                {expanded && <span className="label">{item.label}</span>}
                {expanded && (
                  <div className="active-indicator"></div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}
>
          <ExitToApp />
          {expanded && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;