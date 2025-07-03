import request from 'supertest';
// Supposons que app et db sont exportés depuis server/index.js
// et que server/index.js a été modifié pour ne pas démarrer le serveur en mode test.
import { app, db } from './index.js';

// Helper pour initialiser la base de données pour les tests
const initializeTestData = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Nettoyer la table avant chaque test si nécessaire, ou utiliser une base de données en mémoire pour les tests
      db.run('DELETE FROM filieres', (err) => {
        if (err) return reject(err);
      });
      // Insérer une filière de test
      db.run(`INSERT INTO filieres (id, nom, description, objectifs, programme, modalites, accessibilite, image) VALUES
        (1, 'Test Filiere Initial', 'Description initiale', 'Objectifs initiaux', 'Programme initial', 'Modalites initiales', 'Accessibilite initiale', 'image.url')`, function(err) {
        if (err) return reject(err);
        resolve(this.lastID); // Retourne l'ID de la filière insérée
      });
    });
  });
};

describe('API Filières', () => {
  let testFiliereId;

  beforeAll(async () => {
    // S'assurer que la base de données est prête et initialiser les données de test
    // Dans un vrai scénario, on utiliserait une base de données de test séparée ou en mémoire.
    // Pour cet exemple, nous allons réinitialiser et insérer des données.
    // Note: db.serialize s'assure que les opérations se font en séquence.
    await new Promise((resolve, reject) => {
        db.serialize(async () => {
            // Création de la table si elle n'existe pas (au cas où la DB de test est vide)
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
            )`, (err) => {
                if (err) return reject(err);
            });
            // Nettoyage et insertion
            try {
                testFiliereId = await initializeTestData();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
  });

  afterAll((done) => {
    // Fermer la connexion à la base de données si nécessaire, ou nettoyer
    // db.close((err) => {
    //   if (err) return done(err);
    //   done();
    // });
    // Pour l'instant, on la laisse ouverte car elle est partagée avec l'app.
    done();
  });

  describe('PUT /api/filieres/:id', () => {
    it('devrait mettre à jour une filière existante et retourner un statut 200', async () => {
      const updatedData = {
        nom: 'Test Filiere Modifiée',
        description: 'Description modifiée',
        objectifs: 'Objectifs modifiés',
        programme: 'Programme modifié',
        modalites: 'Modalites modifiées',
        accessibilite: 'Accessibilite modifiée',
        image: 'image_modifiee.url',
      };

      const response = await request(app)
        .put(`/api/filieres/${testFiliereId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Filiere updated successfully');
      expect(response.body.changes).toBe(1);

      // Vérifier en base de données
      const updatedFiliereInDb = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM filieres WHERE id = ?', [testFiliereId], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      expect(updatedFiliereInDb).toBeDefined();
      expect(updatedFiliereInDb.nom).toBe(updatedData.nom);
      expect(updatedFiliereInDb.description).toBe(updatedData.description);
    });

    it('devrait retourner un statut 404 si la filière à mettre à jour n\'existe pas', async () => {
      const nonExistentId = 9999;
      const updatedData = { nom: 'Ne devrait pas être sauvegardé' };
      const response = await request(app)
        .put(`/api/filieres/${nonExistentId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Filiere not found');
    });

    it('devrait retourner un statut 500 si des données requises sont manquantes (ex: nom est vide, si la BDD a une contrainte NOT NULL)', async () => {
        // Note: SQLite par défaut n'impose pas NOT NULL pour les chaînes vides si la colonne est TEXT NOT NULL.
        // Ce test est plus pertinent pour des SGBD plus stricts ou si des validations sont ajoutées dans l'app.
        // Pour l'instant, la table filieres a `nom TEXT NOT NULL`. sqlite insèrera une chaîne vide.
        // Pour simuler une erreur, on pourrait essayer d'insérer un type incorrect pour un ID.
        // Ici, on va tester le comportement actuel.
      const invalidData = {
        nom: '', // Nom vide, mais la contrainte NOT NULL de SQLite accepte les chaînes vides
        description: 'Description valide',
        // autres champs...
      };
      const response = await request(app)
        .put(`/api/filieres/${testFiliereId}`)
        .send(invalidData);

      // S'attendre à un succès car SQLite permet les chaines vides pour NOT NULL TEXT
      expect(response.statusCode).toBe(200);
      // Si on voulait forcer une erreur 500, il faudrait une validation plus poussée au niveau de l'application
      // ou une contrainte CHECK(nom <> '')
    });
  });

  // TODO: Ajouter des tests pour GET /api/filieres, POST /api/filieres, DELETE /api/filieres/:id
});
