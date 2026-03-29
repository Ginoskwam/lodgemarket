import Link from 'next/link'

/**
 * Page des Conditions Générales d'Utilisation
 * Design propre et professionnel, typographie lisible
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-broques">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* En-tête avec lien retour */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium mb-6 transition-colors"
          >
            <span className="mr-2">←</span>
            Retour à l'accueil
          </Link>
          <h1 className="heading-1 mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-small text-charbon-secondary">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Contenu scrollable */}
        <div className="card p-8 md:p-12 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Introduction */}
          <div className="space-y-4">
            <p className="body-text text-charbon-text">
              Bienvenue sur <strong>Lodgemarket</strong> (ci-après "la Plateforme").
            </p>
            <p className="body-text text-charbon-text">
              La présente Plateforme permet aux utilisateurs de publier et consulter des annonces de prêt ou de location de matériel entre particuliers et de communiquer entre eux. 
              Elle met uniquement en relation des utilisateurs et <strong>n'intervient à aucun moment dans les transactions</strong>, paiements, remises de matériel ou litiges éventuels.
            </p>
            <p className="body-text text-charbon-text">
              L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU).
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣ Identification de la Plateforme</h2>
            <div className="space-y-2 text-charbon-text">
              <p><strong>Éditeur :</strong> Lodgemarket</p>
              <p><strong>Siège social :</strong> Belgique</p>
              <p><strong>Email de contact :</strong> info@newinc.be</p>
              <p><strong>Pays :</strong> Belgique</p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="heading-3">2️⃣ Objet du service</h2>
            <div className="space-y-3">
              <div>
                <p className="body-text text-charbon-text mb-2">La Plateforme :</p>
                <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                  <li>permet de publier des annonces de mise à disposition de matériel</li>
                  <li>permet de rechercher des annonces</li>
                  <li>met à disposition une messagerie interne pour échanger</li>
                </ul>
              </div>
              <div>
                <p className="body-text text-charbon-text mb-2">La Plateforme <strong>n'est pas</strong> :</p>
                <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                  <li>une société de location</li>
                  <li>un intermédiaire contractuel</li>
                  <li>un garant</li>
                  <li>un gestionnaire de paiement</li>
                  <li>une compagnie d'assurance</li>
                </ul>
              </div>
              <p className="body-text text-charbon-text">
                Les utilisateurs concluent leurs accords <strong>entre eux</strong>, sous leur entière responsabilité.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="heading-3">3️⃣ Accès et création de compte</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Pour utiliser certaines fonctionnalités, l'utilisateur doit créer un compte :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>fournir des informations exactes</li>
                <li>ne pas usurper d'identité</li>
                <li>maintenir ses informations à jour</li>
              </ul>
              <p className="body-text text-charbon-text">
                L'utilisateur est responsable de la confidentialité de ses identifiants.
              </p>
              <p className="body-text text-charbon-text">
                La Plateforme peut suspendre ou supprimer un compte en cas :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>de non-respect des présentes CGU</li>
                <li>d'utilisation abusive</li>
                <li>de fausses informations</li>
                <li>d'activités frauduleuses</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="heading-3">4️⃣ Annonces publiées</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Les utilisateurs sont entièrement responsables du contenu publié.
              </p>
              <p className="body-text text-charbon-text">
                Les annonces doivent :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>être exactes et sincères</li>
                <li>décrire clairement le matériel proposé</li>
                <li>respecter la loi belge</li>
                <li>ne pas porter atteinte à des droits tiers</li>
              </ul>
              <p className="body-text text-charbon-text">
                Sont interdits :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>contenus illégaux</li>
                <li>contenus diffamatoires</li>
                <li>propos haineux / discriminatoires</li>
                <li>activités commerciales trompeuses</li>
              </ul>
              <p className="body-text text-charbon-text">
                La Plateforme se réserve le droit de modifier, refuser ou supprimer toute annonce non conforme.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="heading-3">5️⃣ Fonctionnement entre utilisateurs</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Tout accord concernant :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>les conditions de prêt / location</li>
                <li>le montant éventuel</li>
                <li>la caution</li>
                <li>les modalités de remise et retour</li>
                <li>l'état du matériel</li>
              </ul>
              <p className="body-text text-charbon-text">
                est conclu <strong>directement entre les utilisateurs</strong>.
              </p>
              <p className="body-text text-charbon-text">
                La Plateforme recommande :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>une remise en main propre</li>
                <li>la vérification de l'identité</li>
                <li>un accord clair avant toute mise à disposition</li>
                <li>si nécessaire, l'utilisation d'un document écrit entre utilisateurs</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="heading-3">6️⃣ Paiement et finances</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                La Plateforme :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>n'encaisse aucun paiement</li>
                <li>ne conserve aucune somme</li>
                <li>n'assure aucune transaction</li>
              </ul>
              <p className="body-text text-charbon-text">
                Toute transaction financière s'effectue <strong>hors de la Plateforme</strong>, sous la responsabilité exclusive des utilisateurs.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="heading-3">7️⃣ Responsabilité</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                L'utilisateur reconnaît que :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>la Plateforme ne peut garantir l'exactitude des annonces</li>
                <li>la Plateforme ne vérifie pas les utilisateurs</li>
                <li>la Plateforme ne garantit pas l'état ou la disponibilité du matériel</li>
              </ul>
              <p className="body-text text-charbon-text">
                La Plateforme <strong>ne peut être tenue responsable</strong> :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>en cas de litige entre utilisateurs</li>
                <li>en cas de retard, annulation, non-remise, perte ou vol</li>
                <li>en cas de dommage causé au matériel ou à un tiers</li>
                <li>en cas d'usage frauduleux de la Plateforme</li>
              </ul>
              <p className="body-text text-charbon-text">
                L'utilisateur utilise la Plateforme sous sa propre responsabilité.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="heading-3">8️⃣ Messagerie</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Une messagerie interne permet d'échanger.
              </p>
              <p className="body-text text-charbon-text">
                L'utilisateur s'interdit :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>le spam</li>
                <li>le harcèlement</li>
                <li>les messages insultants</li>
                <li>toute tentative d'escroquerie</li>
              </ul>
              <p className="body-text text-charbon-text">
                La Plateforme peut suspendre tout compte en cas d'abus.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="heading-3">9️⃣ Données personnelles</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Certaines données sont nécessaires au fonctionnement du service.
              </p>
              <p className="body-text text-charbon-text">
                La Plateforme s'engage à :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>collecter uniquement ce qui est nécessaire</li>
                <li>protéger les données</li>
                <li>ne pas les vendre</li>
              </ul>
              <p className="body-text text-charbon-text">
                Les droits RGPD s'appliquent :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>droit d'accès</li>
                <li>droit de rectification</li>
                <li>droit de suppression</li>
              </ul>
              <p className="body-text text-charbon-text">
                Plus d'informations : [lien vers politique de confidentialité].
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="heading-3">🔟 Disponibilité du service</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                La Plateforme s'efforce de rester accessible mais ne garantit pas :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>l'absence d'erreur</li>
                <li>l'absence d'interruption</li>
                <li>la continuité du service</li>
              </ul>
              <p className="body-text text-charbon-text">
                Des évolutions ou interruptions peuvent avoir lieu sans préavis.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣1️⃣ Propriété intellectuelle</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Le contenu de la Plateforme (nom, logo, interface, textes généraux) appartient à l'Éditeur.
              </p>
              <p className="body-text text-charbon-text">
                Les utilisateurs conservent la propriété de leurs annonces mais accordent une licence d'affichage non exclusive.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣2️⃣ Modification des CGU</h2>
            <p className="body-text text-charbon-text">
              Les présentes CGU peuvent évoluer.
              Les utilisateurs seront informés en cas de modification importante.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣3️⃣ Droit applicable et juridiction</h2>
            <p className="body-text text-charbon-text">
              Les présentes CGU sont soumises au droit belge.
              En cas de litige non résolu à l'amiable, les tribunaux compétents seront ceux de Belgique.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 14 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣4️⃣ Contact</h2>
            <p className="body-text text-charbon-text">
              Pour toute question concernant ces CGU :
            </p>
            <p className="body-text text-charbon-text">
              📧 <a href="mailto:info@newinc.be" className="text-primary hover:text-primary-dark underline">info@newinc.be</a>
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Conclusion */}
          <div className="pt-4">
            <p className="body-text text-charbon-text italic">
              Merci d'utiliser la Plateforme de manière responsable, respectueuse et intelligente.
            </p>
          </div>
        </div>

        {/* Lien retour en bas */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="btn-secondary inline-block"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

