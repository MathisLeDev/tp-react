import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Filiere {
  id: number;
  nom: string;
  description: string;
  objectifs: string;
  programme: string;
  modalites: string;
  accessibilite: string;
  image: string;
  created_at: string;
}

interface FormData {
  nom: string;
  description: string;
  objectifs: string;
  programme: string;
  modalites: string;
  accessibilite: string;
  image: string;
}

const FilieresManagement: React.FC = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFiliere, setEditingFiliere] = useState<Filiere | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchFilieres();
  }, []);

  const fetchFilieres = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/filieres');
      setFilieres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des filières:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (editingFiliere) {
        // Update existing filiere
        await axios.put(`http://mathisbrouard.fr/api/filieres/${editingFiliere.id}`, data);
      } else {
        // Create new filiere
        await axios.post('http://mathisbrouard.fr/api/filieres', data);
      }
      await fetchFilieres();
      setShowModal(false);
      setEditingFiliere(null);
      reset();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (filiere: Filiere) => {
    setEditingFiliere(filiere);
    reset(filiere);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      try {
        await axios.delete(`http://mathisbrouard.fr/api/filieres/${id}`);
        await fetchFilieres();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const filteredFilieres = filieres.filter(filiere =>
    filiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filiere.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des filières</h1>
          <p className="text-gray-600 mt-2">Gérez les programmes de formation</p>
        </div>
        <button
          onClick={() => {
            setEditingFiliere(null);
            reset();
            setShowModal(true);
          }}
          className="button-primary px-6 py-3 rounded-lg text-white font-semibold inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle filière
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une filière..."
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

      {/* Filières Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFilieres.map((filiere) => (
          <motion.div
            key={filiere.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              <img 
                src={filiere.image} 
                alt={filiere.nom}
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(filiere)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(filiere.id)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{filiere.nom}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{filiere.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Créée le {new Date(filiere.created_at).toLocaleDateString()}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">Active</span>
              </div>
            </div>
          </motion.div>
        ))}
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
                {editingFiliere ? 'Modifier la filière' : 'Nouvelle filière'}
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la filière *
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
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'La description est requise' })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programme
                </label>
                <textarea
                  {...register('programme')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalités
                </label>
                <input
                  type="text"
                  {...register('modalites')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accessibilité
                </label>
                <input
                  type="text"
                  {...register('accessibilite')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (URL)
                </label>
                <input
                  type="url"
                  {...register('image')}
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
                  {loading ? 'Enregistrement...' : editingFiliere ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FilieresManagement;