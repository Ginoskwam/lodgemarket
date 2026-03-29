#!/usr/bin/env node

/**
 * Script pour réinitialiser le template d'email de confirmation Supabase
 * 
 * Usage:
 *   node scripts/reset-email-template.js
 * 
 * Nécessite SUPABASE_SERVICE_ROLE_KEY dans .env.local ou en variable d'environnement
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnvFile();

// Récupération des variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL doit être défini dans .env.local');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erreur: SUPABASE_SERVICE_ROLE_KEY doit être défini');
  console.error('\n📝 Pour obtenir votre clé service_role:');
  console.error('   1. Allez sur https://app.supabase.com');
  console.error('   2. Sélectionnez votre projet');
  console.error('   3. Allez dans Settings > API');
  console.error('   4. Copiez la clé "service_role" (⚠️ gardez-la secrète)');
  console.error('   5. Ajoutez-la dans .env.local:');
  console.error('      SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role\n');
  process.exit(1);
}

// Extraction du project reference depuis l'URL
const projectRef = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Erreur: Impossible d\'extraire le project reference de l\'URL Supabase');
  process.exit(1);
}

console.log('🔄 Réinitialisation du template d\'email de confirmation...');
console.log(`📦 Projet: ${projectRef}\n`);

// Template par défaut de Supabase pour "Confirm signup"
const defaultTemplate = {
  subject: 'Confirm your signup',
  body: `<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>`
};

// Utiliser l'API REST interne de Supabase
const apiUrl = `${SUPABASE_URL}/rest/v1/rpc/reset_email_template`;

// Alternative: utiliser l'endpoint auth directement
const authApiUrl = `${SUPABASE_URL}/auth/v1/admin/users`;

// En fait, Supabase utilise l'API Management pour les templates
// Essayons avec l'API interne via REST
const templateUrl = `${SUPABASE_URL.replace('/rest/v1', '')}/auth/v1/templates/confirm_signup`;

const options = {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Content-Type': 'application/json'
  }
};

const requestData = JSON.stringify({
  subject: defaultTemplate.subject,
  body: defaultTemplate.body
});

// Extraire le hostname de l'URL
const urlObj = new URL(SUPABASE_URL);
const hostname = urlObj.hostname;
const pathname = '/auth/v1/templates/confirm_signup';

const httpsOptions = {
  hostname: hostname,
  path: pathname,
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Content-Type': 'application/json'
  }
};

console.log('📡 Connexion à Supabase...');

const req = https.request(httpsOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 204) {
      console.log('✅ Template d\'email réinitialisé avec succès !');
      console.log('\n📧 Le template "Confirm signup" a été restauré à sa valeur par défaut.');
      console.log('   Vous pouvez maintenant tester l\'inscription.\n');
    } else {
      console.error(`❌ Erreur ${res.statusCode}`);
      if (data) {
        try {
          const errorData = JSON.parse(data);
          console.error('   Message:', errorData.message || errorData.error || data);
        } catch (e) {
          console.error('   Réponse:', data);
        }
      }
      console.error('\n💡 Note: Cette méthode peut ne pas fonctionner avec toutes les versions de Supabase.');
      console.error('   Si cela échoue, réinitialisez manuellement depuis le dashboard:');
      console.error('   1. Allez sur https://app.supabase.com');
      console.error('   2. Authentication > Email Templates');
      console.error('   3. Cliquez sur "Reset to default" pour "Confirm signup"\n');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
  console.error('\n💡 Vérifiez votre connexion internet et réessayez.');
  console.error('   Ou réinitialisez manuellement depuis le dashboard Supabase.\n');
  process.exit(1);
});

req.write(requestData);
req.end();

