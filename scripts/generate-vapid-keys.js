/**
 * Script pour générer les clés VAPID
 * Usage: node scripts/generate-vapid-keys.js
 */

const webpush = require('web-push')

// Générer les clés VAPID
const vapidKeys = webpush.generateVAPIDKeys()

console.log('\n=== Clés VAPID générées ===\n')
console.log('Clé publique (à mettre dans .env.local):')
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\n`)
console.log('Clé privée (à mettre dans .env.local):')
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`)
console.log('Email VAPID (optionnel, à mettre dans .env.local):')
console.log('VAPID_EMAIL=mailto:contact@broques.fr\n')
console.log('=== Fin ===\n')

