import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, User, Award } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  cv: string;
  experience: string;
  certifications: string;
  created_at: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  cv: string;
  experience: string;
  certifications: string;
}

const PersonnelManagement: React.FC = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchPersonnel();
  }, []);

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
      if (editingPersonnel) {
        await axios.put(`http://mathisbrouard.fr/api/personnel/${editingPersonnel.id}`, data);
      } else {
        await axios.post('http://mathisbrouard.fr/api/personnel', data);
      }
      await fetchPersonnel();
      setShowModal(false);
      setEditingPersonnel(null);
      reset();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (person: Personnel) => {
    setEditingPersonnel(person);
    reset(person);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
      try {
        await axios.delete(`http://mathisbrouard.fr/api/personnel/${id}`);
        await fetchPersonnel();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const filteredPersonnel = personnel.filter(person =>
    person.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'formateur':
        return 'bg-blue-100 text-blue-800';
      case 'referent':
        return 'bg-green-100 text-green-800';
      case 'coordinateur':
        return 'bg-purple-100 text-purple-800';
      case 'directeur':
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
          <h1 className="text-3xl font-bold text-gray-800">Gestion du personnel</h1>
          <p className="text-gray-600 mt-2">Gérez votre équipe pédagogique</p>
        </div>
        <button
          onClick={() => {
            setEditingPersonnel(null);
            reset();
            setShowModal(true);
          }}
          className="button-primary px-6 py-3 rounded-lg text-white font-semibold inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau membre
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un membre du personnel..."
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

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonnel.map((person) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(person)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">{person.prenom} {person.nom}</h3>
                <p className="text-blue-100">{person.email}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(person.role)}`}>
                  {person.role}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(person.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {person.experience && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Expérience</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{person.experience}</p>
                </div>
              )}
              
              {person.certifications && (
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{person.certifications}</span>
                </div>
              )}
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
                {editingPersonnel ? 'Modifier le membre' : 'Nouveau membre'}
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
                  Rôle *
                </label>
                <select
                  {...register('role', { required: 'Le rôle est requis' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="Formateur">Formateur(rice)</option>
                  <option value="Referent">Référent</option>
                  <option value="Coordinateur">Coordinateur</option>
                  <option value="Directeur">Directeur</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (lien)
                </label>
                <input
                  type="url"
                  {...register('cv')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience
                </label>
                <textarea
                  {...register('experience')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez l'expérience professionnelle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <textarea
                  {...register('certifications')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Listez les certifications..."
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
                  {loading ? 'Enregistrement...' : editingPersonnel ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PersonnelManagement;