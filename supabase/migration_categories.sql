-- ============================================
-- Script de migration des catégories
-- ============================================
-- 
-- Ce script met à jour les catégories existantes vers les nouvelles catégories
-- À exécuter après avoir mis à jour le CHECK constraint dans schema.sql
--
-- Instructions :
-- 1. Exécutez d'abord la mise à jour du CHECK constraint dans schema.sql
-- 2. Ensuite, exécutez ce script pour migrer les données existantes
-- 3. Vérifiez que toutes les annonces ont bien été migrées

-- Mise à jour des catégories existantes vers les nouvelles
UPDATE annonces
SET categorie = CASE
  WHEN categorie = 'Bricolage' THEN 'Bricolage & Outils'
  WHEN categorie = 'Événementiel' THEN 'Événementiel & Fêtes'
  WHEN categorie = 'Outdoor' THEN 'Jardinage & Extérieur'
  WHEN categorie = 'Audio / Musique' THEN 'Audio & Musique'
  ELSE categorie -- Garde les autres catégories si elles existent déjà
END
WHERE categorie IN ('Bricolage', 'Événementiel', 'Outdoor', 'Audio / Musique');

-- Vérification : compter les annonces par catégorie
SELECT categorie, COUNT(*) as nombre
FROM annonces
GROUP BY categorie
ORDER BY nombre DESC;

