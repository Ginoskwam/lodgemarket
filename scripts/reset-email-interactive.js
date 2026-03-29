#!/usr/bin/env node

/**
 * Script interactif pour réinitialiser le template d'email Supabase
 * Demande la clé service_role si elle n'est pas dans .env.local
 */

const https = require('https');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Charger .env.local
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  let SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  let SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL) {
    console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env.local');
    process.exit(1);
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n📝 La clé service_role n\'est pas dans .env.local');
    console.log('   Je vais vous la demander maintenant.\n');
    console.log('   Pour l\'obtenir:');
    console.log('   1. Allez sur https://app.supabase.com');
    console.log('   2. Settings > API > service_role key\n');
    
    SUPABASE_SERVICE_ROLE_KEY = await question('🔑 Entrez votre clé service_role: ');
    
    if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.trim().length === 0) {
      console.error('\n❌ Clé service_role requise');
      rl.close();
      process.exit(1);
    }
    
    SUPABASE_SERVICE_ROLE_KEY = SUPABASE_SERVICE_ROLE_KEY.trim();
    
    // Proposer de sauvegarder dans .env.local
    const save = await question('\n💾 Voulez-vous sauvegarder cette clé dans .env.local ? (o/n): ');
    if (save.toLowerCase() === 'o' || save.toLowerCase() === 'oui' || save.toLowerCase() === 'y' || save.toLowerCase() === 'yes') {
      const envPath = path.join(__dirname, '..', '.env.local');
      const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      
      if (!envContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        const newLine = `SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}\n`;
        fs.appendFileSync(envPath, newLine);
        console.log('✅ Clé sauvegardée dans .env.local');
      } else {
        console.log('⚠️  La clé existe déjà dans .env.local');
      }
    }
  }

  // Extraire le hostname
  const urlObj = new URL(SUPABASE_URL);
  const hostname = urlObj.hostname;

  console.log('\n🔄 Réinitialisation du template d\'email de confirmation...');
  console.log(`📦 Projet: ${hostname}\n`);

  // Template par défaut
  const defaultTemplate = {
    subject: 'Confirm your signup',
    body: `<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>`
  };

  const httpsOptions = {
    hostname: hostname,
    path: '/auth/v1/templates/confirm_signup',
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(httpsOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        rl.close();
        
        if (res.statusCode === 200 || res.statusCode === 204) {
          console.log('✅ Template d\'email réinitialisé avec succès !');
          console.log('\n📧 Le template "Confirm signup" a été restauré à sa valeur par défaut.');
          console.log('   Vous pouvez maintenant tester l\'inscription.\n');
          resolve();
        } else {
          console.error(`❌ Erreur HTTP ${res.statusCode}`);
          if (data) {
            try {
              const errorData = JSON.parse(data);
              console.error('   Message:', errorData.message || errorData.error || data);
            } catch (e) {
              console.error('   Réponse:', data);
            }
          }
          console.error('\n💡 Cette méthode peut ne pas fonctionner avec toutes les versions de Supabase.');
          console.error('   Réinitialisez manuellement depuis le dashboard:');
          console.error('   1. Allez sur https://app.supabase.com');
          console.error('   2. Authentication > Email Templates');
          console.error('   3. Cliquez sur "Reset to default" pour "Confirm signup"\n');
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      rl.close();
      console.error('❌ Erreur de connexion:', error.message);
      console.error('\n💡 Vérifiez votre connexion internet et réessayez.');
      reject(error);
    });

    req.write(JSON.stringify({
      subject: defaultTemplate.subject,
      body: defaultTemplate.body
    }));
    
    req.end();
  });
}

main().catch(() => process.exit(1));

