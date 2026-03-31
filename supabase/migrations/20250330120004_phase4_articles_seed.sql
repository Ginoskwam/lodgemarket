-- PHASE 4 — Articles publics (ressources / blog minimal)

INSERT INTO public.articles (slug, title, content, published) VALUES
(
  'fiscalite-gites-belgique',
  'La fiscalité des gîtes en Belgique (aperçu)',
  $$Les revenus tirés de la location d'un gîte relèvent en principe de revenus immobiliers ou, selon les cas, d'une activité économique. Les règles diffèrent selon que vous relevez du régime de la location meublée, d'une activité accessoire ou d'une véritable exploitation hôtelière.

En Région wallonne, l'intervention du Commissariat général au Tourisme (CGT) peut s'appliquer selon la catégorie de l'hébergement. Ce court article ne constitue pas un conseil fiscal : rapprochez-vous d'un expert-comptable ou d'un notaire pour votre situation personnelle.$$,
  true
),
(
  'donnees-business-gite',
  'Pourquoi les données business comptent pour l''acheteur',
  $$Avant d'investir dans un actif touristique, l'acheteur raisonnable compare le prix demandé à un historique de revenus, de taux d'occupation et de charges. Lodgemarket encourage la transmission de ces indicateurs lorsqu'ils sont disponibles et vérifiables.

Une annonce avec métriques structurées réduit l'incertitude et accélère la phase de due diligence.$$,
  true
),
(
  'parcours-achat-gite',
  'Parcours type : de la sélection à l''acte authentique',
  $$1. Définir votre enveloppe et votre zone géographique.
2. Constituer une short-list via le catalogue et demander les dossiers complets.
3. Auditer permis, homologation et comptes avec des professionnels.
4. Formuler une offre et la faire valider juridiquement.
5. Signer chez le notaire et planifier la reprise d'exploitation.

Lodgemarket facilite les premières étapes ; la transaction reste encadrée par vos conseils.$$,
  true
)
ON CONFLICT (slug) DO NOTHING;
