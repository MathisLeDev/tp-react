# school-management-app

Application web de gestion d’école avec candidature en ligne et suivi pédagogique, développée avec React.js et Node.js.

---

## 🎯 Objectif

Créer une application complète pour gérer :

- Les filières, promotions, apprenants et personnel pédagogique
- Le suivi qualité et documentaire pour la certification Qualiopi
- La candidature en ligne avec QCM propre à chaque filière

---

## ⚙️ Technologies

- **Frontend** : React.js + Tailwind CSS
- **Backend** : Node.js + Express
- **Base de données** : SQLite3
- **PDF Export** : pdfkit
- **Autres libs** : axios, react-hook-form, recharts, multer, cors, csv-writer...

---

## 🚀 Installation

1. Cloner le dépôt
2. Installer les dépendances
```bash
npm install
```
3. Lancer le développement (frontend + backend)
```bash
npm run dev
```
4. Construire la version de production (frontend)
```bash
npm run build
```
5. Lancer le serveur Express en prod (après build)
```bash
node server/index.js
```

---

## 📚 Fonctionnalités

### Gestion des filières
- CRUD complet
- Champs : nom, description, objectifs, programme, accessibilité...
- Gestion des 10 questions QCM par filière

### Gestion des promotions
- CRUD
- Champs : nom, photo, référent, dates, stage obligatoire, objectifs

### Gestion des apprenants & suivis
- CRUD avec fiches détaillées
- Historique, commentaires (retard, absence, suivi)

### Gestion du personnel pédagogique
- CRUD
- CV, certifications, expériences, formations

### Candidature en ligne
- Formulaire accessible depuis la landing page
- Choix de la filière, saisie infos personnelles + motivation
- QCM dynamique (10 questions spécifiques à la filière)
- Résultat immédiat + enregistrement
- Interface admin : consultation, validation/refus

### QCM
- Mise à jour des questions en admin
- Stockage des réponses, score et statut candidat
- Critère d’admissibilité paramétrable

### Export & audit
- Export CSV/PDF des résultats, fiches apprenants, journal de candidatures

### Recherche & filtrage avancé
- Recherche libre
- Filtres multi-critères combinables
- Plages de dates
- Export des résultats filtrés

---

## 🗄️ Structure de la base SQLite3

- `filieres` : gestion des filières
- `promotions` : gestion des promotions liées à filières
- `apprenants` : gestion des étudiants
- `personnel` : enseignants et référents
- `formations_formateurs` : suivi formation formateurs
- `questions` : QCM par filière
- `candidatures` et `reponses_candidature` : gestion des candidatures et réponses
- `journal_candidatures` : historique décision admin

---

## 📄 Scripts utiles

- `npm run dev` : lance frontend (vite) + backend (nodemon)
- `npm run build` : build frontend production
- `npm run lint` : vérifie le code avec ESLint
- `npm run preview` : preview build vite

---

## 🤝 Contribution

Contributions bienvenues ! Merci d’ouvrir un ticket ou PR pour tout bug ou amélioration.

---

## 📞 Contact

Pour toute question, contactez le développeur principal.
