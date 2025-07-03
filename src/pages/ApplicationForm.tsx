import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User,
  Mail,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import axios from 'axios';

interface Question {
  id: number;
  question: string;
  bonne_reponse: string;
  mauvaise1: string;
  mauvaise2: string;
  mauvaise3: string;
}

interface Filiere {
  id: number;
  nom: string;
  description: string;
  image: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  motivation: string;
}

const ApplicationForm: React.FC = () => {
  const { filiereId } = useParams<{ filiereId: string }>();
  const navigate = useNavigate();
  const [filiere, setFiliere] = useState<Filiere | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (filiereId) {
      fetchFiliere();
      fetchQuestions();
    }
  }, [filiereId]);

  const fetchFiliere = async () => {
    try {
      const response = await axios.get('http://mathisbrouard.fr/api/filieres');
      const filiereData = response.data.find((f: Filiere) => f.id === parseInt(filiereId!));
      setFiliere(filiereData);
    } catch (error) {
      console.error('Erreur lors du chargement de la filière:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://mathisbrouard.fr/api/questions/${filiereId}`);
      setQuestions(response.data);
      setQuizAnswers(new Array(response.data.length).fill(''));
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
    }
  };

  const onSubmitForm = (data: FormData) => {
    setCurrentStep(2);
    // Store form data for final submission
    sessionStorage.setItem('candidatureForm', JSON.stringify(data));
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = answer;
    setQuizAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitCandidature(newAnswers);
    }
  };

  const submitCandidature = async (answers: string[]) => {
    setIsSubmitting(true);
    try {
      const formData = JSON.parse(sessionStorage.getItem('candidatureForm') || '{}');
      const response = await axios.post('http://mathisbrouard.fr/api/candidatures', {
        ...formData,
        filiere_id: parseInt(filiereId!),
        reponses: answers
      });
      
      setResult(response.data);
      setCurrentStep(3);
      sessionStorage.removeItem('candidatureForm');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shuffleAnswers = (question: Question) => {
    const answers = [
      question.bonne_reponse,
      question.mauvaise1,
      question.mauvaise2,
      question.mauvaise3
    ];
    return answers.sort(() => Math.random() - 0.5);
  };

  if (!filiere) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Informations</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">QCM</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Résultat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filière Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={filiere.image} 
                alt={filiere.nom}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{filiere.nom}</h1>
              <p className="text-gray-600 mb-4">{filiere.description}</p>
              <div className="flex items-center text-sm text-blue-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Candidature en ligne</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 1: Form */}
        {currentStep === 1 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-600" />
              Vos informations
            </h2>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register('nom', { required: 'Le nom est requis' })}
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivation *
                </label>
                <textarea
                  {...register('motivation', { required: 'La motivation est requise' })}
                  rows={4}
                  className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Expliquez votre motivation pour cette formation..."
                />
                {errors.motivation && (
                  <p className="mt-1 text-sm text-red-600">{errors.motivation.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="button-primary w-full py-3 px-6 rounded-lg text-white font-semibold"
              >
                Continuer vers le QCM
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Quiz */}
        {currentStep === 2 && questions.length > 0 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Question {currentQuestion + 1} sur {questions.length}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Pas de limite de temps</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {shuffleAnswers(questions[currentQuestion]).map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(answer)}
                    className="quiz-option w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border border-gray-300 mr-3 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 opacity-0 quiz-option-dot"></div>
                      </div>
                      <span>{answer}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && result && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="mb-6">
              {result.score >= 7 ? (
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Candidature terminée !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre score : <span className="font-bold text-2xl">{result.score}/{result.total}</span>
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Prochaines étapes
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Votre candidature a été enregistrée</p>
                <p>✓ Vous recevrez une réponse par email sous 48h</p>
                <p>✓ En cas d'acceptation, vous serez contacté pour finaliser votre inscription</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="button-primary w-full py-3 px-6 rounded-lg text-white font-semibold"
              >
                Retour à l'accueil
              </button>
              <p className="text-sm text-gray-500">
                Vous avez des questions ? Contactez-nous à contact@ecole-excellence.fr
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Soumission en cours...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;