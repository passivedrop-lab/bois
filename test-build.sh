#!/bin/bash
echo "🔍 Test du build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
    echo "🚀 Démarrage du serveur de test..."
    timeout 15 npm run dev &
    sleep 8
    echo "📡 Test de la page d'accueil..."
    curl -s http://localhost:3000 | head -20
    echo ""
    echo "📡 Test de la page /ru..."
    curl -s http://localhost:3000/ru | head -20
    pkill -f "next dev"
    echo "✅ Tests terminés"
else
    echo "❌ Erreur de build!"
    exit 1
fi


