import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AdminSidebar from '../SidebarAdmin/Sidebar';
import './DashboardAdmin.css';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function DashboardAdmin() {
  const [organisationsCount, setOrganisationsCount] = useState(0);
  const [activeOrganisationsCount, setActiveOrganisationsCount] = useState(0);
  const [inactiveOrganisationsCount, setInactiveOrganisationsCount] = useState(0);
  const [predictionsCount, setPredictionsCount] = useState(0);
  const [predictionData, setPredictionData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Données pour le graphique des organisations
  const [orgChartData, setOrgChartData] = useState({
    labels: ['Organisations'],
    datasets: [
      {
        label: 'Actives',
        data: [0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Inactives',
        data: [0],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  });

  // Données pour le graphique des prédictions
  const [predictionChartData, setPredictionChartData] = useState({
    labels: ['Derniers jours'],
    datasets: [
      {
        label: 'Prédictions',
        data: [0],
        borderColor: 'rgba(153, 102, 255, 0.6)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.1,
        fill: true
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statut des Organisations',
      },
    },
  };

  const predictionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Prédictions récentes',
      },
    },
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le nombre total d'organisations
        const countResponse = await fetch("http://127.0.0.1:7000/user/countorganisations/");
        const countData = await countResponse.json();
        setOrganisationsCount(countData.total_organisations);

        // Récupérer les statistiques d'activité
        const activityResponse = await fetch("http://127.0.0.1:7000/user/orgactive/");
        const activityData = await activityResponse.json();

        // Récupérer les statistiques de prédictions
        const countpredResponse = await fetch("http://127.0.0.1:7000/prediction/count/");
        const countpredData = await countpredResponse.json();
        setPredictionsCount(countpredData.total_predictions);

        // Récupérer les données historiques des prédictions
        const predHistoryResponse = await fetch("http://127.0.0.1:7000/prediction/history/");
        const predHistoryData = await predHistoryResponse.json();
        setPredictionData(predHistoryData);

        setActiveOrganisationsCount(activityData.active_count);
        setInactiveOrganisationsCount(activityData.inactive_count);

        // Mettre à jour les données du graphique des organisations
        setOrgChartData({
          labels: ['Organisations'],
          datasets: [
            {
              label: 'Actives',
              data: [activityData.active_count],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Inactives',
              data: [activityData.inactive_count],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });

        // Mettre à jour les données du graphique des prédictions
        if (predHistoryData && predHistoryData.length > 0) {
          const labels = predHistoryData.map(item => item.date);
          const data = predHistoryData.map(item => item.count);
          
          setPredictionChartData({
            labels: labels,
            datasets: [
              {
                label: 'Prédictions',
                data: data,
                borderColor: 'rgba(153, 102, 255, 0.6)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.1,
                fill: true
              },
            ],
          });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Refresh data every 30 seconds
    const dataInterval = setInterval(fetchData, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <div className="admin-container">
      <Navbar />
      <div className="admin-main-content">
        <AdminSidebar />
        <div className="dashboard-content">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Organisations</h3>
              <p className="stat-value">{organisationsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Organisations Inactives</h3>
              <p className="stat-value">{inactiveOrganisationsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Total Prédictions</h3>
              <p className="stat-value">{predictionsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Current Time</h3>
              <p className="stat-value">{currentTime}</p>
            </div>
          </div>
          
          <div className="charts-container">
            <div className="chart-wrapper">
              <Bar data={orgChartData} options={chartOptions} />
            </div>
            <div className="chart-wrapper">
              <Line data={predictionChartData} options={predictionChartOptions} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardAdmin;