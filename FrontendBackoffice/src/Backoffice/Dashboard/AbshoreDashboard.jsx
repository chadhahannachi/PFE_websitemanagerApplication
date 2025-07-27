
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReactApexChart from 'react-apexcharts';

const AbshoreDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, byRole: {} },
    companies: { total: 0 },
    licences: { total: 0, byStatus: {}, currentMonth: 0, lastMonth: 0 },
    licenceRequests: { total: 0, byStatus: {}, currentMonth: 0, lastMonth: 0 },
    payments: { total: 0, totalIncome: 0, byStatus: {}, byMonth: [], currentMonth: 0, lastMonth: 0 },
    contentTypes: { byType: {} } // Nouveau: statistiques par type de contenu
  });

  // Récupération des données
  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Récupérer tous les utilisateurs
      const usersResponse = await axios.get("http://localhost:5000/auth/users", config);
      const users = usersResponse.data;
      
      // Compter par rôle
      const usersByRole = users.reduce((acc, user) => {
        const role = user.role === 'superadminabshore' || user.role === 'superadminentreprise' ? 'superadmin' : user.role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      // Récupérer toutes les entreprises
      const companiesResponse = await axios.get("http://localhost:5000/entreprises");
      const companies = companiesResponse.data;

      // Récupérer toutes les licences
      const licencesResponse = await axios.get("http://localhost:5000/licences", config);
      const licences = licencesResponse.data;
      
      // Compter par status et par mois
      const licencesByStatus = licences.reduce((acc, licence) => {
        acc[licence.status] = (acc[licence.status] || 0) + 1;
        return acc;
      }, {});

      // Compter licences par mois
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const licencesCurrentMonth = licences.filter(licence => {
        const licenceDate = new Date(licence.created_at);
        return licenceDate.getMonth() === currentMonth && licenceDate.getFullYear() === currentYear;
      }).length;
      
      const licencesLastMonth = licences.filter(licence => {
        const licenceDate = new Date(licence.created_at);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return licenceDate.getMonth() === lastMonth && licenceDate.getFullYear() === lastMonthYear;
      }).length;

      // Récupérer toutes les demandes de licence
      const licenceRequestsResponse = await axios.get("http://localhost:5000/licence-requests", config);
      const licenceRequests = licenceRequestsResponse.data;
      
      // Compter par status et par mois
      const licenceRequestsByStatus = licenceRequests.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});

      // Compter demandes par mois
      const requestsCurrentMonth = licenceRequests.filter(req => {
        const reqDate = new Date(req.requested_at);
        return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
      }).length;
      
      const requestsLastMonth = licenceRequests.filter(req => {
        const reqDate = new Date(req.requested_at);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return reqDate.getMonth() === lastMonth && reqDate.getFullYear() === lastMonthYear;
      }).length;

      // Récupérer tous les paiements
      const paymentsResponse = await axios.get("http://localhost:5000/api/payments", config);
      let payments = [];
      if (Array.isArray(paymentsResponse.data)) {
        payments = paymentsResponse.data;
      } else if (paymentsResponse.data && paymentsResponse.data.data && Array.isArray(paymentsResponse.data.data.data)) {
        payments = paymentsResponse.data.data.data;
      }

      // Calculer le revenu total et compter par status
      const totalIncome = payments.reduce((sum, payment) => {
        return sum + (parseFloat(payment.amount) || 0);
      }, 0);

      const paymentsByStatus = payments.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {});

      // Calculer revenus par mois
      const paymentsCurrentMonth = payments.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      
      const paymentsLastMonth = payments.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear;
      }).reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

      // Grouper les paiements par mois pour le chart
      const paymentsByMonth = payments.reduce((acc, payment) => {
        const date = new Date(payment.payment_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + (parseFloat(payment.amount) || 0);
        return acc;
      }, {});

      // Convertir en format pour le chart (6 derniers mois)
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        last6Months.push({
          month: monthName,
          amount: paymentsByMonth[monthKey] || 0
        });
      }

      // Récupérer tous les types de contenu et calculer le nombre d'entreprises uniques
      const contentTypes = {};
      
      try {
        // Slides
        const slidesResponse = await axios.get("http://localhost:5000/slides", config);
        if (Array.isArray(slidesResponse.data)) {
          const uniqueCompanies = new Set(slidesResponse.data.map(slide => slide.entreprise).filter(Boolean));
          contentTypes['Slides'] = uniqueCompanies.size;
        }

        // Services
        const servicesResponse = await axios.get("http://localhost:5000/contenus/Service", config);
        if (Array.isArray(servicesResponse.data)) {
          const uniqueCompanies = new Set(servicesResponse.data.map(service => service.entreprise).filter(Boolean));
          contentTypes['Services'] = uniqueCompanies.size;
        }

        // Solutions
        const solutionsResponse = await axios.get("http://localhost:5000/contenus/Solution", config);
        if (Array.isArray(solutionsResponse.data)) {
          const uniqueCompanies = new Set(solutionsResponse.data.map(solution => solution.entreprise).filter(Boolean));
          contentTypes['Solutions'] = uniqueCompanies.size;
        }

        // Événements
        const eventsResponse = await axios.get("http://localhost:5000/contenus/Evenement", config);
        if (Array.isArray(eventsResponse.data)) {
          const uniqueCompanies = new Set(eventsResponse.data.map(event => event.entreprise).filter(Boolean));
          contentTypes['Événements'] = uniqueCompanies.size;
        }

        // FAQ
        const faqResponse = await axios.get("http://localhost:5000/contenus/FAQ", config);
        if (Array.isArray(faqResponse.data)) {
          const uniqueCompanies = new Set(faqResponse.data.map(faq => faq.entreprise).filter(Boolean));
          contentTypes['FAQ'] = uniqueCompanies.size;
        }

        // Partenaires
        const partnersResponse = await axios.get("http://localhost:5000/contenus/Partenaire", config);
        if (Array.isArray(partnersResponse.data)) {
          const uniqueCompanies = new Set(partnersResponse.data.map(partner => partner.entreprise).filter(Boolean));
          contentTypes['Partenaires'] = uniqueCompanies.size;
        }

        // À Propos
        const aboutResponse = await axios.get("http://localhost:5000/contenus/APropos", config);
        if (Array.isArray(aboutResponse.data)) {
          const uniqueCompanies = new Set(aboutResponse.data.map(about => about.entreprise).filter(Boolean));
          contentTypes['À Propos'] = uniqueCompanies.size;
        }

        // Contact
        const contactResponse = await axios.get("http://localhost:5000/contenus/ContactUs", config);
        if (Array.isArray(contactResponse.data)) {
          const uniqueCompanies = new Set(contactResponse.data.map(contact => contact.entreprise).filter(Boolean));
          contentTypes['Contact'] = uniqueCompanies.size;
        }

        // Contenu IA
        const aiContentResponse = await axios.get("http://localhost:5000/contenus/ContenuSpecifique", config);
        if (Array.isArray(aiContentResponse.data)) {
          const uniqueCompanies = new Set(aiContentResponse.data.map(content => content.entreprise).filter(Boolean));
          contentTypes['Contenu IA'] = uniqueCompanies.size;
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des types de contenu:", error);
      }

      setStats({
        users: { total: users.length, byRole: usersByRole },
        companies: { total: companies.length },
        licences: { 
          total: licences.length, 
          byStatus: licencesByStatus, 
          currentMonth: licencesCurrentMonth, 
          lastMonth: licencesLastMonth 
        },
        licenceRequests: { 
          total: licenceRequests.length, 
          byStatus: licenceRequestsByStatus, 
          currentMonth: requestsCurrentMonth, 
          lastMonth: requestsLastMonth 
        },
        payments: { 
          total: payments.length, 
          totalIncome: totalIncome, 
          byStatus: paymentsByStatus, 
          byMonth: last6Months,
          currentMonth: paymentsCurrentMonth,
          lastMonth: paymentsLastMonth
        },
        contentTypes: { byType: contentTypes }
      });

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Fonction pour calculer le pourcentage de changement
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Fonction pour déterminer si c'est une augmentation ou diminution
  const getChangeIndicator = (current, previous) => {
    const percentage = calculatePercentageChange(current, previous);
    const isIncrease = current > previous;
    const color = isIncrease ? 'text-success-main' : 'text-danger-main';
    const icon = isIncrease ? 'bxs:up-arrow' : 'bxs:down-arrow';
    const sign = isIncrease ? '+' : '';
    
    return {
      percentage: Math.abs(percentage).toFixed(1),
      color,
      icon,
      sign
    };
  };

  // Calculer les indicateurs de changement
  const revenueChange = getChangeIndicator(stats.payments.currentMonth, stats.payments.lastMonth);
  const licencesChange = getChangeIndicator(stats.licences.currentMonth, stats.licences.lastMonth);
  const requestsChange = getChangeIndicator(stats.licenceRequests.currentMonth, stats.licenceRequests.lastMonth);

  // Configuration des charts
  const usersOverviewOptions = {
    chart: {
      type: 'donut',
      height: 264
    },
    labels: Object.keys(stats.users.byRole).map(role => 
      role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)
    ),
    colors: ['#487FFF', '#FFB020', '#14B8A6', '#D14343'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      }
    }
  };

  const usersOverviewSeries = Object.values(stats.users.byRole);

  const licencesOverviewOptions = {
    chart: {
      type: 'donut',
      height: 264
    },
    labels: Object.keys(stats.licences.byStatus).map(status => 
      status.charAt(0).toUpperCase() + status.slice(1)
    ),
    colors: ['#14B8A6', '#FFB020', '#D14343', '#6B7280'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      }
    }
  };

  const licencesOverviewSeries = Object.values(stats.licences.byStatus);

  const licenceRequestsOverviewOptions = {
    chart: {
      type: 'donut',
      height: 264
    },
    labels: Object.keys(stats.licenceRequests.byStatus).map(status => 
      status === 'pending' ? 'En attente' : 
      status === 'validated' ? 'Validée' : 
      status === 'rejected' ? 'Rejetée' : status
    ),
    colors: ['#FFB020', '#14B8A6', '#D14343'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      }
    }
  };

  const licenceRequestsOverviewSeries = Object.values(stats.licenceRequests.byStatus);

  const paymentsOverviewOptions = {
    chart: {
      type: 'bar',
      height: 264
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: Object.keys(stats.payments.byStatus).map(status => 
        status === 'paid' ? 'Payé' : 
        status === 'pending' ? 'En attente' : 
        status === 'failed' ? 'Échoué' : status
      ),
    },
    yaxis: {
      title: {
        text: 'Nombre de paiements'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " paiements"
        }
      }
    }
  };

  const paymentsOverviewSeries = [{
    name: 'Paiements',
    data: Object.values(stats.payments.byStatus)
  }];

  const salesChartOptions = {
    chart: {
      type: 'area',
      height: 264,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#487FFF'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: stats.payments.byMonth.map(item => item.month),
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Revenus (DT)'
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + 'DT';
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2) + 'DT';
        }
      }
    }
  };

  const salesChartSeries = [{
    name: 'Revenus',
    data: stats.payments.byMonth.map(item => item.amount)
  }];

  // Configuration du graphique en barres pour les types de contenu
  const contentTypesChartOptions = {
    chart: {
      type: 'bar',
      height: 310,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 4
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: Object.keys(stats.contentTypes.byType),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nombre d\'entreprises',
        style: {
          color: '#6B7280',
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    fill: {
      opacity: 1,
      colors: ['#487FFF', '#FFB020', '#14B8A6', '#D14343', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4', '#84CC16']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " entreprises";
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    }
  };

  const contentTypesChartSeries = [{
    name: 'Entreprises',
    data: Object.values(stats.contentTypes.byType)
  }];

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <>
      {/* Compteurs globaux */}
      <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-1 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Utilisateurs</p>
                  <h6 className="mb-0">{stats.users.total.toLocaleString()}</h6>
                </div>
                <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="gridicons:multiple-users" className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
                <span className="d-inline-flex align-items-center gap-1 text-success-main">
                  <Icon icon="bxs:up-arrow" className="text-xs" />
                  {stats.users.byRole.superadmin || 0} Super Admin
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-none border bg-gradient-start-2 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Entreprises</p>
                  <h6 className="mb-0">{stats.companies.total.toLocaleString()}</h6>
                </div>
                <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="fa-solid:building" className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
                <span className="d-inline-flex align-items-center gap-1 text-info-main">
                  <Icon icon="bxs:up-arrow" className="text-xs" />
                  Actives
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-none border bg-gradient-start-3 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Licences</p>
                  <h6 className="mb-0">{stats.licences.total.toLocaleString()}</h6>
                </div>
                <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="fa-solid:key" className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                <span className={`d-inline-flex align-items-center gap-1 ${licencesChange.color}`}>
                  <Icon icon={licencesChange.icon} className="text-xs" />
                  {licencesChange.sign}{licencesChange.percentage}%
                </span>
                vs last month
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-none border bg-gradient-start-4 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Total Revenus</p>
                  <h6 className="mb-0">{stats.payments.totalIncome.toLocaleString()}DT</h6>
                </div>
                <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="solar:wallet-bold" className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                <span className={`d-inline-flex align-items-center gap-1 ${revenueChange.color}`}>
                  <Icon icon={revenueChange.icon} className="text-xs" />
                  {revenueChange.sign}{revenueChange.percentage}%
                </span>
                vs last month
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-none border bg-gradient-start-5 h-100">
            <div className="card-body p-20">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <p className="fw-medium text-primary-light mb-1">Licence requests</p>
                  <h6 className="mb-0">{stats.licenceRequests.total.toLocaleString()}</h6>
                </div>
                <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="fa-solid:file-contract" className="text-white text-2xl mb-0" />
                </div>
              </div>
              <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                <span className={`d-inline-flex align-items-center gap-1 ${requestsChange.color}`}>
                  <Icon icon={requestsChange.icon} className="text-xs" />
                  {requestsChange.sign}{requestsChange.percentage}%
                </span>
                vs last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="row gy-4 mt-1">
        {/* Chart des revenus par mois */}
        <div className="col-xxl-6 col-xl-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h6 className="text-lg mb-0">Revenus par Mois</h6>
                <select className="form-select bg-base form-select-sm w-auto" defaultValue="6months">
                  <option value="6months">6 derniers mois</option>
                  <option value="12months">12 derniers mois</option>
                </select>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                <h6 className="mb-0">{stats.payments.totalIncome.toLocaleString()}DT</h6>
                <span className="text-sm fw-semibold rounded-pill bg-success-focus text-success-main border br-success px-8 py-4 line-height-1 d-flex align-items-center gap-1">
                  Total
                </span>
              </div>
              <ReactApexChart options={salesChartOptions} series={salesChartSeries} type="area" height={264} />
            </div>
          </div>
        </div>

        {/* Overview des utilisateurs par rôle */}
        <div className="col-xxl-3 col-xl-6">
          <div className="card h-100 radius-8 border-0 overflow-hidden">
            <div className="card-body p-24">
              <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                <h6 className="mb-2 fw-bold text-lg">Utilisateurs par Rôle</h6>
              </div>
              <ReactApexChart options={usersOverviewOptions} series={usersOverviewSeries} type="donut" height={264} />
              <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                {Object.entries(stats.users.byRole).map(([role, count]) => (
                  <li key={role} className="d-flex align-items-center gap-2">
                    <span className={`w-12-px h-12-px radius-2 ${
                      role === 'superadmin' ? 'bg-primary-600' : 
                      role === 'moderateur' ? 'bg-yellow' : 'bg-info'
                    }`} />
                    <span className="text-secondary-light text-sm fw-normal">
                      {role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}:
                      <span className="text-primary-light fw-semibold">{count}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Overview des licences par status */}
        <div className="col-xxl-3 col-xl-6">
          <div className="card h-100 radius-8 border-0 overflow-hidden">
            <div className="card-body p-24">
              <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                <h6 className="mb-2 fw-bold text-lg">Licences par Status</h6>
              </div>
              <ReactApexChart options={licencesOverviewOptions} series={licencesOverviewSeries} type="donut" height={264} />
              <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                {Object.entries(stats.licences.byStatus).map(([status, count]) => (
                  <li key={status} className="d-flex align-items-center gap-2">
                    <span className={`w-12-px h-12-px radius-2 ${
                      status === 'paid' ? 'bg-success-main' : 
                      status === 'pending' ? 'bg-warning' : 
                      status === 'expired' ? 'bg-danger' : 'bg-secondary'
                    }`} />
                    <span className="text-secondary-light text-sm fw-normal">
                      {status.charAt(0).toUpperCase() + status.slice(1)}:
                      <span className="text-primary-light fw-semibold">{count}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Overview des demandes de licence par status */}
        <div className="col-xxl-3 col-xl-6">
          <div className="card h-100 radius-8 border-0 overflow-hidden">
            <div className="card-body p-24">
              <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                <h6 className="mb-2 fw-bold text-lg">Demandes par Status</h6>
              </div>
              <ReactApexChart options={licenceRequestsOverviewOptions} series={licenceRequestsOverviewSeries} type="donut" height={264} />
              <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                {Object.entries(stats.licenceRequests.byStatus).map(([status, count]) => (
                  <li key={status} className="d-flex align-items-center gap-2">
                    <span className={`w-12-px h-12-px radius-2 ${
                      status === 'validated' ? 'bg-success-main' : 
                      status === 'pending' ? 'bg-warning' : 
                      status === 'rejected' ? 'bg-danger' : 'bg-secondary'
                    }`} />
                    <span className="text-secondary-light text-sm fw-normal">
                      {status === 'pending' ? 'En attente' : 
                       status === 'validated' ? 'Validée' : 
                       status === 'rejected' ? 'Rejetée' : status}:
                      <span className="text-primary-light fw-semibold">{count}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Graphique en barres des types de contenu par entreprise */}
        <div className="col-xxl-6 col-xl-12">
          <div className="card h-100 radius-8 border-0">
            <div className="card-body p-24">
              <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                <div>
                  <h6 className="mb-2 fw-bold text-lg">Utilisation des Types de Contenu</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Nombre d'entreprises par type de contenu
                  </span>
                </div>
                <div className="">
                  <select className="form-select form-select-sm w-auto bg-base border text-secondary-light" defaultValue="">
                    <option value="" disabled>
                      Sélectionner
                    </option>
                    <option value="all">Tous les types</option>
                    <option value="most-used">Plus utilisés</option>
                    <option value="least-used">Moins utilisés</option>
                  </select>
                </div>
              </div>
              <div className="mt-20 d-flex justify-content-center flex-wrap gap-3">
                <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
                  <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                    <Icon icon="fluent:document-text-16-filled" className="icon" />
                  </span>
                  <div>
                    <span className="text-secondary-light text-sm fw-medium">
                      Total Types
                    </span>
                    <h6 className="text-md fw-semibold mb-0">{Object.keys(stats.contentTypes.byType).length}</h6>
                  </div>
                </div>
                <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
                  <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                    <Icon icon="uis:chart" className="icon" />
                  </span>
                  <div>
                    <span className="text-secondary-light text-sm fw-medium">
                      Moyenne
                    </span>
                    <h6 className="text-md fw-semibold mb-0">
                      {Object.values(stats.contentTypes.byType).length > 0 
                        ? Math.round(Object.values(stats.contentTypes.byType).reduce((a, b) => a + b, 0) / Object.values(stats.contentTypes.byType).length)
                        : 0}
                    </h6>
                  </div>
                </div>
                <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
                  <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                    <Icon icon="ph:arrow-fat-up-fill" className="icon" />
                  </span>
                  <div>
                    <span className="text-secondary-light text-sm fw-medium">
                      Max
                    </span>
                    <h6 className="text-md fw-semibold mb-0">
                      {Object.values(stats.contentTypes.byType).length > 0 
                        ? Math.max(...Object.values(stats.contentTypes.byType))
                        : 0}
                    </h6>
                  </div>
                </div>
              </div>
              <div id="contentTypesChart" className="mt-20">
                <ReactApexChart 
                  options={contentTypesChartOptions} 
                  series={contentTypesChartSeries} 
                  type="bar" 
                  height={310} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overview des paiements par status */}
        <div className="col-xxl-3 col-xl-6">
          <div className="card h-100 radius-8 border">
            <div className="card-body p-24">
              <h6 className="mb-12 fw-semibold text-lg mb-16">Paiements par Status</h6>
              <ReactApexChart options={paymentsOverviewOptions} series={paymentsOverviewSeries} type="bar" height={264} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AbshoreDashboard;