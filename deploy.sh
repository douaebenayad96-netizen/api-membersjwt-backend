#!/bin/bash

echo "🚀 Déploiement du projet API Members JWT sur Vercel et GitHub"
echo "============================================================"

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📝 Initialisation du dépôt Git..."
    git init
    git add .
    git commit -m "Initial commit: API Members JWT"
fi

# Demander le nom du repo GitHub
echo "📋 Entrez le nom de votre dépôt GitHub (ex: api-members-jwt):"
read repo_name

# Créer le repo sur GitHub (nécessite GitHub CLI)
echo "🔗 Création du dépôt sur GitHub..."
gh repo create $repo_name --public --source=. --remote=origin --push

echo "✅ Dépôt GitHub créé et code poussé!"

# Déployer l'API sur Vercel
echo "🔧 Déploiement de l'API sur Vercel..."
cd /d/C:/Users/dell/Desktop/Cloud/api-members-jwt
vercel --prod

echo "🎉 API déployée sur Vercel!"

# Déployer le frontend sur Vercel
echo "🎨 Déploiement du frontend sur Vercel..."
cd members-react-jwt
vercel --prod

echo "🎊 Frontend déployé sur Vercel!"
echo ""
echo "📝 N'oubliez pas de configurer les variables d'environnement dans Vercel:"
echo "   - JWT_SECRET: Votre clé secrète JWT"
echo "   - REACT_APP_API_URL: URL de votre API Vercel"
echo ""
echo "✨ Déploiement terminé! Votre application est maintenant en ligne."