import React, { useState, useEffect } from 'react';
import './Prediction.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

const Prediction = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false,
    isLoading: false
  });

  const [playerData, setPlayerData] = useState({
    Age: '',
    Wage: '',
    Position: '',
    Crossing: '',
    Finishing: '',
    HeadingAccuracy: '',
    ShortPassing: '',
    Volleys: '',
    Dribbling: '',
    Curve: '',
    FKAccuracy: '',
    LongPassing: '',
    BallControl: '',
    Acceleration: '',
    SprintSpeed: '',
    Agility: '',
    Reactions: '',
    Balance: '',
    ShotPower: '',
    Jumping: '',
    Stamina: '',
    Strength: '',
    LongShots: '',
    Aggression: '',
    Interceptions: '',
    Positioning: '',
    Vision: '',
    Penalties: '',
    Composure: '',
    Marking: '',
    StandingTackle: '',
    SlidingTackle: '',
    GKDiving: '',
    GKHandling: '',
    GKKicking: '',
    GKPositioning: '',
    GKReflexes: '',
    PlayerName: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['Age', 'Wage', 'Position'];
    for (const field of requiredFields) {
      if (!playerData[field]) {
        showNotification(`Le champ ${field} est requis`, true);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    showNotification('Prédiction en cours...', false, true);

    try {
      // Format data according to backend expectations
      const requestData = {
        Age: Number(playerData.Age),
        Wage: Number(playerData.Wage),
        Position: playerData.Position,
        Crossing: Number(playerData.Crossing || 0),
        Finishing: Number(playerData.Finishing || 0),
        HeadingAccuracy: Number(playerData.HeadingAccuracy || 0),
        ShortPassing: Number(playerData.ShortPassing || 0),
        Volleys: Number(playerData.Volleys || 0),
        Dribbling: Number(playerData.Dribbling || 0),
        Curve: Number(playerData.Curve || 0),
        FKAccuracy: Number(playerData.FKAccuracy || 0),
        LongPassing: Number(playerData.LongPassing || 0),
        BallControl: Number(playerData.BallControl || 0),
        Acceleration: Number(playerData.Acceleration || 0),
        SprintSpeed: Number(playerData.SprintSpeed || 0),
        Agility: Number(playerData.Agility || 0),
        Reactions: Number(playerData.Reactions || 0),
        Balance: Number(playerData.Balance || 0),
        ShotPower: Number(playerData.ShotPower || 0),
        Jumping: Number(playerData.Jumping || 0),
        Stamina: Number(playerData.Stamina || 0),
        Strength: Number(playerData.Strength || 0),
        LongShots: Number(playerData.LongShots || 0),
        Aggression: Number(playerData.Aggression || 0),
        Interceptions: Number(playerData.Interceptions || 0),
        Positioning: Number(playerData.Positioning || 0),
        Vision: Number(playerData.Vision || 0),
        Marking: Number(playerData.Marking || 0),
        StandingTackle: Number(playerData.StandingTackle || 0),
        SlidingTackle: Number(playerData.SlidingTackle || 0),
        GKDiving: Number(playerData.GKDiving || 0),
        GKHandling: Number(playerData.GKHandling || 0),
        GKKicking: Number(playerData.GKKicking || 0),
        GKPositioning: Number(playerData.GKPositioning || 0),
        GKReflexes: Number(playerData.GKReflexes || 0),
        PlayerName: playerData.PlayerName || 'Unknown'
      };

      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la prédiction');
      }

      const result = await response.json();
      setPredictedPrice(result.predicted_price);
      showNotification('Prédiction réussie !');
    } catch (error) {
      console.error('Prediction error:', error);
      showNotification(error.message || 'Erreur lors de la prédiction', true);
    }
  };

  const handleReset = () => {
    setPlayerData({
      Age: '',
      Wage: '',
      Position: '',
      Crossing: '',
      Finishing: '',
      HeadingAccuracy: '',
      ShortPassing: '',
      Volleys: '',
      Dribbling: '',
      Curve: '',
      FKAccuracy: '',
      LongPassing: '',
      BallControl: '',
      Acceleration: '',
      SprintSpeed: '',
      Agility: '',
      Reactions: '',
      Balance: '',
      ShotPower: '',
      Jumping: '',
      Stamina: '',
      Strength: '',
      LongShots: '',
      Aggression: '',
      Interceptions: '',
      Positioning: '',
      Vision: '',
      Penalties: '',
      Composure: '',
      Marking: '',
      StandingTackle: '',
      SlidingTackle: '',
      GKDiving: '',
      GKHandling: '',
      GKKicking: '',
      GKPositioning: '',
      GKReflexes: '',
      PlayerName: ''
    });
    setPredictedPrice(null);
  };

  const renderField = (fieldName, label, type = 'number') => (
    <div key={fieldName} className="form-group">
      <label htmlFor={fieldName}>{label}</label>
      <input
        type={type}
        id={fieldName}
        name={fieldName}
        value={playerData[fieldName]}
        onChange={handleInputChange}
        placeholder={`Entrer ${label.toLowerCase()}`}
        className="form-input"
        min={type === 'number' ? '0' : undefined}
        max={type === 'number' ? '100' : undefined}
        step={fieldName === 'Wage' ? '1000' : '1'}
      />
    </div>
  );

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const fetchAvailableModels = async () => {
    setIsLoadingModels(true);
    try {
      const response = await fetch('http://127.0.0.1:7000/modele/all/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setAvailableModels(result.data || []);
    } catch (error) {
      showNotification("Erreur lors du chargement des modèles", true);
      console.error("Error fetching models:", error);
      setAvailableModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);


  useEffect(() => {
    fetchAvailableModels();
  }, []);


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
          <h1>Lancer une prédiction</h1>
          <p>Obtenez une estimation précise de la valeur d'un joueur en analysant plus de 100 critères techniques, physiques et contextuels.</p>
        </div>
        <div className="model-selection-corner">
          <div className="model-dropdown-container">
            <h3>Modèle de prédiction :</h3>
            {isLoadingModels ? (
              <div className="loading-models">Chargement...</div>
            ) : availableModels.length === 0 ? (
              <div className="no-models">Aucun modèle disponible</div>
            ) : (
              <select 
                value={selectedModel} 
                onChange={handleModelChange} 
                className="select-model"
              >
                <option value="">-- Sélectionner un modèle --</option>
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.nom} ({model.statut})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className='top'>
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-section">
            <h4>Informations de base</h4>
            {renderField('PlayerName', 'Nom du joueur', 'text')}
            {renderField('Age', 'Âge')}
            <div className="form-group">
              <label htmlFor="Position">Position</label>
              <select
                id="Position"
                name="Position"
                value={playerData.Position}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner une position</option>
                <option value="1"> 1 </option>
                <option value="2"> 2 </option>
                <option value="3"> 3 </option>
                <option value="4"> 4 </option>
                <option value="5"> 5 </option>
              </select>
            </div>
            {renderField('Wage', 'Salaire (€)')}
            
            <h4>Attaque</h4>
            <div className="form-grid">
              {renderField('Crossing', 'Centres')}
              {renderField('Finishing', 'Finition')}
              {renderField('HeadingAccuracy', 'Jeu de tête')}
              {renderField('Volleys', 'Volées')}
              {renderField('Dribbling', 'Dribbles')}
              {renderField('Curve', 'Effet')}
              {renderField('FKAccuracy', 'Précision coup franc')}
              {renderField('LongShots', 'Tirs de loin')}
              {renderField('ShotPower', 'Puissance de tir')}
            </div>
          </div>

          <div className="form-section">
            <h4>Milieu</h4>
            <div className="form-grid">
              {renderField('ShortPassing', 'Passes courtes')}
              {renderField('LongPassing', 'Passes longues')}
              {renderField('BallControl', 'Contrôle de balle')}
              {renderField('Vision', 'Vision')}
              {renderField('Positioning', 'Positionnement')}
            </div>
            
            <h4>Défense</h4>
            <div className="form-grid">
              {renderField('Interceptions', 'Interceptions')}
              {renderField('Marking', 'Marquage')}
              {renderField('StandingTackle', 'Tacles debout')}
              {renderField('SlidingTackle', 'Tacles glissés')}
              {renderField('Aggression', 'Agressivité')}
            </div>
          </div>

          <div className="form-section">
            <h4>Physique</h4>
              {renderField('Acceleration', 'Accélération')}
              {renderField('SprintSpeed', 'Vitesse')}
              {renderField('Agility', 'Agilité')}
              {renderField('Reactions', 'Réactions')}
              {renderField('Balance', 'Équilibre')}
              {renderField('Jumping', 'Détente')}
              {renderField('Stamina', 'Endurance')}
              {renderField('Strength', 'Force')}

            <h4>Gardien</h4>
            <div className="form-grid">
              {renderField('GKDiving', 'Plongeons')}
              {renderField('GKHandling', 'Prise de balle')}
              {renderField('GKKicking', 'Dégagements')}
              {renderField('GKPositioning', 'Positionnement')}
              {renderField('GKReflexes', 'Réflexes')}
            </div>
          </div>

          <div className="form-actions">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              className="submit-btn"
              disabled={notification.isLoading}
            >
              {notification.isLoading ? 'Traitement...' : 'Évaluer le joueur'}
            </Button>
            <Button 
              type="button" 
              variant="outlined" 
              color="secondary"
              onClick={handleReset}
              className="cancel-btn"
              disabled={notification.isLoading}
            >
              Réinitialiser
            </Button>
          </div>
        </form>
        </div>

        {predictedPrice && (
  <div className="prediction-result">
    <div className="result-header">
      <svg className="trophy-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5M17,3V4L17.8,4.3C19.2,4.9 20.3,6.1 20.8,7.5L21,8H22V10H21L20.8,10.5C20.3,11.9 19.2,13.1 17.8,13.7L17,14V15H15V14L14.2,13.7C12.8,13.1 11.7,11.9 11.2,10.5L11,10H10V8H11L11.2,7.5C11.7,6.1 12.8,4.9 14.2,4.3L15,4V3H17M7,5V7H8V5H7M5,6V8H6V6H5M3,7V9H4V7H3M7,16V18H8V16H7M5,17V19H6V17H5M3,18V20H4V18H3Z" />
      </svg>
      <h3>Résultat de l'évaluation</h3>
    </div>
    
    <div className="price-display">
      <span className="price-value">{predictedPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      <span className="currency">€</span>
    </div>
    
    <div className="confidence-indicator">
      <div className="confidence-bar" style={{ width: '85%' }}></div>
      <span>Fiabilité: 77%</span>
    </div>
    
    <div className="result-footer">
      <Button 
        variant="contained" 
        color="secondary"
        size="small"
        onClick={() => navigator.clipboard.writeText(predictedPrice.toString())}
      >
        Copier la valeur
      </Button>
      <span className="timestamp">
        {new Date().toLocaleString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
  </div>
)}
      </div>

      <Footer />
    </div> 
  );
};

export default Prediction;