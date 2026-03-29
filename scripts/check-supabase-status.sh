#!/bin/bash

# Script pour vérifier le statut de connexion Supabase

echo "🔍 Vérification du statut Supabase..."
echo ""

# Lire les variables d'environnement
if [ ! -f ".env.local" ]; then
    echo "❌ Fichier .env.local non trouvé"
    exit 1
fi

SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -d '"' | tr -d "'")

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env.local"
    exit 1
fi

# Extraire le domaine
DOMAIN=$(echo "$SUPABASE_URL" | sed -e 's|https\?://||' -e 's|/.*||')

echo "📍 Domaine Supabase: $DOMAIN"
echo ""

# Test DNS
echo "🔍 Test DNS..."
if nslookup $DOMAIN > /dev/null 2>&1; then
    echo "✅ DNS: Le domaine est résolu"
    IP=$(nslookup $DOMAIN | grep -A 1 "Name:" | tail -1 | awk '{print $2}')
    echo "   Adresse IP: $IP"
else
    echo "❌ DNS: Le domaine ne peut pas être résolu"
    exit 1
fi

echo ""

# Test de connexion HTTP
echo "🔍 Test de connexion HTTP..."
if curl -I --max-time 10 --silent --fail "$SUPABASE_URL/rest/v1/" > /dev/null 2>&1; then
    echo "✅ HTTP: Le serveur répond"
    STATUS=$(curl -I --max-time 10 --silent --write-out "%{http_code}" "$SUPABASE_URL/rest/v1/" -o /dev/null)
    echo "   Status: $STATUS"
else
    echo "❌ HTTP: Le serveur ne répond pas"
    echo ""
    echo "💡 Le projet Supabase est peut-être:"
    echo "   - Encore en cours de réactivation (attendre 5-10 minutes)"
    echo "   - Suspendu ou inactif"
    echo "   - En maintenance"
    echo ""
    echo "📋 Vérifiez le statut sur: https://supabase.com/dashboard"
    exit 1
fi

echo ""
echo "✅ Tous les tests sont passés !"

