# Todo API

Une API RESTful de gestion de tâches (Todos), construite avec Node.js et Express.
Ce projet s'inscrit dans le cadre d'un cours CI/CD complet implémentant des tests, une couverture de code, l'analyse de qualité et des déploiements continus.

## 🚀 Fonctionnalités

- **CRUD complet** sur les tâches (`/todos`)
- **Pagination** des résultats
- **Recherche** de tâches par titre (`/todos/search/all`)
- **Documentation OpenAPI (Swagger)** intégrée et accessible sur `/api-docs`

## 🛠️ Stack Technique

- **Backend** : Node.js, Express
- **Base de données** : SQLite (via `sql.js` en mémoire ou localisé)
- **Tests & Couverture** : Jest
- **Linting** : ESLint
- **Déploiement** : Vercel (Production)
- **CI/CD** : GitHub Actions
- **Qualité & Sécurité** : SonarCloud, Snyk
- **Conteneurisation** : Docker

## 📦 Installation et démarrage local

### Prérequis
- Node.js (v20 ou supérieur recommandé)
- npm

### Commandes

```bash
# Installer les dépendances
npm install

# Démarrer le serveur (par défaut sur http://localhost:3000)
npm start
```

## 🧪 Tests et Qualité

Le projet inclut des tests unitaires configurés avec Jest.

```bash
# Lancer les tests
npm test

# Lancer la couverture de code (Coverage)
npm run coverage

# Vérifier le formatage du code
npm run lint
```

## 📖 Documentation de l'API

Une documentation Swagger UI est générée automatiquement et servie par l'application.
Une fois l'application démarrée, rendez-vous sur :
👉 `http://localhost:3000/api-docs`

## ⚙️ Pipeline CI/CD (GitHub Actions)

Lorsqu'un \`push\` ou une \`Pull Request\` est créé(e) sur la branche \`main\`, le workflow suivant s'exécute :
1. **Lint** : Vérification ESLint.
2. **Test & Coverage** : Lancement des tests Jest et génération du rapport de couverture.
3. **Build Docker** : Construction de l'image Docker et publication sur GitHub Container Registry (`ghcr.io`).
4. **Security Scan** : Scan de vulnérabilités via Snyk.
5. **Quality Gate** : Analyse SonarCloud.
6. **Deploy** : Déploiement automatique sur Vercel suivi d'une vérification HTTP 200 sur la route `/health`.
