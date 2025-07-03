import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({
    filieres: 0,
    promotions: 0,
    apprenants: 0,
    candidatures_en_attente: 0
  });
  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchCandidatures();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const fetchCandidatures = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/candidatures');
      setCandidatures(response.data.slice(0, 5)); // Dernières 5 candidatures
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
    }
  };

  const statsCards = [
    {
      title: 'Filières',
      value: stats.filieres,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+2 ce mois'
    },
    {
      title: 'Promotions',
      value: stats.promotions,
      icon: Users,
      color: 'bg-green-500',
      trend: '+1 active'
    },
    {
      title: 'Apprenants',
      value: stats.apprenants,
      icon: UserCheck,
      color: 'bg-purple-500',
      trend: '+12 inscrits'
    },
    {
      title: 'Candidatures en attente',
      value: stats.candidatures_en_attente,
      icon: FileText,
      color: 'bg-orange-500',
      trend: 'À traiter'
    }
  ];

  const chartData = [
    { name: 'Dev Web', apprenants: 45, candidatures: 12 },
    { name: 'Data Science', apprenants: 32, candidatures: 8 },
    { name: 'Cybersécurité', apprenants: 28, candidatures: 15 },
  ];

  const pieData = [
    { name: 'Acceptées', value: 65, color: '#10B981' },
    { name: 'En attente', value: 20, color: '#F59E0B' },
    { name: 'Refusées', value: 15, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre école</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.trend}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Apprenants par filière</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="apprenants" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statut des candidatures</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dernières candidatures</h3>
          <div className="space-y-3">
            {candidatures.map((candidature: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {candidature.prenom?.charAt(0)}{candidature.nom?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">
                      {candidature.prenom} {candidature.nom}
                    </p>
                    <p className="text-sm text-gray-500">{candidature.filiere_nom}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    {candidature.score}/10
                  </span>
                  {candidature.statut === 'en_attente' && (
                    <Clock className="h-4 w-4 text-orange-500" />
                  )}
                  {candidature.statut === 'accepte' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {candidature.statut === 'refuse' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Traiter les candidatures</p>
                  <p className="text-sm text-gray-500">{stats.candidatures_en_attente} en attente</p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Créer une promotion</p>
                  <p className="text-sm text-gray-500">Nouvelle session de formation</p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Gérer les filières</p>
                  <p className="text-sm text-gray-500">Modifier les programmes</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;