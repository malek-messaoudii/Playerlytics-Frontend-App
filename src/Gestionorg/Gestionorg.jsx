import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gestionorg.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import AdminSidebar from "../SidebarAdmin/Sidebar";
import { Button, Table, Form, Spinner, Alert } from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function Gestionorg() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentClub, setCurrentClub] = useState(null);
  const [formData, setFormData] = useState({
      nomclub: "",
      localisation: "",
      nomresponsable: "",
      email: "",
      telephone: "",
      idfederal: "",
      password: "",
      confirmPassword: "",
      is_active: true
    });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch clubs from API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://127.0.0.1:7000/user/users/");
        setClubs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEdit = (club) => {
    setCurrentClub(club);
    setFormData({
      nomclub: club.nomclub || "",
      localisation: club.localisation || "",
      nomresponsable: club.nomresponsable || "",
      email: club.email || "",
      telephone: club.telephone || "",
      idfederal: club.idfederal || "",
      is_active: club.is_active || true
    });
    setShowModal(true);
  };

  const handleDelete = async (clubId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce club ?")) {
      try {
        await axios.delete(`http://127.0.0.1:7000/user/delete/${clubId}`);
        setClubs(clubs.filter(club => club.id !== clubId));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
  
    // Validation du mot de passe pour la création
    if (!currentClub && formData.password !== formData.confirmPassword) {
      setSubmitError("Les mots de passe ne correspondent pas");
      setSubmitLoading(false);
      return;
    }
  
    try {
      const dataToSend = {
        nomclub: formData.nomclub,
        localisation: formData.localisation,
        nomresponsable: formData.nomresponsable,
        email: formData.email,
        telephone: formData.telephone,
        idfederal: formData.idfederal,
        is_active: formData.is_active
      };
  
      // Ajouter le mot de passe seulement pour la création
      if (!currentClub) {
        dataToSend.password = formData.password;
      }
  
      if (currentClub) {
        // Update existing club
        await axios.put(
          `http://127.0.0.1:7000/user/updateuser/${currentClub.email}/`,
          dataToSend
        );
      } else {
        // Add new club
        await axios.post("http://127.0.0.1:7000/user/register/", dataToSend);
      }
      
      // Refresh club list
      const response = await axios.get("http://127.0.0.1:7000/user/users/");
      setClubs(Array.isArray(response.data) ? response.data : []);
      handleCloseModal();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentClub(null);
    setFormData({
      nomclub: "",
      localisation: "",
      nomresponsable: "",
      telephone: "",
      email: "",
      idfederal: "",
      is_active: true
    });
    setSubmitError(null);
  };

  if (loading) {
    return (
      <div className="gestionorg-container">
        <Navbar />
        <div className="main-content">
          <AdminSidebar />
          <div className="content text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p>Chargement des données en cours...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="gestionorg-container">
        <Navbar />
        <div className="main-content">
          <AdminSidebar />
          <div className="content">
            <Alert variant="danger" className="mt-3">
              <Alert.Heading>Erreur</Alert.Heading>
              <p>{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </Alert>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="gestionorg-container">
      <Navbar />
      <div className="main-content">
        <AdminSidebar />
        <div className="content">
          <h2 className="tit">Gestion des clubs</h2>
          
          {clubs.length === 0 ? (
            <Alert variant="info" className="mt-3">
              Aucun club trouvé. Cliquez sur "Ajouter un club" pour commencer.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Nom du club</th>
                    <th>Email du club</th>
                    <th>Responsable</th>
                    <th>Téléphone</th>
                    <th>ID Fédéral</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clubs.map(club => (
                    <tr key={club.id}>
                      <td>{club.nomclub}</td>
                      <td>{club.email}</td>
                      <td>{club.nomresponsable}</td>
                      <td>{club.telephone || "-"}</td>
                      <td>{club.idfederal || "-"}</td>
                      <td>
                        <span className={`badge ${club.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {club.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="text-nowrap">
                      <div className="btn-group-custom">
                        <Button 
                          variant="outline-warning" 
                          onClick={() => handleEdit(club)}
                          className="edit-btn"
                        >
                          <FiEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleDelete(club.id)}
                          className="delete-btn"
                        >
                          <FiTrash2 />
                        </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
            className="add1"
          >
            Ajouter un club
          </Button>
        </div>
      </div>
      <Footer />

      {/* Add/Edit Modal Overlay */}
      {/* Dans le modal */}
      <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title">
        {currentClub ? "Modifier un club" : "Ajouter un nouveau club"}
      </h5>
      <button type="button" className="btn-close" onClick={handleCloseModal}>
        &times;
      </button>
    </div>
    <div className="modal-body">
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      <Form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <Form.Label>Nom du club</Form.Label>
            <Form.Control
              type="text"
              name="nomclub"
              value={formData.nomclub}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <Form.Label>Localisation</Form.Label>
            <Form.Control
              type="text"
              name="localisation"
              value={formData.localisation}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <Form.Label>Nom du responsable</Form.Label>
            <Form.Control
              type="text"
              name="nomresponsable"
              value={formData.nomresponsable}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={!!currentClub} // Désactiver pour l'édition
              className="form-input"
            />
          </div>

          <div className="form-group">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <Form.Label>ID Fédéral</Form.Label>
            <Form.Control
              type="text"
              name="idfederal"
              value={formData.idfederal}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          {/* Afficher seulement pour l'ajout */}
          {!currentClub && (
            <>
              <div className="form-group">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!currentClub}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <Form.Label>Confirmer Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!currentClub}
                  className="form-input"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <Form.Check
              type="switch"
              id="is_active"
              name="is_active"
              label="Club actif"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="form-switch"
            />
          </div>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={handleCloseModal} className="cancel-btn">
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={submitLoading} className="submit-btn">
            {submitLoading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" />
                <span className="ms-2">Enregistrement...</span>
              </>
            ) : currentClub ? (
              "Mettre à jour"
            ) : (
              "Ajouter"
            )}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</div>
    </div>
  );
}