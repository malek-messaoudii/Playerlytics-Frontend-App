import React, { useState, useEffect } from 'react';
import './Analyses.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { FiUsers, FiLink, FiBarChart2 } from 'react-icons/fi';
import axios from 'axios';

const Analyses = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [dashboardLink, setDashboardLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:7000/player/getnameteam/');
        const teamsWithDashboards = await Promise.all(
          response.data.teams.map(async (team, index) => {
            try {
              const dashboardRes = await axios.get(`http://127.0.0.1:7000/user/dashboard/?nomclub=${team}`);
              return {
                id: index + 1,
                name: team,
                country: 'Africa',
                logo: `${team.toLowerCase().replace(/\s+/g, '-')}.png`,
                lastReportDate: getRandomDate(),
                liendash: dashboardRes.data?.organisation?.liendash || ''
              };
            } catch (err) {
              return {
                id: index + 1,
                name: team,
                country: 'Africa',
                logo: `${team.toLowerCase().replace(/\s+/g, '-')}.png`,
                lastReportDate: getRandomDate(),
                liendash: ''
              };
            }
          })
        );
        setTeams(teamsWithDashboards);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const getRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
  };

  const handleSaveDashboardLink = async () => {
    if (!selectedClub || !dashboardLink) return;

    try {
      setIsSaving(true);
      await axios.put('http://127.0.0.1:7000/user/dashboard/', {
        nomclub: selectedClub.name,
        liendash: dashboardLink
      });

      // Mettre à jour l'état local
      setTeams(teams.map(team => 
        team.id === selectedClub.id 
          ? { ...team, liendash: dashboardLink } 
          : team
      ));
      
      setDashboardLink('');
      alert('Lien du dashboard enregistré avec succès!');
    } catch (err) {
      alert('Erreur lors de la sauvegarde du lien: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredClubs = teams.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="analyses-page">
        <Navbar/>
        <div className="loading-container">
          <p>Chargement des équipes...</p>
        </div>
        <Footer/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analyses-page">
        <Navbar/>
        <div className="error-container">
          <p>Erreur lors du chargement des équipes: {error}</p>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="analyses-page">
      <Navbar/>
      <div className="datascientist-dashboard">
        <div className="contact-header">
          <h1>Gestion des Dashboards</h1>
          <p>Configurez les liens Power BI pour les clubs</p>
        </div>
        
        <div className="dashboard-container">
          <div className="dashboard-layout">
            <div className="club-list">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Rechercher un club..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <h3><FiUsers /> Clubs Africains</h3>
              <ul>
                {filteredClubs.map(club => (
                  <li 
                    key={club.id} 
                    className={selectedClub?.id === club.id ? 'active' : ''}
                    onClick={() => {
                      setSelectedClub(club);
                      setDashboardLink(club.liendash || '');
                    }}
                  >
                    <div className="club-info">
                      <span className="club-name">{club.name}</span>
                      <span className="club-country">{club.country}</span>
                      {club.liendash && (
                        <span className="dashboard-indicator">
                          <FiLink /> Dashboard configuré
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="main-content">
              {selectedClub ? (
                <div className="workspace">
                  <div className="dashboard-config-section">
                    <h2><FiBarChart2 /> Configuration du dashboard pour {selectedClub.name}</h2>
                    
                    <div className="dashboard-form">
                      <label>Lien Power BI</label>
                      <input
                        type="url"
                        placeholder="https://app.powerbi.com/..."
                        value={dashboardLink}
                        onChange={(e) => setDashboardLink(e.target.value)}
                      />
                      
                      <button 
                        onClick={handleSaveDashboardLink}
                        disabled={!dashboardLink || isSaving}
                      >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer le lien'}
                      </button>
                    </div>

                    {selectedClub.liendash && (
                      <div className="dashboard-preview">
                        <h3>Aperçu du dashboard</h3>
                        <iframe 
                          title={`Dashboard ${selectedClub.name}`}
                          src={selectedClub.liendash} 
                          width="100%" 
                          height="600px"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <iframe 
                    title="powerbi-v0" 
                    src="https://app.powerbi.com/view?r=eyJrIjoiMGU0ODIxNTYtOGY2MC00ZDkxLWEzNWQtOTU2NzczZjIzOTFmIiwidCI6ImEyZDgzMzZlLWEyOTktNGQ1Mi04NjM2LWI3ZWY4YzExN2ExZCIsImMiOjh9" 
                    frameBorder="0" 
                    allowFullScreen
                    height={700}
                    width={1100}
                  />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Analyses;