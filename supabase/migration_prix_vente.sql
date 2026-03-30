-- Prix de vente (achat/vente de gîtes)
--
-- Comment l’appliquer (sans CLI) :
-- 1. Ouvre https://supabase.com/dashboard → ton projet → SQL → New query
-- 2. Copie-colle tout ce fichier et clique Run (ou Cmd/Ctrl+Enter)
-- 3. Vérifie : Table Editor → table annonces → colonne prix_vente doit apparaître
--
-- Après exécution : l’app peut enregistrer prix_jour = 0 et prix_vente renseigné.

ALTER TABLE annonces
  ADD COLUMN IF NOT EXISTS prix_vente NUMERIC(12, 2);

COMMENT ON COLUMN annonces.prix_vente IS 'Prix de vente du bien en euros (hors frais).';

CREATE INDEX IF NOT EXISTS idx_annonces_prix_vente ON annonces (prix_vente)
  WHERE prix_vente IS NOT NULL;

-- Les inserts applicatifs envoient prix_jour = 0 pour les annonces vente (champ historique « location/jour »).
