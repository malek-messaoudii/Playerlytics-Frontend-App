import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gestionadmin.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import AdminSidebar from "../SidebarAdmin/Sidebar";
import { Modal, Button, Table, Form, Spinner, Alert } from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function Gestionadmin() {
  const [admins, setAdmins] = useState({
    aiengineers: [],
    datascientists: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    profession: "",
    is_active: true
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://127.0.0.1:7000/user/getalladmins/");
        setAdmins(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEdit = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      email: admin.email || "",
      profession: admin.profession || "",
      is_active: admin.is_active || true
    });
    setShowModal(true);
  };

  const handleDelete = async (adminId, role) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      try {
        await axios.delete(`http://127.0.0.1:7000/user/users/${adminId}/`);
        // Update the state based on the role
        if (role === "Aiengineer") {
          setAdmins(prev => ({
            ...prev,
            aiengineers: prev.aiengineers.filter(admin => admin.id !== adminId)
          }));
        } else {
          setAdmins(prev => ({
            ...prev,
            datascientists: prev.datascientists.filter(admin => admin.id !== adminId)
          }));
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      if (currentAdmin) {
        // Update existing admin
        await axios.put(
          `http://127.0.0.1:7000/user/users/${currentAdmin.id}/`,
          formData
        );
      } else {
        // Add new admin
        await axios.post("http://127.0.0.1:7000/user/users/", formData);
      }
      
      // Refresh admin list
      const response = await axios.get("http://127.0.0.1:7000/user/getalladmins/");
      setAdmins(response.data);
      handleCloseModal();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAdmin(null);
    setFormData({
      email: "",
      profession: "",
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

  // Combine both admin types for display
  const allAdmins = [
    ...admins.aiengineers.map(admin => ({ ...admin, role: "Aiengineer" })),
    ...admins.datascientists.map(admin => ({ ...admin, role: "Datascientest" }))
  ];

  return (
    <div className="gestionorg-container">
      <Navbar />
      <div className="main-content">
        <AdminSidebar />
        <div className="content">
          <h2 className="tit">Gestion des sous-administrateurs</h2>
          
          
          
          {allAdmins.length === 0 ? (
            <Alert variant="info" className="mt-3">
              Aucun sous-admin trouvé. Cliquez sur "Ajouter un sous-administrateur" pour commencer.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Profession</th>
                    <th>Date de création</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allAdmins.map(admin => (
                    <tr key={`${admin.role}-${admin.id}`}>
                      <td>{admin.id}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>{admin.profession || "-"}</td>
                      <td>{new Date(admin.datecreation).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${admin.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {admin.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="text-nowrap">
  <div className="btn-group-custom">
    <Button 
      variant="outline-warning" 
      size="sm" 
      onClick={() => handleEdit(admin)}
      className="edit-btn"
    >
      <FiEdit />
    </Button>
    <Button 
      variant="outline-danger" 
      size="sm" 
      onClick={() => handleDelete(admin.id, admin.role)}
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
             Ajouter un sous-administrateur
          </Button>
        </div>
      </div>
      <Footer />

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAdmin ? "Modifier un administrateur" : "Ajouter un nouvel administrateur"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profession</Form.Label>
              <Form.Control
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="is_active"
                name="is_active"
                label="Compte actif"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Annuler
              </Button>
              <Button variant="primary" type="submit" disabled={submitLoading}>
                {submitLoading ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Enregistrement...</span>
                  </>
                ) : currentAdmin ? (
                  "Mettre à jour"
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}