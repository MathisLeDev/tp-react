import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, User, Mail } from 'lucide-react';
import axios from 'axios';

interface Candidature {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motivation: string;
  filiere_id: number;
  filiere_nom: string;
  score: number;
  date_candidature: string;
  statut: string;
  decision_admin: string;
  justification_refus: string;
  date_decision: string;
}

const CandidaturesManagement: React.FC = () => {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [decisionData, setDecisionData] = useState({
    statut: '',
    decision_admin: '',
    justification_refus: ''
  });

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/candidatures');
      setCandidatures(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
    }
  };

  const handleDecision = async (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setDecisionData({
      statut: candidature.statut,
      decision_admin: candidature.decision_admin || '',
      justification_refus: candidature.justification_refus || ''
    });
    setShowModal(true);
  };

  const submitDecision = async () => {
    if (!selectedCandidature) return;

    try {
      await axios.put(`http://mathisbrouard.fr/api/candidatures/${selectedCandidature.id}`, decisionData);
      await fetchCandidatures();
      setShowModal(false);
      setSelectedCandidature(null);
      setDecisionData({ statut: '', decision_admin: '', justification_refus: '' });
    } catch (error) {
      console.error('Erreur lors de la soumission de la décision:', error);
    }
  };

  const filteredCandidatures = candidatures.filter(candidature => {
    const matchesSearch = 
      candidature.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.filiere_nom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || candidature.statut === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepte':
        return 'bg-green-100 text-green-800';
      case 'refuse':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <Clock className="h-4 w-4" />;
      case 'accepte':
        return <CheckCircle className="h-4 w-4" />;
      case 'refuse':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des candidatures</h1>
          <p className="text-gray-600 mt-2">Évaluez et validez les candidatures</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {candidatures.filter(c => c.statut === 'en_attente').length}
                </div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {candidatures.filter(c => c.statut === 'accepte').length}
                </div>
                <div className="text-sm text-gray-500">Acceptées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {candidatures.filter(c => c.statut === 'refuse').length}
                </div>
                <div className="text-sm text-gray-500">Refusées</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une candidature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="accepte">Acceptées</option>
            <option value="refuse">Refusées</option>
          </select>
        </div>
      </div>

      {/* Candidatures Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score QCM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidatures.map((candidature) => (
                <motion.tr
                  key={candidature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {candidature.prenom} {candidature.nom}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {candidature.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {candidature.filiere_nom}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`text-lg font-bold ${getScoreColor(candidature.score)}`}>
                        {candidature.score}/10
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            candidature.score >= 7 ? 'bg-green-500' : 
                            candidature.score >= 5 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${candidature.score * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(candidature.date_candidature).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(candidature.statut)}`}>
                      {getStatusIcon(candidature.statut)}
                      <span className="ml-1">
                        {candidature.statut === 'en_attente' ? 'En attente' : 
                         candidature.statut === 'accepte' ? 'Acceptée' : 'Refusée'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDecision(candidature)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Examiner
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de décision */}
      {showModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Candidature de {selectedCandidature.prenom} {selectedCandidature.nom}
              </h2>
              <p className="text-gray-600 mt-1">{selectedCandidature.filiere_nom}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations candidat */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informations du candidat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedCandidature.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score QCM</p>
                    <p className={`font-bold text-lg ${getScoreColor(selectedCandidature.score)}`}>
                      {selectedCandidature.score}/10
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Motivation</p>
                    <p className="mt-1 text-gray-800">{selectedCandidature.motivation}</p>
                  </div>
                </div>
              </div>

              {/* Décision */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Décision administrative</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut *
                    </label>
                    <select
                      value={decisionData.statut}
                      onChange={(e) => setDecisionData({ ...decisionData, statut: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="accepte">Accepter</option>
                      <option value="refuse">Refuser</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire administrateur
                    </label>
                    <textarea
                      value={decisionData.decision_admin}
                      onChange={(e) => setDecisionData({ ...decisionData, decision_admin: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Commentaires sur la décision..."
                    />
                  </div>

                  {decisionData.statut === 'refuse' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Justification du refus
                      </label>
                      <textarea
                        value={decisionData.justification_refus}
                        onChange={(e) => setDecisionData({ ...decisionData, justification_refus: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Expliquez les raisons du refus..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitDecision}
                className="button-primary px-6 py-2 rounded-lg text-white font-semibold"
              >
                Valider la décision
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CandidaturesManagement;