#!/usr/bin/env node

/**
 * Script de test de connexion Supabase
 * Vérifie que le projet Supabase est accessible et configuré correctement
 */

const fs = require('fs')
const path = require('path')

// Lire le fichier .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ ERREUR: Le fichier .env.local n\'existe pas')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      env[key] = value
    }
  })
  
  return env
}

const env = loadEnvFile()
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Test de connexion Supabase...\n')

// Vérifier les variables d'environnement
if (!SUPABASE_URL) {
  console.error('❌ ERREUR: NEXT_PUBLIC_SUPABASE_URL n\'est pas défini dans .env.local')
  process.exit(1)
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ ERREUR: NEXT_PUBLIC_SUPABASE_ANON_KEY n\'est pas défini dans .env.local')
  process.exit(1)
}

console.log('✅ Variables d\'environnement trouvées')
console.log(`   URL: ${SUPABASE_URL.substring(0, 30)}...`)
console.log(`   Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`)

// Vérifier le format de l'URL
if (!SUPABASE_URL.startsWith('https://')) {
  console.warn('⚠️  ATTENTION: L\'URL ne commence pas par https://')
}

if (!SUPABASE_URL.includes('.supabase.co')) {
  console.warn('⚠️  ATTENTION: L\'URL ne semble pas être une URL Supabase standard')
}

// Tester la connexion
async function testConnection() {
  try {
    console.log('🔄 Test de connexion au serveur...')
    console.log(`   Tentative de connexion à: ${SUPABASE_URL}\n`)
    
    // Utiliser https si disponible, sinon fetch global
    const https = require('https')
    const { URL } = require('url')
    
    // Test simple avec https
    const testUrl = new URL(SUPABASE_URL)
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: testUrl.hostname,
        port: testUrl.port || 443,
        path: '/rest/v1/',
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        timeout: 10000, // 10 secondes
      }

      const req = https.request(options, (res) => {
        console.log(`   Status: ${res.statusCode}`)
        console.log(`   Headers:`, res.headers)
        
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log('✅ Connexion au serveur réussie')
          resolve(true)
        } else {
          console.error(`❌ ERREUR: Le serveur a retourné le status ${res.statusCode}`)
          resolve(false)
        }
      })

      req.on('error', (error) => {
        console.error('❌ ERREUR de connexion:')
        console.error(`   ${error.message}`)
        
        if (error.code === 'ENOTFOUND') {
          console.error('\n💡 Le domaine Supabase n\'a pas été trouvé.')
          console.error('   Vérifiez que l\'URL est correcte dans .env.local')
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
          console.error('\n💡 Impossible de se connecter au serveur.')
          console.error('   Votre projet Supabase est peut-être encore en cours de réactivation.')
          console.error('   Attendez quelques minutes et réessayez.')
        } else if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
          console.error('\n💡 Problème de certificat SSL.')
          console.error('   Vérifiez la date de votre système.')
        }
        
        resolve(false)
      })

      req.on('timeout', () => {
        req.destroy()
        console.error('❌ Timeout: La connexion a pris trop de temps')
        console.error('   Votre projet Supabase est peut-être encore en cours de réactivation.')
        resolve(false)
      })

      req.end()
    })

    if (response.status === 200 || response.status === 404) {
      // 404 est normal pour l'endpoint root
      console.log('✅ Connexion au serveur réussie')
      console.log(`   Status: ${response.status}`)
    } else {
      console.error(`❌ ERREUR: Le serveur a retourné le status ${response.status}`)
      console.error(`   Message: ${response.statusText}`)
      return false
    }

    // Test de l'API Auth
    console.log('\n🔄 Test de l\'API Auth...')
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
      },
    })

    if (authResponse.ok) {
      const healthData = await authResponse.json()
      console.log('✅ API Auth accessible')
      console.log(`   Status: ${authResponse.status}`)
      if (healthData) {
        console.log(`   Health: ${JSON.stringify(healthData)}`)
      }
    } else {
      console.warn(`⚠️  API Auth retourne le status ${authResponse.status}`)
      console.warn(`   Cela peut être normal si le projet vient d'être réactivé`)
    }

    console.log('\n✅ Tous les tests sont passés !')
    console.log('💡 Si vous avez des problèmes de connexion, vérifiez :')
    console.log('   1. Que votre projet Supabase est actif (pas en pause)')
    console.log('   2. Que les variables d\'environnement sont à jour')
    console.log('   3. Que vous avez redémarré le serveur de développement après modification de .env.local')
    
    return true
  } catch (error) {
    console.error('\n❌ ERREUR lors du test de connexion:')
    console.error(`   ${error.message}`)
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('\n💡 Suggestions:')
      console.error('   1. Vérifiez que votre projet Supabase est actif (pas en pause)')
      console.error('   2. Vérifiez votre connexion internet')
      console.error('   3. Vérifiez que l\'URL Supabase est correcte')
      console.error('   4. Attendez quelques minutes si vous venez de réactiver le projet')
    }
    
    return false
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1)
})

