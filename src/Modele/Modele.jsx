import React, { useState, useEffect } from "react";
import axios from "axios";
import './Modele.css';
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Modele = () => {
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editModelId, setEditModelId] = useState(null);
  const [newModel, setNewModel] = useState({
    nom: "",
    statut: "En développement",
    lien_notebook: ""
  });
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:7000/modele/all/");
      setModels(response.data.data || []); // Access the array in response.data.data
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des modèles");
      console.error("Fetch error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const id = localStorage.getItem('id');
  console.log(id) 


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewModel(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = localStorage.getItem('id');
      const modelToSend = {
        ...newModel,
        id_aiengineer: id, 
      };
  
      if (editModelId) {
        await axios.put(`http://127.0.0.1:7000/modele/update/${editModelId}/`, modelToSend);
      } else {
        await axios.post("http://127.0.0.1:7000/modele/add/", modelToSend);
      }
      await fetchModels();
      setNewModel({ nom: "", statut: "En développement", lien_notebook: "" });
      setShowForm(false);
      setEditModelId(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement du modèle");
      console.error("Submit error:", err.response || err);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleEdit = (model) => {
    setEditModelId(model.id);
    setNewModel({
      nom: model.nom,
      statut: model.statut,
      lien_notebook: model.lien_notebook || ""
    });
    setShowForm(true);
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:7000/modele/get/${id}/`);
      alert(JSON.stringify(response.data.data, null, 2)); // Replace with modal or UI
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement du modèle");
      console.error("View error:", err.response || err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce modèle ?")) {
      setDeleteLoading(true);
      try {
        await axios.delete(`http://127.0.0.1:7000/modele/delete/${id}/`);
        setModels(models.filter(model => model.id !== id));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de la suppression");
        console.error("Delete error:", err.response || err);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const filteredModels = models.filter(model => 
    model.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modele-container">
      <Navbar />
      <div className="contact-header">
        <h1>Mes modèles</h1>
        <p>Retrouvez ici tous vos modèles créés.</p>
      </div>
      
      <div className="models-page">
        {error && <div className="error-message">{error}</div>}

        <div className="models-header">
          <button 
            className="add-model-btn" 
            onClick={() => {
              setEditModelId(null);
              setNewModel({ nom: "", statut: "En développement", lien_notebook: "" });
              setShowForm(true);
            }}
            disabled={loading || deleteLoading}
            aria-label="Ajouter un nouveau modèle"
          >
            + Ajouter un Modèle
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={handleSearch}
            disabled={loading || deleteLoading}
            aria-label="Rechercher un modèle"
          />
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        {loading ? (
          <div className="loading-message1">
            <div className="spinner1"></div>
            <p>Chargement des modèles...</p>
          </div>
        ) : models.length === 0 ? (
          <div className="empty-state">
             <p> Aucun modèle disponible <br/>
          <small>Commencez par créer votre premier modèle d'IA</small> </p>
          </div>
        ) : (
          <div className="models-table-container">
            <table className="models-table">
              <thead className="or">
                <tr>
                  <th>Nom du Modèle</th>
                  <th>Date de Création</th>
                  <th>Lien du notebook</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <tr key={model.id}>
                    <td>
                      <span className="model-name">{model.nom}</span>
                    </td>
                    <td>{new Date(model.date_creation).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</td>
                    <td>
                      {model.lien_notebook ? (
                        <a 
                          href={model.lien_notebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="notebook-link"
                        >
                          Voir notebook
                        </a>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${model.statut.toLowerCase().replace(' ', '-')}`}>
                        {model.statut}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEdit(model)}
                        title="Modifier"
                        aria-label={`Modifier le modèle ${model.nom}`}
                        disabled={deleteLoading}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(model.id)}
                        title="Supprimer"
                        aria-label={`Supprimer le modèle ${model.nom}`}
                        disabled={deleteLoading}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overla" onClick={() => setShowForm(false)}>
          <div className="model-form-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="close-btn"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
              aria-label="Fermer le formulaire"
            >
              ×
            </button>
            <h2>{editModelId ? "Modifier le modèle" : "Ajouter un nouveau modèle"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom du modèle *</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Mon super modèle"
                  value={newModel.nom}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Statut *</label>
                <select
                  name="statut"
                  value={newModel.statut}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="En développement">En développement</option>
                  <option value="En test">En test</option>
                  <option value="En production">En production</option>
                  <option value="Archivé">Archivé</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Lien du notebook (optionnel)</label>
                <input
                  type="url"
                  name="lien_notebook"
                  placeholder="https://colab.research.google.com/..."
                  value={newModel.lien_notebook}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  aria-label="Annuler"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                  aria-label={editModelId ? "Modifier le modèle" : "Ajouter le modèle"}
                >
                  {isSubmitting ? 'Enregistrement...' : editModelId ? 'Modifier' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Modele;