# API Members JWT - Déploiement Vercel & GitHub

Application complète avec API Node.js/Express et frontend React pour gérer des membres avec authentification JWT.

## 🚀 Déploiement Rapide

### Prérequis
- [Node.js](https://nodejs.org/) installé
- [Git](https://git-scm.com/) installé
- [Vercel CLI](https://vercel.com/cli) : `npm i -g vercel`
- [GitHub CLI](https://cli.github.com/) : `npm i -g gh`

### Étape 1: Préparation du code

1. **Modifier l'API URL dans le frontend** :
   ```bash
   cd members-react-jwt
   # Créer un fichier .env
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

2. **Ajouter les fichiers de configuration Vercel** :
   - `vercel.json` à la racine (API)
   - `vercel.json` dans `members-react-jwt/` (frontend)

### Étape 2: Déploiement sur GitHub

```bash
# Initialiser Git si nécessaire
git init
git add .
git commit -m "Initial commit: API Members JWT"

# Créer le dépôt GitHub
gh repo create nom-de-votre-repo --public

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 3: Déploiement sur Vercel

#### API Backend
```bash
# Depuis la racine du projet
vercel

# Suivre les instructions pour connecter votre compte
# Choisir le projet comme API
```

#### Frontend React
```bash
# Depuis le dossier members-react-jwt
cd members-react-jwt
vercel

# Choisir comme projet frontend
```

### Étape 4: Configuration des Variables d'Environnement

Dans le dashboard Vercel :

#### Pour l'API :
- `JWT_SECRET` : Votre clé secrète JWT (ex: `ma_cle_secrete_jwt_2024`)

#### Pour le Frontend :
- `REACT_APP_API_URL` : URL de votre API Vercel (ex: `https://api-members-jwt.vercel.app/api`)

## 📁 Structure du Projet

```
api-members-jwt/
├── index.js                 # Serveur API Express
├── package.json            # Dépendances API
├── vercel.json            # Config Vercel API
├── middleware/
│   └── verifyToken.js     # Middleware JWT
├── members-react-jwt/      # Frontend React
│   ├── src/
│   ├── package.json
│   ├── vercel.json        # Config Vercel Frontend
│   └── .env              # Variables d'environnement
└── deploy.sh             # Script de déploiement
```

## 🔧 Scripts Disponibles

### API (racine)
```bash
npm start    # Démarrer le serveur
npm run dev  # Développement avec nodemon
```

### Frontend (members-react-jwt)
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
```

## 🌐 Endpoints API

### Publiques
- `GET /` - Informations API
- `POST /api/login` - Connexion

### Protégées (nécessitent Bearer Token)
- `GET /api/members` - Liste des membres
- `GET /api/members/:id` - Détail d'un membre
- `POST /api/members` - Ajouter un membre
- `PUT /api/members/:id` - Modifier un membre
- `DELETE /api/members/:id` - Supprimer un membre

## 🔐 Authentification

Utilise JWT pour l'authentification :
- **Login** : `POST /api/login`
  ```json
  {
    "id": 1,
    "username": "fullstack",
    "password": "123456"
  }
  ```

- **Utilisation du token** :
  ```
  Authorization: Bearer <votre_token_jwt>
  ```

## 🚀 Déploiement Automatique

Utilisez le script `deploy.sh` pour un déploiement automatisé :

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📝 Notes Importantes

- **Sécurité** : Changez la clé JWT_SECRET en production
- **CORS** : Configuré pour accepter les requêtes du frontend
- **Base de données** : Actuellement en mémoire (à remplacer par une vraie BDD en production)

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Vercel dans le dashboard
2. Assurez-vous que les variables d'environnement sont configurées
3. Vérifiez que l'URL de l'API dans le frontend pointe vers la bonne URL Vercel

---

**🎉 Votre application est maintenant déployée sur Vercel et GitHub !**