-- ============================================
-- Script pour supprimer la contrainte CHECK sur la catégorie
-- ============================================
-- 
-- Ce script supprime la contrainte CHECK problématique.
-- La validation de la catégorie sera gérée côté application.
--
-- Instructions :
-- 1. Exécutez ce script dans le SQL Editor de Supabase
-- 2. Cela supprimera la contrainte CHECK et permettra les mises à jour

-- Supprimer la contrainte CHECK
ALTER TABLE annonces 
DROP CONSTRAINT IF EXISTS annonces_categorie_check;

-- Vérifier que la contrainte a été supprimée
SELECT 
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'annonces'::regclass
  AND conname = 'annonces_categorie_check';

-- Si la requête ci-dessus ne retourne rien, la contrainte a été supprimée avec succès

