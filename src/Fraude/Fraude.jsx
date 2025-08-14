import React, { useState } from 'react';
import './Fraude.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';

const Fraude = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false,
    isLoading: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [predictionMode, setPredictionMode] = useState(null);
  const [height, setHeight] = useState('');
  const [predictionResults, setPredictionResults] = useState(null);

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

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePredictAge = () => {
    setPredictionMode('age');
    showNotification('Prédiction de l’âge en cours...', false, true);
    setTimeout(() => {
      showNotification("Âge prédit : 17 ans", false, false);
    }, 2000);
  };

  const handlePredictBody = async () => {
    if (!imageFile || !height) {
      showNotification('Veuillez fournir une image et une taille.', true);
      return;
    }

    setPredictionMode('mesures');
    showNotification('Prédiction des mesures du corps en cours...', false, true);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('height', height);

    try {
      const response = await fetch('http://127.0.0.1:7000/mesure/measure/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Échec de la prédiction');
      }

      const data = await response.json();
      setPredictionResults(data);
      showNotification('Mesures corporelles prédites avec succès.', false);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification("Erreur lors de la prédiction des mesures.", true);
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
          <h1>Détection de fraude</h1>
          <p>Analysez les images pour détecter l'âge ou les mesures physiques du joueur.</p>
        </div>

        <div className="advice-section">
          <h3>Conseils d'utilisation</h3>
          <ul>
            <li><strong>Pour prédire l'âge :</strong> choisissez une image claire et proche du visage du joueur.</li>
            <li><strong>Pour prédire les mesures du corps :</strong> utilisez une image complète et frontale du joueur.</li>
          </ul>
        </div>

        <div className="upload-container">
          <label htmlFor="image-upload">Télécharger l'image du joueur (.jpg, .png)</label>
          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          {imageFile && (
            <div className="preview">
              <p>Fichier sélectionné : {imageFile.name}</p>
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Aperçu" 
                className="image-preview"
              />
            </div>
          )}

          <div className="height-input">
            <label htmlFor="height">Taille (en cm) :</label>
            <input 
              type="number" 
              id="height" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              placeholder="Ex : 180"
            />
          </div>
        </div>

        <div className="prediction-buttons">
          <button className="btn-predict" onClick={handlePredictAge}>Prédire l'âge</button>
          <button className="btn-predict" onClick={handlePredictBody}>Prédire les mesures du corps</button>
        </div>

        {predictionResults && (
          <div className="results-container">
            <h3>Résultats de la prédiction :</h3>
            <ul>
              <li><strong>Largeur des épaules :</strong> {predictionResults.shoulder_width.toFixed(8)} cm</li>
              <li><strong>Tour de poitrine :</strong> {predictionResults.chest_width.toFixed(8)} cm</li>
              <li><strong>Tour de taille :</strong> {predictionResults.waist_width.toFixed(8)} cm</li>
              <li><strong>Longueur du bras :</strong> {predictionResults.arm_length.toFixed(8)} cm</li>
              <li><strong>Longueur de la jambe :</strong> {predictionResults.leg_length.toFixed(8)} cm</li>
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Fraude;
