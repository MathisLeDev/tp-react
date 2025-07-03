import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Award, 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  Star,
  Download
} from 'lucide-react';
import axios from 'axios';

interface Filiere {
  id: number;
  nom: string;
  description: string;
  image: string;
  objectifs: string;
  programme: string;
  modalites: string;
  accessibilite: string;
}

const LandingPage: React.FC = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [stats, setStats] = useState({
    filieres: 0,
    promotions: 0,
    apprenants: 0,
    candidatures_en_attente: 0
  });

  useEffect(() => {
    fetchFilieres();
    fetchStats();
  }, []);

  const fetchFilieres = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/filieres');
      setFilieres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des filières:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="h-16 w-16 mr-4" />
              <h1 className="text-5xl font-bold">École Excellence</h1>
            </div>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Transformez votre avenir avec nos formations de pointe en technologie. 
              Des programmes certifiés Qualiopi pour une montée en compétences garantie.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button-primary px-8 py-4 rounded-full text-lg font-semibold text-white shadow-lg"
              >
                Découvrir nos formations
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full text-lg font-semibold text-white border border-white/30 hover:bg-white/30 transition-all"
              >
                <Link to="/admin" className="flex items-center">
                  Administration <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="stats-card p-6 rounded-xl">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold text-gray-800 mb-2">{stats.filieres}</div>
                <div className="text-gray-600">Filières disponibles</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="stats-card p-6 rounded-xl">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <div className="text-3xl font-bold text-gray-800 mb-2">{stats.apprenants}</div>
                <div className="text-gray-600">Apprenants formés</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="stats-card p-6 rounded-xl">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <div className="text-3xl font-bold text-gray-800 mb-2">{stats.promotions}</div>
                <div className="text-gray-600">Promotions actives</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="stats-card p-6 rounded-xl">
                <Award className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <div className="text-3xl font-bold text-gray-800 mb-2">95%</div>
                <div className="text-gray-600">Taux de réussite</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filières Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nos <span className="gradient-text">Filières</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos formations spécialisées conçues pour répondre aux besoins du marché du travail
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filieres.map((filiere) => (
              <motion.div
                key={filiere.id}
                variants={itemVariants}
                className="card-hover bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <img 
                    src={filiere.image} 
                    alt={filiere.nom}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{filiere.nom}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">{filiere.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>25 places</span>
                    </div>
                    <Link
                      to={`/candidature/${filiere.id}`}
                      className="button-primary px-6 py-2 rounded-full text-sm font-semibold text-white inline-flex items-center"
                    >
                      Candidater <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Qualité Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Qualité & <span className="gradient-text">Certification</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre engagement qualité reconnu par la certification Qualiopi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <Shield className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Certification Qualiopi</h3>
              <p className="text-gray-600 mb-4">
                Notre organisme est certifié Qualiopi, garantissant la qualité de nos formations.
              </p>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Certification valide</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <Star className="h-12 w-12 text-yellow-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Satisfaction 95%</h3>
              <p className="text-gray-600 mb-4">
                Nos apprenants nous font confiance et recommandent nos formations.
              </p>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Évaluation continue</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <Award className="h-12 w-12 text-purple-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Accessibilité</h3>
              <p className="text-gray-600 mb-4">
                Nos formations sont accessibles aux personnes en situation de handicap.
              </p>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Accompagnement personnalisé</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button className="bg-white px-8 py-4 rounded-full text-lg font-semibold text-gray-800 shadow-lg hover:shadow-xl transition-all inline-flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Télécharger notre règlement
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 mr-2" />
                <h3 className="text-xl font-bold">École Excellence</h3>
              </div>
              <p className="text-gray-400">
                Formations de qualité pour votre avenir professionnel.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Formations</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Développement Web</li>
                <li>Data Science</li>
                <li>Cybersécurité</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contact</li>
                <li>FAQ</li>
                <li>Règlement</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="text-gray-400">
                <p>123 Rue de l'Excellence</p>
                <p>75000 Paris</p>
                <p>contact@ecole-excellence.fr</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 École Excellence. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;