#!/bin/bash

# Script simple pour réinitialiser le template d'email Supabase
# Nécessite SUPABASE_SERVICE_ROLE_KEY dans .env.local

cd "$(dirname "$0")/.."

# Charger les variables d'environnement
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non défini dans .env.local"
  exit 1
fi

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ Erreur: SUPABASE_SERVICE_ROLE_KEY non défini"
  echo ""
  echo "📝 Pour obtenir votre clé service_role:"
  echo "   1. Allez sur https://app.supabase.com"
  echo "   2. Sélectionnez votre projet"
  echo "   3. Allez dans Settings > API"
  echo "   4. Copiez la clé 'service_role' (⚠️ gardez-la secrète)"
  echo "   5. Ajoutez-la dans .env.local:"
  echo "      SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role"
  echo ""
  exit 1
fi

echo "🔄 Réinitialisation du template d'email de confirmation..."
echo ""

# Template par défaut
SUBJECT="Confirm your signup"
BODY='<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>'

# Extraire le hostname
HOSTNAME=$(echo "$SUPABASE_URL" | sed -E 's|https?://([^/]+).*|\1|')

# Essayer avec l'API auth
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  "https://${HOSTNAME}/auth/v1/templates/confirm_signup" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"subject\":\"${SUBJECT}\",\"body\":\"${BODY}\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY_RESPONSE=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
  echo "✅ Template d'email réinitialisé avec succès !"
  echo ""
  echo "📧 Le template 'Confirm signup' a été restauré à sa valeur par défaut."
  echo "   Vous pouvez maintenant tester l'inscription."
  echo ""
else
  echo "❌ Erreur HTTP $HTTP_CODE"
  if [ -n "$BODY_RESPONSE" ]; then
    echo "   Réponse: $BODY_RESPONSE"
  fi
  echo ""
  echo "💡 Cette méthode peut ne pas fonctionner avec toutes les versions de Supabase."
  echo "   Réinitialisez manuellement depuis le dashboard:"
  echo "   1. Allez sur https://app.supabase.com"
  echo "   2. Authentication > Email Templates"
  echo "   3. Cliquez sur 'Reset to default' pour 'Confirm signup'"
  echo ""
  exit 1
fi

