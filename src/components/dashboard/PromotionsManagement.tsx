import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, Users, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Promotion {
  id: number;
  nom: string;
  filiere_id: number;
  filiere_nom: string;
  referent_id: number;
  referent_nom: string;
  referent_prenom: string;
  date_debut: string;
  date_fin: string;
  date_debut_examen: string;
  date_fin_examen: string;
  stage_obligatoire: boolean;
  objectifs: string;
  created_at: string;
}

interface FormData {
  nom: string;
  filiere_id: number;
  referent_id: number;
  date_debut: string;
  date_fin: string;
  date_debut_examen: string;
  date_fin_examen: string;
  stage_obligatoire: boolean;
  objectifs: string;
}

const PromotionsManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filieres, setFilieres] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchPromotions();
    fetchFilieres();
    fetchPersonnel();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    }
  };

  const fetchFilieres = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/filieres');
      setFilieres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des filières:', error);
    }
  };

  const fetchPersonnel = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/personnel');
      setPersonnel(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du personnel:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (editingPromotion) {
        await axios.put(`http://mathisbrouard.fr/api/promotions/${editingPromotion.id}`, data);
      } else {
        await axios.post('http://mathisbrouard.fr/api/promotions', data);
      }
      await fetchPromotions();
      setShowModal(false);
      setEditingPromotion(null);
      reset();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    reset({
      ...promotion,
      date_debut: promotion.date_debut ? promotion.date_debut.split('T')[0] : '',
      date_fin: promotion.date_fin ? promotion.date_fin.split('T')[0] : '',
      date_debut_examen: promotion.date_debut_examen ? promotion.date_debut_examen.split('T')[0] : '',
      date_fin_examen: promotion.date_fin_examen ? promotion.date_fin_examen.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      try {
        await axios.delete(`http://mathisbrouard.fr/api/promotions/${id}`);
        await fetchPromotions();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const filteredPromotions = promotions.filter(promotion =>
    promotion.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.filiere_nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des promotions</h1>
          <p className="text-gray-600 mt-2">Gérez les sessions de formation</p>
        </div>
        <button
          onClick={() => {
            setEditingPromotion(null);
            reset();
            setShowModal(true);
          }}
          className="button-primary px-6 py-3 rounded-lg text-white font-semibold inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle promotion
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une promotion..."
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

      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => (
                <motion.tr
                  key={promotion.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{promotion.nom}</div>
                        <div className="text-sm text-gray-500">
                          Créée le {new Date(promotion.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {promotion.filiere_nom}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promotion.referent_nom} {promotion.referent_prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>
                        {new Date(promotion.date_debut).toLocaleDateString()} - 
                        {new Date(promotion.date_fin).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      promotion.stage_obligatoire 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {promotion.stage_obligatoire ? 'Obligatoire' : 'Optionnel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(promotion)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="text-red-600 hover:text-red-900"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la promotion *
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filière *
                  </label>
                  <select
                    {...register('filiere_id', { required: 'La filière est requise' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((filiere: any) => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.nom}
                      </option>
                    ))}
                  </select>
                  {errors.filiere_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.filiere_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référent *
                  </label>
                  <select
                    {...register('referent_id', { required: 'Le référent est requis' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un référent</option>
                    {personnel.map((person: any) => (
                      <option key={person.id} value={person.id}>
                        {person.nom} {person.prenom}
                      </option>
                    ))}
                  </select>
                  {errors.referent_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.referent_id.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    {...register('date_debut')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    {...register('date_fin')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date début examen
                  </label>
                  <input
                    type="date"
                    {...register('date_debut_examen')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date fin examen
                  </label>
                  <input
                    type="date"
                    {...register('date_fin_examen')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('stage_obligatoire')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Stage obligatoire</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs
                </label>
                <textarea
                  {...register('objectifs')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  {loading ? 'Enregistrement...' : editingPromotion ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PromotionsManagement;