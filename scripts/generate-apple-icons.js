#!/usr/bin/env node

/**
 * Script pour générer les icônes Apple (PNG) à partir du SVG
 * Utilise sharp si disponible, sinon utilise puppeteer ou un autre outil
 */

const fs = require('fs');
const path = require('path');

async function generateAppleIcons() {
  const svgPath = path.join(__dirname, '../public/apple-icon.svg');
  const outputDir = path.join(__dirname, '../public');
  
  // Vérifier si le SVG existe
  if (!fs.existsSync(svgPath)) {
    console.error('Le fichier apple-icon.svg n\'existe pas');
    process.exit(1);
  }

  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  try {
    // Essayer d'utiliser sharp
    const sharp = require('sharp');
    
    // Générer apple-icon-180.png (180x180 pour iPhone)
    await sharp(Buffer.from(svgContent), { density: 300 })
      .resize(180, 180, { 
        fit: 'contain',
        background: { r: 194, g: 65, b: 12, alpha: 1 } // #C2410C
      })
      .png()
      .toFile(path.join(outputDir, 'apple-icon-180.png'));
    
    console.log('✓ apple-icon-180.png généré avec succès');
    
    // Générer apple-icon.png (généralement 152x152 pour iPad)
    await sharp(Buffer.from(svgContent), { density: 300 })
      .resize(152, 152, { 
        fit: 'contain',
        background: { r: 194, g: 65, b: 12, alpha: 1 } // #C2410C
      })
      .png()
      .toFile(path.join(outputDir, 'apple-icon.png'));
    
    console.log('✓ apple-icon.png généré avec succès');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ La bibliothèque "sharp" n\'est pas installée.');
      console.error('Pour générer les icônes PNG, installez sharp :');
      console.error('  npm install --save-dev sharp');
      console.error('');
      console.error('Ou utilisez un outil en ligne comme :');
      console.error('  - https://convertio.co/svg-png/');
      console.error('  - https://cloudconvert.com/svg-to-png');
      console.error('');
      console.error('Dimensions nécessaires :');
      console.error('  - apple-icon-180.png : 180x180 pixels');
      console.error('  - apple-icon.png : 152x152 pixels');
      process.exit(1);
    } else {
      console.error('Erreur lors de la génération des icônes:', error);
      process.exit(1);
    }
  }
}

generateAppleIcons();

