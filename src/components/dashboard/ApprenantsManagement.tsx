import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, User, MessageSquare, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Apprenant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: string;
  promo_id: number;
  promo_nom: string;
  filiere_nom: string;
  created_at: string;
}

interface Commentaire {
  id: number;
  type: string;
  contenu: string;
  date_creation: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  promo_id: number;
}

const ApprenantsManagement: React.FC = () => {
  const [apprenants, setApprenants] = useState<Apprenant[]>([]);
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [editingApprenant, setEditingApprenant] = useState<Apprenant | null>(null);
  const [selectedApprenant, setSelectedApprenant] = useState<Apprenant | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState({ type: '', contenu: '' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchApprenants();
    fetchPromotions();
  }, []);

  const fetchApprenants = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/apprenants');
      setApprenants(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des apprenants:', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    }
  };

  const fetchCommentaires = async (apprenantId: number) => {
    try {
      const response = await axios.get(`http://mathisbrouard.fr/api/commentaires/${apprenantId}`);
      setCommentaires(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (editingApprenant) {
        await axios.put(`http://mathisbrouard.fr/api/apprenants/${editingApprenant.id}`, data);
      } else {
        await axios.post('http://mathisbrouard.fr/api/apprenants', data);
      }
      await fetchApprenants();
      setShowModal(false);
      setEditingApprenant(null);
      reset();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (apprenant: Apprenant) => {
    setEditingApprenant(apprenant);
    reset(apprenant);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')) {
      try {
        await axios.delete(`http://mathisbrouard.fr/api/apprenants/${id}`);
        await fetchApprenants();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleViewComments = (apprenant: Apprenant) => {
    setSelectedApprenant(apprenant);
    fetchCommentaires(apprenant.id);
    setShowCommentsModal(true);
  };

  const handleAddComment = async () => {
    if (!selectedApprenant || !newComment.type || !newComment.contenu) return;

    try {
      await axios.post('http://mathisbrouard.fr/api/commentaires', {
        apprenant_id: selectedApprenant.id,
        type: newComment.type,
        contenu: newComment.contenu
      });
      setNewComment({ type: '', contenu: '' });
      fetchCommentaires(selectedApprenant.id);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const filteredApprenants = apprenants.filter(apprenant =>
    apprenant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprenant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'inscrit':
        return 'bg-green-100 text-green-800';
      case 'en_cours':
        return 'bg-blue-100 text-blue-800';
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      case 'abandonne':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case 'suivi':
        return 'bg-blue-100 text-blue-800';
      case 'retard':
        return 'bg-orange-100 text-orange-800';
      case 'absence':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des apprenants</h1>
          <p className="text-gray-600 mt-2">Suivez vos étudiants et leur progression</p>
        </div>
        <button
          onClick={() => {
            setEditingApprenant(null);
            reset();
            setShowModal(true);
          }}
          className="button-primary px-6 py-3 rounded-lg text-white font-semibold inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvel apprenant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un apprenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filtres
          </button>
        </div>
      </div>

      {/* Apprenants Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apprenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
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
              {filteredApprenants.map((apprenant) => (
                <motion.tr
                  key={apprenant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {apprenant.prenom} {apprenant.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          Inscrit le {new Date(apprenant.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{apprenant.email}</div>
                      <div className="text-gray-500">{apprenant.telephone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{apprenant.promo_nom}</div>
                      <div className="text-sm text-gray-500">{apprenant.filiere_nom}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(apprenant.statut)}`}>
                      {apprenant.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewComments(apprenant)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Voir les commentaires"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(apprenant)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(apprenant.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Apprenant */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingApprenant ? 'Modifier l\'apprenant' : 'Nouvel apprenant'}
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register('nom', { required: 'Le nom est requis' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    {...register('prenom', { required: 'Le prénom est requis' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { required: 'L\'email est requis' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  {...register('telephone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion *
                </label>
                <select
                  {...register('promo_id', { required: 'La promotion est requise' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une promotion</option>
                  {promotions.map((promo: any) => (
                    <option key={promo.id} value={promo.id}>
                      {promo.nom} - {promo.filiere_nom}
                    </option>
                  ))}
                </select>
                {errors.promo_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.promo_id.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="button-primary px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : editingApprenant ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Commentaires */}
      {showCommentsModal && selectedApprenant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Commentaires - {selectedApprenant.prenom} {selectedApprenant.nom}
              </h2>
            </div>
            <div className="p-6">
              {/* Ajouter un commentaire */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Ajouter un commentaire</h3>
                <div className="space-y-4">
                  <div>
                    <select
                      value={newComment.type}
                      onChange={(e) => setNewComment({ ...newComment, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="suivi">Suivi</option>
                      <option value="retard">Retard</option>
                      <option value="absence">Absence</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      value={newComment.contenu}
                      onChange={(e) => setNewComment({ ...newComment, contenu: e.target.value })}
                      placeholder="Contenu du commentaire..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleAddComment}
                    className="button-primary px-4 py-2 rounded-lg text-white font-semibold"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Liste des commentaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Historique des commentaires</h3>
                {commentaires.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun commentaire pour cet apprenant</p>
                ) : (
                  <div className="space-y-3">
                    {commentaires.map((commentaire) => (
                      <div key={commentaire.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCommentTypeColor(commentaire.type)}`}>
                            {commentaire.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(commentaire.date_creation).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{commentaire.contenu}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCommentsModal(false)}
                className="button-primary px-6 py-2 rounded-lg text-white font-semibold"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApprenantsManagement;