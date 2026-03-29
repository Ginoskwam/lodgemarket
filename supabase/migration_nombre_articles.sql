-- ============================================
-- Script de migration pour ajouter le champ nombre_articles
-- ============================================
-- 
-- Ce script ajoute la colonne nombre_articles à la table annonces
-- À exécuter si la table existe déjà
--
-- Instructions :
-- 1. Exécutez ce script dans le SQL Editor de Supabase
-- 2. Les annonces existantes auront nombre_articles = 1 par défaut

-- Ajouter la colonne nombre_articles si elle n'existe pas déjà
ALTER TABLE annonces 
ADD COLUMN IF NOT EXISTS nombre_articles INTEGER DEFAULT 1;

-- Mettre à jour les annonces existantes qui n'ont pas de valeur
UPDATE annonces 
SET nombre_articles = 1 
WHERE nombre_articles IS NULL;

