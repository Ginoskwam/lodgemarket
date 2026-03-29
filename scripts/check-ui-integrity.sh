#!/bin/bash

# Script de vérification de l'intégrité de l'UI
# Vérifie que les fichiers critiques n'ont pas été cassés

echo "🔍 Vérification de l'intégrité de l'UI..."

ERRORS=0

# Vérifier que globals.css contient les directives Tailwind
if ! grep -q "@tailwind base" app/globals.css; then
    echo "❌ ERREUR: Directive @tailwind base manquante dans app/globals.css"
    ERRORS=$((ERRORS + 1))
fi

if ! grep -q "@tailwind components" app/globals.css; then
    echo "❌ ERREUR: Directive @tailwind components manquante dans app/globals.css"
    ERRORS=$((ERRORS + 1))
fi

if ! grep -q "@tailwind utilities" app/globals.css; then
    echo "❌ ERREUR: Directive @tailwind utilities manquante dans app/globals.css"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier que layout.tsx importe globals.css
if ! grep -q "import './globals.css'" app/layout.tsx; then
    echo "❌ ERREUR: Import de globals.css manquant dans app/layout.tsx"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier que postcss.config.js existe
if [ ! -f "postcss.config.js" ]; then
    echo "❌ ERREUR: postcss.config.js manquant"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier que tailwind.config.ts existe
if [ ! -f "tailwind.config.ts" ]; then
    echo "❌ ERREUR: tailwind.config.ts manquant"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ Toutes les vérifications sont passées ! L'UI est intacte."
    exit 0
else
    echo "❌ $ERRORS erreur(s) détectée(s). L'UI peut être cassée."
    exit 1
fi

