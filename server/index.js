import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const dbPath = join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Filières
  db.run(`CREATE TABLE IF NOT EXISTS filieres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    description TEXT,
    objectifs TEXT,
    programme TEXT,
    modalites TEXT,
    accessibilite TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Promotions
  db.run(`CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    photo TEXT,
    referent_id INTEGER,
    date_debut DATE,
    date_fin DATE,
    date_debut_examen DATE,
    date_fin_examen DATE,
    stage_obligatoire BOOLEAN,
    filiere_id INTEGER,
    objectifs TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE SET NULL,
    FOREIGN KEY (referent_id) REFERENCES personnel(id) ON DELETE SET NULL
  )`);

  // Apprenants
  db.run(`CREATE TABLE IF NOT EXISTS apprenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    email TEXT,
    telephone TEXT,
    statut TEXT DEFAULT 'inscrit',
    promo_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promo_id) REFERENCES promotions(id)
  )`);

  // Commentaires
  db.run(`CREATE TABLE IF NOT EXISTS commentaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apprenant_id INTEGER,
    type TEXT,
    contenu TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (apprenant_id) REFERENCES apprenants(id) ON DELETE CASCADE
  )`);

  // Personnel
  db.run(`CREATE TABLE IF NOT EXISTS personnel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    email TEXT,
    role TEXT,
    cv TEXT,
    experience TEXT,
    certifications TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Questions QCM
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filiere_id INTEGER,
    question TEXT,
    bonne_reponse TEXT,
    mauvaise1 TEXT,
    mauvaise2 TEXT,
    mauvaise3 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
  )`);

  // Candidatures
  db.run(`CREATE TABLE IF NOT EXISTS candidatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    email TEXT,
    motivation TEXT,
    filiere_id INTEGER,
    score INTEGER,
    date_candidature DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut TEXT DEFAULT 'en_attente',
    decision_admin TEXT,
    justification_refus TEXT,
    date_decision DATETIME,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
  )`);

  // Réponses candidature
  db.run(`CREATE TABLE IF NOT EXISTS reponses_candidature (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidature_id INTEGER,
    question_id INTEGER,
    reponse_donnee TEXT,
    est_correct BOOLEAN,
    FOREIGN KEY (candidature_id) REFERENCES candidatures(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
  )`);

  // Formations formateurs
  db.run(`CREATE TABLE IF NOT EXISTS formations_formateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personnel_id INTEGER,
    nom_formation TEXT,
    organisme TEXT,
    date_obtention DATE,
    certificat_pdf TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO filieres (id, nom, description, objectifs, programme, modalites, accessibilite, image) VALUES 
    (1, 'Développement Web', 'Formation complète en développement web moderne', 'Maîtriser les technologies web actuelles', 'HTML, CSS, JavaScript, React, Node.js', 'Présentiel et distanciel', 'Formation accessible aux personnes en situation de handicap', 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'),
    (2, 'Data Science', 'Formation en science des données et intelligence artificielle', 'Analyser et interpréter les données', 'Python, SQL, Machine Learning, Statistics', 'Présentiel', 'Formation accessible aux personnes en situation de handicap', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'),
    (3, 'Cybersécurité', 'Formation en sécurité informatique', 'Protéger les systèmes informatiques', 'Réseaux, Cryptographie, Ethical Hacking', 'Présentiel', 'Formation accessible aux personnes en situation de handicap', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800')`);

  db.run(`INSERT OR IGNORE INTO personnel (id, nom, prenom, email, role, experience, certifications) VALUES 
  (1, 'Martin', 'Jean', 'j.martin@ecole.fr', 'Formateur', '10 ans d''expérience en développement', 'Certifié AWS Solutions Architect'),
  (2, 'Dubois', 'Marie', 'm.dubois@ecole.fr', 'Formatrice', '8 ans d''expérience en data science', 'Certifiée Google Cloud Professional'),
  (3, 'Leroy', 'Pierre', 'p.leroy@ecole.fr', 'Formateur', '12 ans d''expérience en cybersécurité', 'Certifié CISSP')`);

  db.run(`INSERT OR IGNORE INTO questions (filiere_id, question, bonne_reponse, mauvaise1, mauvaise2, mauvaise3) VALUES 
    (1, 'Quel est le langage principal pour le développement frontend ?', 'JavaScript', 'Python', 'Java', 'C++'),
    (1, 'Que signifie HTML ?', 'HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'),
    (1, 'Quel framework est populaire pour React ?', 'Next.js', 'Django', 'Laravel', 'Spring'),
    (1, 'Que signifie CSS ?', 'Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'),
    (1, 'Quel est le port par défaut pour HTTP ?', '80', '443', '8080', '3000'),
    (1, 'Que signifie API ?', 'Application Programming Interface', 'Automated Programming Interface', 'Advanced Programming Interface', 'Application Process Interface'),
    (1, 'Quel est le protocole sécurisé pour HTTP ?', 'HTTPS', 'FTPS', 'SFTP', 'SSH'),
    (1, 'Que signifie DOM ?', 'Document Object Model', 'Data Object Model', 'Dynamic Object Model', 'Document Oriented Model'),
    (1, 'Quel est le langage backend le plus utilisé avec JavaScript ?', 'Node.js', 'PHP', 'Python', 'Ruby'),
    (1, 'Que signifie JSON ?', 'JavaScript Object Notation', 'Java Standard Object Notation', 'JavaScript Oriented Notation', 'Java Script Object Network')`);

  db.run(`INSERT OR IGNORE INTO promotions (id, nom, filiere_id, referent_id, date_debut, date_fin, stage_obligatoire, objectifs) VALUES 
    (1, 'Promo Dev Web 2024', 1, 1, '2024-01-15', '2024-12-15', 1, 'Former des développeurs web compétents'),
    (2, 'Promo Data Science 2024', 2, 2, '2024-02-01', '2024-12-01', 1, 'Former des data scientists expérimentés'),
    (3, 'Promo Cybersécurité 2024', 3, 3, '2024-03-01', '2024-12-20', 1, 'Former des experts en sécurité informatique')`);

  db.run(`INSERT OR IGNORE INTO apprenants (nom, prenom, email, telephone, promo_id) VALUES 
    ('Dupont', 'Alice', 'alice.dupont@email.com', '0123456789', 1),
    ('Bernard', 'Bob', 'bob.bernard@email.com', '0123456790', 1),
    ('Charre', 'Charlie', 'charlie.charre@email.com', '0123456791', 2),
    ('Durand', 'David', 'david.durand@email.com', '0123456792', 2),
    ('Moreau', 'Eve', 'eve.moreau@email.com', '0123456793', 3)`);
});

// Routes API

// Filières
app.get('/api/filieres', (req, res) => {
  db.all('SELECT * FROM filieres ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/filieres', (req, res) => {
  const { nom, description, objectifs, programme, modalites, accessibilite, image } = req.body;
  db.run(
    'INSERT INTO filieres (nom, description, objectifs, programme, modalites, accessibilite, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nom, description, objectifs, programme, modalites, accessibilite, image],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Promotions
app.get('/api/promotions', (req, res) => {
  db.all(`
    SELECT p.*, f.nom as filiere_nom, pe.nom as referent_nom, pe.prenom as referent_prenom
    FROM promotions p
    LEFT JOIN filieres f ON p.filiere_id = f.id
    LEFT JOIN personnel pe ON p.referent_id = pe.id
    ORDER BY p.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/promotions', (req, res) => {
  const { nom, filiere_id, referent_id, date_debut, date_fin, date_debut_examen, date_fin_examen, stage_obligatoire, objectifs } = req.body;
  db.run(
    'INSERT INTO promotions (nom, filiere_id, referent_id, date_debut, date_fin, date_debut_examen, date_fin_examen, stage_obligatoire, objectifs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom, filiere_id, referent_id, date_debut, date_fin, date_debut_examen, date_fin_examen, stage_obligatoire, objectifs],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/promotions/:id', (req, res) => {
    const { id } = req.params;
    const { nom, filiere_id, referent_id, date_debut, date_fin, date_debut_examen, date_fin_examen, stage_obligatoire, objectifs, photo } = req.body;

    // Convert boolean to integer for SQLite
    const stageObligatoireInt = stage_obligatoire ? 1 : 0;

    db.run(
        'UPDATE promotions SET nom = ?, filiere_id = ?, referent_id = ?, date_debut = ?, date_fin = ?, date_debut_examen = ?, date_fin_examen = ?, stage_obligatoire = ?, objectifs = ?, photo = ? WHERE id = ?',
        [nom, filiere_id, referent_id, date_debut, date_fin, date_debut_examen, date_fin_examen, stageObligatoireInt, objectifs, photo, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Promotion not found' });
                return;
            }
            res.json({ message: 'Promotion updated successfully', changes: this.changes });
        }
    );
});

app.delete('/api/promotions/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM promotions WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Promotion not found' });
      return;
    }
    res.json({ message: 'Promotion deleted successfully', changes: this.changes });
  });
});

// Apprenants
app.get('/api/apprenants', (req, res) => {
  db.all(`
    SELECT a.*, p.nom as promo_nom, f.nom as filiere_nom
    FROM apprenants a
    LEFT JOIN promotions p ON a.promo_id = p.id
    LEFT JOIN filieres f ON p.filiere_id = f.id
    ORDER BY a.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/apprenants', (req, res) => {
  const { nom, prenom, email, telephone, promo_id } = req.body;
  db.run(
    'INSERT INTO apprenants (nom, prenom, email, telephone, promo_id) VALUES (?, ?, ?, ?, ?)',
    [nom, prenom, email, telephone, promo_id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/api/apprenants/:id', (req, res) => {
  const { id } = req.params;
  // Note: We'll handle cascading deletes for comments in a later step by modifying table schema.
  db.run('DELETE FROM apprenants WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Apprenant not found' });
      return;
    }
    res.json({ message: 'Apprenant deleted successfully', changes: this.changes });
  });
});

// Personnel
app.get('/api/personnel', (req, res) => {
  db.all('SELECT * FROM personnel ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/personnel', (req, res) => {
  const { nom, prenom, email, role, cv, experience, certifications } = req.body;
  db.run(
    'INSERT INTO personnel (nom, prenom, email, role, cv, experience, certifications) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nom, prenom, email, role, cv, experience, certifications],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/api/personnel/:id', (req, res) => {
  const { id } = req.params;

  // Note: ON DELETE SET NULL for promotions.referent_id and ON DELETE CASCADE for formations_formateurs
  // are now handled by the database schema.
  // We can keep a check for referent_id as a user-friendly guard, or remove it if strict DB behavior is preferred.
  // For now, let's rely on the DB constraints for formations_formateurs and keep the referent check.

  db.get('SELECT COUNT(*) as count FROM promotions WHERE referent_id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row.count > 0) {
      // This check is somewhat redundant due to ON DELETE SET NULL, but provides a clearer error message.
      // Alternatively, allow deletion and let DB handle setting referent_id to NULL.
      // For this iteration, we'll keep the explicit block to inform the user.
      res.status(400).json({ message: 'This staff member is a referent for one or more promotions. Deleting them will set these promotions to have no referent. Consider assigning a new referent first or confirm deletion.' });
      // If direct deletion is preferred, remove this block and the check.
      return;
    }

    db.run('DELETE FROM personnel WHERE id = ?', id, function(err) {
      if (err) {
        // This could be due to other unexpected constraints or DB errors.
        if (err.message.includes('FOREIGN KEY constraint failed')) {
            res.status(400).json({ message: 'Cannot delete personnel due to existing references in other tables. Please check dependencies.' });
        } else {
            res.status(500).json({ error: err.message });
        }
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ message: 'Personnel not found' });
        return;
      }
      res.json({ message: 'Personnel deleted successfully', changes: this.changes });
    });
  });
});

// Questions QCM
app.get('/api/questions/:filiereId', (req, res) => {
  const { filiereId } = req.params;
  db.all('SELECT * FROM questions WHERE filiere_id = ?', [filiereId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/filieres/:id', (req, res) => {
    const { id } = req.params;
    const { nom, description, objectifs, programme, modalites, accessibilite, image } = req.body;
    db.run(
        'UPDATE filieres SET nom = ?, description = ?, objectifs = ?, programme = ?, modalites = ?, accessibilite = ?, image = ? WHERE id = ?',
        [nom, description, objectifs, programme, modalites, accessibilite, image, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Filiere not found' });
                return;
            }
            res.json({ message: 'Filiere updated successfully', changes: this.changes });
        }
    );
});

app.post('/api/questions', (req, res) => {
  const { filiere_id, question, bonne_reponse, mauvaise1, mauvaise2, mauvaise3 } = req.body;
  db.run(
    'INSERT INTO questions (filiere_id, question, bonne_reponse, mauvaise1, mauvaise2, mauvaise3) VALUES (?, ?, ?, ?, ?, ?)',
    [filiere_id, question, bonne_reponse, mauvaise1, mauvaise2, mauvaise3],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Candidatures
app.post('/api/candidatures', (req, res) => {
  const { nom, prenom, email, motivation, filiere_id, reponses } = req.body;
  
  // Calculer le score
  db.all('SELECT * FROM questions WHERE filiere_id = ?', [filiere_id], (err, questions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    let score = 0;
    const reponsesData = [];
    
    questions.forEach((question, index) => {
      const reponseCandidat = reponses[index];
      const estCorrect = reponseCandidat === question.bonne_reponse;
      if (estCorrect) score++;
      
      reponsesData.push({
        question_id: question.id,
        reponse_donnee: reponseCandidat,
        est_correct: estCorrect
      });
    });
    
    // Insérer la candidature
    db.run(
      'INSERT INTO candidatures (nom, prenom, email, motivation, filiere_id, score) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, motivation, filiere_id, score],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        const candidatureId = this.lastID;
        
        // Insérer les réponses
        reponsesData.forEach(reponse => {
          db.run(
            'INSERT INTO reponses_candidature (candidature_id, question_id, reponse_donnee, est_correct) VALUES (?, ?, ?, ?)',
            [candidatureId, reponse.question_id, reponse.reponse_donnee, reponse.est_correct]
          );
        });
        
        res.json({ id: candidatureId, score: score, total: questions.length });
      }
    );
  });
});

app.get('/api/candidatures', (req, res) => {
  db.all(`
    SELECT c.*, f.nom as filiere_nom
    FROM candidatures c
    LEFT JOIN filieres f ON c.filiere_id = f.id
    ORDER BY c.date_candidature DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/candidatures/:id', (req, res) => {
  const { id } = req.params;
  const { statut, decision_admin, justification_refus } = req.body;
  
  db.run(
    'UPDATE candidatures SET statut = ?, decision_admin = ?, justification_refus = ?, date_decision = CURRENT_TIMESTAMP WHERE id = ?',
    [statut, decision_admin, justification_refus, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

// Commentaires
app.get('/api/commentaires/:apprenantId', (req, res) => {
  const { apprenantId } = req.params;
  db.all('SELECT * FROM commentaires WHERE apprenant_id = ? ORDER BY date_creation DESC', [apprenantId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/commentaires', (req, res) => {
  const { apprenant_id, type, contenu } = req.body;
  db.run(
    'INSERT INTO commentaires (apprenant_id, type, contenu) VALUES (?, ?, ?)',
    [apprenant_id, type, contenu],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Stats dashboard
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM filieres', [], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.filieres = result.count;
    
    db.get('SELECT COUNT(*) as count FROM promotions', [], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.promotions = result.count;
      
      db.get('SELECT COUNT(*) as count FROM apprenants', [], (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.apprenants = result.count;
        
        db.get('SELECT COUNT(*) as count FROM candidatures WHERE statut = "en_attente"', [], (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.candidatures_en_attente = result.count;
          
          res.json(stats);
        });
      });
    });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});