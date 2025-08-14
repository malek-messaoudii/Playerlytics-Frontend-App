import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Contact from './Contact/Contact';
import Accueil from './Accueil/Accueil';
import Signup from './Signup/Signup';
import Compte from './Compte/Compte';
import DashboardAdmin from './DashboardAdmin/DashboardAdmin';
import Chatbot from './Chatbot/Chatbot.tsx';
import './App.css';
import Gestionorg from './Gestionorg/Gestionorg.jsx';
import Gestionadmin from './Gestionadmin/Gestionadmin.jsx';
import Joueurs from './Joueurs/Joueurs.jsx';
import Rapports from './Rapports/Rapports.jsx';
import Prediction from './Prediction/Prediction.jsx';
import Historique from './Historique/Historique.jsx';
import Analyses from './Analyses/Analyses.jsx';
import Modele from './Modele/Modele.jsx';
import Evaluation from './Evaluation/Evaluation.jsx';
import Fraude from './Fraude/Fraude.jsx';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Compte" element={<Compte />} />
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/chat" element={<Chatbot/>} />
          <Route path="/gestionorg" element={<Gestionorg/>} />
          <Route path="/gestionadmin" element={<Gestionadmin/>} />
          <Route path="/joueurs" element={<Joueurs/>} />
          <Route path="/rapports" element={<Rapports/>} />
          <Route path="/prediction" element={<Prediction/>} />
          <Route path="/historique" element={<Historique/>} />
          <Route path='/analyses' element={<Analyses/>} />
          <Route path='/modele' element={<Modele/>} />
          <Route path='/evaluation' element={<Evaluation/>} />
          <Route path='/fraude' element={<Fraude/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
