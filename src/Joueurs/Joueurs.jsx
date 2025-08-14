import React, { useEffect, useState } from 'react';
import './Joueurs.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Joueurs = () => {
  const userEmail = localStorage.getItem('userEmail');
  const clubName = localStorage.getItem('clubname');

  const [players, setPlayers] = useState([]);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 5;
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const [playerForm, setPlayerForm] = useState({
    player_name: '',
    age: '',
    position: '',
    market_value: '',
    currency: '€',
    country_name: '',
    preferred_foot: 'Droit',
    jersey_number: '',
    height: '',
    date_of_birth: '',
    contract_until: ''
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isError: false,
    isLoading: false
  });

  useEffect(() => {
    fetchPlayers();
  }, [clubName]);

  const fetchPlayers = async () => {
    if (!clubName) return;

    setNotification({ show: true, message: 'Chargement des joueurs...', isLoading: true, isError: false });

    try {
      const response = await fetch(`http://127.0.0.1:7000/player/team/${clubName}/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des joueurs');
      }

      setPlayers(data);
      setNotification({ show: false, message: '', isLoading: false, isError: false });
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        isError: true,
        isLoading: false
      });

      setTimeout(() => {
        setNotification({ show: false, message: '', isError: false, isLoading: false });
      }, 5000);
    }
  };

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(players.length / playersPerPage);

  const handleViewDetails = (player) => {
    setExpandedPlayer(player);
  };

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPlayer = () => {
    setIsAddingPlayer(true);
    setIsEditing(false);
    setCurrentPlayer(null);
    setPlayerForm({
      player_name: '',
      age: '',
      position: '',
      market_value: '',
      currency: '€',
      country_name: '',
      preferred_foot: 'Droit',
      jersey_number: '',
      height: '',
      date_of_birth: '',
      contract_until: ''
    });
  };

  const handleEditPlayer = (player) => {
    setIsEditing(true);
    setIsAddingPlayer(true);
    setCurrentPlayer(player);
    setPlayerForm({
      player_name: player.player_name,
      age: player.age,
      position: player.position,
      market_value: player.market_value,
      currency: player.currency,
      country_name: player.country_name,
      preferred_foot: player.preferred_foot,
      jersey_number: player.jersey_number || '',
      height: player.height || '',
      date_of_birth: player.date_of_birth,
      contract_until: player.contract_until || ''
    });
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return;

    setNotification({ show: true, message: 'Suppression en cours...', isLoading: true, isError: false });

    try {
      const response = await fetch(`http://127.0.0.1:7000/player/delete/${playerId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du joueur');
      }

      setNotification({ show: true, message: 'Joueur supprimé avec succès', isLoading: false, isError: false });
      fetchPlayers();
      
      setTimeout(() => {
        setNotification({ show: false, message: '', isLoading: false, isError: false });
      }, 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        isError: true,
        isLoading: false
      });

      setTimeout(() => {
        setNotification({ show: false, message: '', isError: false, isLoading: false });
      }, 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ show: true, message: 'Enregistrement en cours...', isLoading: true, isError: false });

    try {
      const url = isEditing 
        ? `http://127.0.0.1:7000/player/update/${currentPlayer.player_id}/`
        : 'http://127.0.0.1:7000/player/addplayer/';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const playerData = {
        ...playerForm,
        team_name: clubName
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setNotification({ 
        show: true, 
        message: isEditing ? 'Joueur mis à jour avec succès' : 'Joueur ajouté avec succès', 
        isLoading: false, 
        isError: false 
      });
      
      setIsAddingPlayer(false);
      fetchPlayers();
      
      setTimeout(() => {
        setNotification({ show: false, message: '', isLoading: false, isError: false });
      }, 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        isError: true,
        isLoading: false
      });

      setTimeout(() => {
        setNotification({ show: false, message: '', isError: false, isLoading: false });
      }, 5000);
    }
  };

  return (
    <div className="account-page">
      <Navbar />

      {notification.show && (
        <div className={`notification ${notification.isError ? 'error' : ''}`}>
          <div className="notification-content">
            {notification.isLoading && !notification.isError && <div className="spinner"></div>}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="contact-container">
        <div className="contact-header">
          <div>
            <h1>Mes joueurs</h1>
            <p>Centralisez la gestion de vos joueurs.</p>
            </div>
        </div>

        {userEmail && (
          <div className="circle-container">
            <span className="message">Salut, comment je peux vous aider ?</span>
            <IconButton href="/chat">
              <div className="circle"><ChatBubbleIcon /></div>
            </IconButton>
          </div>
        )}

        <div className="table-container">
          <table className="players-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Âge</th>
                <th>Position</th>
                <th>Valeur</th>
                <th>Nationalité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPlayers.map((player, index) => (
                <tr key={index}>
                  <td>{player.player_name}</td>
                  <td>{player.age}</td>
                  <td>{player.position}</td>
                  <td>{player.market_value} {player.currency}</td>
                  <td>{player.country_name}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewDetails(player)}
                    >
                      <VisibilityIcon />
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditPlayer(player)}
                    >
                      <EditIcon />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePlayer(player.player_id)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>Précédent</button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>Suivant</button>
          </div>
        </div>
        <button className="ajout" onClick={handleAddPlayer}>
           Ajouter un joueur
          </button>
      </div>

      {isAddingPlayer && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setIsAddingPlayer(false)}>
              ×
            </button>
            <h2>{isEditing ? 'Modifier le joueur' : 'Ajouter un joueur'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom du joueur</label>
                <input
                  type="text"
                  className="form-control"
                  name="player_name"
                  value={playerForm.player_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Âge</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={playerForm.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="position"
                    value={playerForm.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valeur marchande</label>
                  <input
                    type="number"
                    className="form-control"
                    name="market_value"
                    value={playerForm.market_value}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Devise</label>
                  <select
                    className="form-control"
                    name="currency"
                    value={playerForm.currency}
                    onChange={handleInputChange}
                  >
                    <option value="€">€</option>
                    <option value="$">$</option>
                    <option value="£">£</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nationalité</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country_name"
                    value={playerForm.country_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pied préféré</label>
                  <select
                    className="form-control"
                    name="preferred_foot"
                    value={playerForm.preferred_foot}
                    onChange={handleInputChange}
                  >
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Numéro de maillot</label>
                  <input
                    type="number"
                    className="form-control"
                    name="jersey_number"
                    value={playerForm.jersey_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Taille (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="height"
                    value={playerForm.height}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date de naissance</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={playerForm.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Contrat jusqu'à</label>
                  <input
                    type="date"
                    className="form-control"
                    name="contract_until"
                    value={playerForm.contract_until}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setIsAddingPlayer(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-submit">
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Détails du joueur en overlay */}
      {expandedPlayer && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setExpandedPlayer(null)}>
              ×
            </button>
            <h2>Détails du joueur</h2>
            
            <div className="form-rowA">
              <div className="form-groupA">
                <label>Nom</label>
                <p>{expandedPlayer.player_name}</p>
              </div>
              <div className="form-groupA">
                <label>Âge</label>
                <p>{expandedPlayer.age}</p>
              </div>
            </div>

            <div className="form-rowA">
              <div className="form-groupA">
                <label>Position</label>
                <p>{expandedPlayer.position}</p>
              </div>
              <div className="form-groupA">
                <label>Valeur marchande</label>
                <p>{expandedPlayer.market_value} {expandedPlayer.currency}</p>
              </div>
            </div>

            <div className="form-rowA">
              <div className="form-groupA">
                <label>Nationalité</label>
                <p>{expandedPlayer.country_name}</p>
              </div>
              <div className="form-groupA">
                <label>Pied préféré</label>
                <p>{expandedPlayer.preferred_foot}</p>
              </div>
            </div>

            <div className="form-rowA">
              <div className="form-groupA">
                <label>Numéro de maillot</label>
                <p>{expandedPlayer.jersey_number || 'N/A'}</p>
              </div>
              <div className="form-groupA">
                <label>Taille</label>
                <p>{expandedPlayer.height ? `${expandedPlayer.height} cm` : 'N/A'}</p>
              </div>
            </div>

            <div className="form-rowA">
              <div className="form-groupA">
                <label>Date de naissance</label>
                <p>{expandedPlayer.date_of_birth}</p>
              </div>
              <div className="form-groupA">
                <label>Contrat jusqu'à</label>
                <p>{expandedPlayer.contract_until || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Joueurs;