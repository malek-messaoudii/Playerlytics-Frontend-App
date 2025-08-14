import React from "react";
import "./Accueil.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import foot from "../assets/foot.jpg";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import IconButton from '@mui/material/IconButton';
import org from '../assets/malik.jpg'
import { Link } from 'react-router-dom';


const Accueil = () => {
  const navigate = useNavigate();
 /* const userRole = 'admin'; */
  /* const userRole = 'Ai engineer'; */
  const userRole = localStorage.getItem('userRole') || 'default'; 
  /*const userRole = 'default'; */


  const scrollToAbout = () => {
    const aboutSection = document.querySelector('.about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Contenu personnalisé selon le rôle
  const getBannerContent = () => {
    const contents = {
      organisation: {
        title: "Votre Portail de Recrutement",
        subtitle: "Découvrez les pépites du football africain",
        buttonText: "Explorer Vos Talents",
        buttonPath: "/rapports" 
      },
      'Aiengineer': {
        title: "Laboratoire d'Intelligence Artificielle",
        subtitle: "Développez les modèles de demain",
        buttonText: "Accéder aux Outils IA",
         buttonPath: "/modele"
      },
      'Datascientest': {
        title: "Centre d'Analyses Avancées",
        subtitle: "Transformez les données en insights",
        buttonText: "Voir les Tableaux de Bord"
      }
    };

    return contents[userRole] || null;
  };

  const bannerContent = getBannerContent();

  // Style personnalisé seulement pour les rôles connectés
  const getCustomStyle = () => {
    if (!userRole) return {};
    
    const styles = {
    organisation: {
  background: `url(${org})`,
  backgroundSize: 'cover',
  color: '#00000',
  textShadow: '0 2px 4px hsla(0, 0.00%, 0.00%, 0.90)',
  
  
},
      'Aiengineer': {
        background: 'linear-gradient(135deg, #553c9a 0%, #9f7aea 100%)',
        border: '2px solid #9f7aea'
      },
      'Datascientest': {
        background: 'linear-gradient(135deg, #9c4221 0%, #ed8936 100%)',
        border: '2px solid #ed8936'
      }
    };

    return styles[userRole] || {};
  };

  const customStyle = getCustomStyle();

  return (
    <div>
      <Navbar/>
      {/* Ajout du bouton de chat uniquement pour organisation */}
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
      <div className="home-container">
        <section 
          className="banner"
          style={customStyle}
        >
          {bannerContent ? (
            <>
            <div className="ho">
              <h1>{bannerContent.title}</h1> 
              <p>{bannerContent.subtitle}</p>
              <button 
          className="cta-button"
          onClick={() => {
            if (userRole === 'organisation') {
              navigate('/rapports');
            } else if (userRole === 'Aiengineer') {
              navigate('/modele');
            } else if (userRole === 'Datascientest'){
              navigate('/analyses');
            } else {
              scrollToAbout(); // ou toute autre action par défaut
            }
          }}
        >
          {bannerContent.buttonText}
        </button></div>
            </>
            
          ) : (
            <>
              <h1>Bienvenue sur PlayerLytics ⚽</h1>
              <p>Optimisez vos recrutements et prévenez les fraudes grâce à l'IA.</p>
              <button className="cta-button" onClick={scrollToAbout}>Découvrir</button>
            </>
          )}
        </section>

        <section className="services">
          <h2>Nos Services</h2>
          <div className="service-cards">
            <div className="service-card">
              <div className="service-icon">📈</div>
              <h3>Prédiction de Valeur</h3>
              <p>
                Notre algorithme analyse plus de 100 paramètres pour estimer avec précision 
                la valeur marchande des joueurs.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🕵️</div>
              <h3>Détection de Fraude</h3>
              <p>
                Système intelligent qui identifie les anomalies dans les transferts et 
                prévient les surfacturations suspectes avec 95% de précision.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🤖</div>
              <h3>Chatbot Football</h3>
              <p>
                Assistant virtuel disponible 24/7 pour répondre à toutes vos questions 
                sur les joueurs africains et leurs performances.
              </p>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <h2>À Propos de Nous</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Fondée en 2025, PlayerLytics révolutionne le scouting footballistique grâce à 
                une combinaison unique d'intelligence artificielle et d'expertise terrain.
              </p>
              <p>
                Notre plateforme analyse plus de 2.000 joueurs à travers le continent africain, 
                offrant aux clubs et aux agents des insights inédits pour des recrutements éclairés.
              </p>
              <p>
                <strong>Notre mission :</strong>  Rendre les données accessibles, fiables et transparentes pour un marché des transferts plus équitable, en intégrant la prédiction des prix et la détection des fraudes.
              </p>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">2K+</span>
                  <span className="stat-label">Joueurs analysés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Précision</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
            <div className="about-image">
            <img alt="" src={foot} height={600} width={450} className="img"></img>             
              <div className="image-placeholder"></div>
            </div>
          </div>
        </section>

        <section className="values">
            <h2 className="touk">Nos Valeurs</h2>
            <div className="values-grid">
    <div className="value-card">
      <span className="value-icon">🔍</span>
      <div>
        <h4>Transparence</h4>
        <p>Données brutes et méthodologies accessibles</p>
      </div>
    </div>
    
    <div className="value-card">
      <span className="value-icon">🚀</span>
      <div>
        <h4>Innovation</h4>
        <p>Technologies IA de pointe constamment améliorées</p>
      </div>
    </div>
    
    <div className="value-card">
      <span className="value-icon">📊</span>
      <div>
        <h4>Précision</h4>
        <p>Algorithmes validés par des experts du football</p>
      </div>
    </div>
  </div>
</section>
    {(!userRole || (userRole !== 'Aiengineer' && userRole !== 'Datascientest')) && (
        <section className="contact">
          <h2>Rejoignez la révolution</h2>
          <p>
            Clubs, investisseurs : accédez à des insights exclusifs pour 
            transformer votre stratégie de recrutement.
          </p>
          <button 
            className="cta-button"
            onClick={() => navigate('/contact')}
          >
            Nous Contacter
          </button>
        </section> )} 
      </div>
      <Footer/>
    </div>
  );
};

export default Accueil;