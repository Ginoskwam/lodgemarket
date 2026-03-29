-- ============================================
-- Script pour corriger la contrainte CHECK sur la catégorie
-- ============================================
-- 
-- Ce script supprime l'ancienne contrainte et en crée une nouvelle
-- pour s'assurer qu'elle correspond exactement aux catégories dans le code
--
-- Instructions :
-- 1. Exécutez ce script dans le SQL Editor de Supabase
-- 2. Cela recréera la contrainte CHECK avec les bonnes valeurs

-- Supprimer l'ancienne contrainte si elle existe
ALTER TABLE annonces 
DROP CONSTRAINT IF EXISTS annonces_categorie_check;

-- Recréer la contrainte avec les valeurs exactes
ALTER TABLE annonces 
ADD CONSTRAINT annonces_categorie_check 
CHECK (categorie IN (
  'Bricolage & Outils', 
  'Jardinage & Extérieur', 
  'Événementiel & Fêtes', 
  'Audio & Musique', 
  'Sport & Loisirs', 
  'Transport & Mobilité', 
  'Multimédia & Électronique', 
  'Maison & Décoration', 
  'Cuisine & Électroménager', 
  'Autre'
));

-- Vérifier que toutes les annonces existantes ont des catégories valides
-- Si certaines annonces ont des catégories invalides, elles seront mises à 'Autre'
UPDATE annonces 
SET categorie = 'Autre'
WHERE categorie NOT IN (
  'Bricolage & Outils', 
  'Jardinage & Extérieur', 
  'Événementiel & Fêtes', 
  'Audio & Musique', 
  'Sport & Loisirs', 
  'Transport & Mobilité', 
  'Multimédia & Électronique', 
  'Maison & Décoration', 
  'Cuisine & Électroménager', 
  'Autre'
);

