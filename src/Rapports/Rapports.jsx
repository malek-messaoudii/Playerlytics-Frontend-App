import React, { useEffect, useState } from 'react';
import './Rapports.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';

const Rapports = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false,
    isLoading: false
  });

  const [liendash, setLienDash] = useState('');
  const userRole = localStorage.getItem('userRole') || 'default';
  const nomclub = localStorage.getItem('clubname');

  console.log('Rapports component mounted');
  console.log('userRole:', userRole);
  console.log('nomclub:', nomclub);

  useEffect(() => {
    const fetchDashboardLink = async () => {
      if (!nomclub) {
        console.warn('nomclub is missing, cannot fetch dashboard.');
        return;
      }

      showNotification('Chargement du dashboard...', false, true);

      try {
        const url = `http://127.0.0.1:7000/user/getdashboard/?nomclub=${encodeURIComponent(nomclub)}`;
        console.log('Fetching from URL:', url);
        const response = await fetch(url);

        const data = await response.json();
        console.log('Response from backend:', data);

        if (response.ok && data?.organisation?.liendash) {
          console.log('Dashboard link found:', data.organisation.liendash);
          setLienDash(data.organisation.liendash);
          showNotification('Dashboard chargé avec succès', false);
        } else {
          console.error('Dashboard link not found in response.');
          showNotification("Lien du dashboard introuvable pour ce club.", true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du dashboard:', error);
        showNotification('Erreur serveur. Veuillez réessayer plus tard.', true);
      }
    };

    fetchDashboardLink();
  }, [nomclub]);

  const showNotification = (message, isError = false, isLoading = false) => {
    console.log('Notification:', message, 'Error:', isError, 'Loading:', isLoading);
    setNotification({ show: true, message, isError, isLoading });

    if (!isLoading) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  return (
    <div>
      <Navbar />

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


      <div className="contact-container">
        <div className="contact-header">
          <h1>Tableaux de bord des joueurs : Rapports analytiques</h1>
          <p>Analysez en profondeur les performances de vos joueurs.</p>
        </div>
     <br/> <br/> <br/>
        {liendash ? (
          <div style={{ textAlign: 'center' }}>
            <iframe
              src={liendash}
              title="Dashboard PowerBI"
              width="1350"
              height="800"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'gray' }}>Aucun dashboard à afficher pour le moment.</p>
        )}
      </div>
      <br/> <br/>
      <Footer />
    </div>
  );
};

export default Rapports;
