import Link from 'next/link'

/**
 * Page de la Politique de Confidentialité
 * Design propre et professionnel, typographie lisible
 */
export default function PrivacyPage() {
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
          <h1 className="heading-1 mb-4">Politique de Confidentialité</h1>
          <p className="text-small text-charbon-secondary">
            Dernière mise à jour : 22/12/2025
          </p>
        </div>

        {/* Contenu scrollable */}
        <div className="card p-8 md:p-12 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Introduction */}
          <div className="space-y-4">
            <p className="body-text text-charbon-text">
              La présente Politique de Confidentialité explique comment <strong>Lodgemarket</strong> (ci-après "la Plateforme") collecte, utilise et protège vos données personnelles dans le cadre de l'utilisation de ses services.
            </p>
            <p className="body-text text-charbon-text">
              La Plateforme respecte la législation européenne et belge en matière de protection des données, et notamment le Règlement Général sur la Protection des Données (RGPD).
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣ Responsable du traitement</h2>
            <div className="space-y-2 text-charbon-text">
              <p><strong>Éditeur :</strong> New Inc. SRL</p>
              <p><strong>Adresse :</strong> Pré Lorint 36, 4052 Beaufays</p>
              <p><strong>Pays :</strong> Belgique</p>
              <p><strong>Email de contact :</strong> <a href="mailto:info@newinc.be" className="text-primary hover:text-primary-dark underline">info@newinc.be</a></p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="heading-3">2️⃣ Données collectées</h2>
            <p className="body-text text-charbon-text">
              Nous collectons uniquement les données nécessaires au fonctionnement du service.
            </p>
            
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-charbon-text mb-2">2.1 Lors de la création de compte</h3>
                <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                  <li>adresse email</li>
                  <li>mot de passe (chiffré et jamais visible par nous)</li>
                  <li>pseudo</li>
                  <li>ville ou localisation approximative</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-charbon-text mb-2">2.2 Lors de l'utilisation</h3>
                <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                  <li>contenu des annonces</li>
                  <li>contenu des messages échangés via la messagerie interne</li>
                  <li>informations de navigation techniques (logs, adresse IP, informations de sécurité)</li>
                </ul>
              </div>
            </div>
            
            <p className="body-text text-charbon-text mt-4">
              Nous ne collectons <strong>aucune donnée sensible</strong>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="heading-3">3️⃣ Finalités de la collecte</h2>
            <p className="body-text text-charbon-text">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>permettre la création et la gestion de votre compte</li>
              <li>publier et afficher vos annonces</li>
              <li>permettre la mise en relation entre utilisateurs</li>
              <li>assurer le bon fonctionnement technique de la Plateforme</li>
              <li>prévenir les abus et fraudes</li>
              <li>répondre à vos éventuelles demandes de support</li>
            </ul>
            <p className="body-text text-charbon-text mt-4">
              Nous <strong>ne revendons pas</strong> vos données et nous ne les utilisons pas à des fins marketing sans votre consentement préalable.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="heading-3">4️⃣ Base légale (RGPD)</h2>
            <p className="body-text text-charbon-text">
              Le traitement de vos données repose sur :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>l'exécution du contrat (article 6.1.b RGPD) : utilisation du service</li>
              <li>l'intérêt légitime (article 6.1.f RGPD) : sécurité, amélioration du service</li>
              <li>le respect d'obligations légales si applicable</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="heading-3">5️⃣ Messagerie interne</h2>
            <p className="body-text text-charbon-text">
              Les messages échangés via la Plateforme sont privés entre utilisateurs.
            </p>
            <p className="body-text text-charbon-text">
              Toutefois, en cas de signalement ou suspicion d'abus, nous pouvons être amenés à consulter certains échanges pour vérifier le respect des règles d'utilisation.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="heading-3">6️⃣ Destinataires des données</h2>
            <p className="body-text text-charbon-text">
              Les données sont accessibles uniquement :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>à l'équipe de la Plateforme (dans le cadre strict de la gestion du service)</li>
              <li>aux prestataires techniques nécessaires (hébergement / base de données / email), soumis à confidentialité</li>
            </ul>
            <p className="body-text text-charbon-text mt-4">
              Aucune donnée n'est cédée ou vendue à des tiers.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="heading-3">7️⃣ Hébergement et stockage</h2>
            <p className="body-text text-charbon-text">
              Les données sont hébergées via des prestataires techniques fiables et sécurisés.
            </p>
            <p className="body-text text-charbon-text">
              Elles peuvent être stockées au sein de l'Union Européenne ou, si hors UE, uniquement chez des prestataires garantissant une protection équivalente (clauses contractuelles types, etc.).
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="heading-3">8️⃣ Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>compte utilisateur : tant que vous utilisez le service</li>
              <li>annonces : tant qu'elles sont publiées</li>
              <li>messages : tant que votre compte est actif</li>
              <li>logs techniques : durée raisonnable pour sécurité et diagnostic</li>
            </ul>
            <p className="body-text text-charbon-text mt-4">
              Vous pouvez demander suppression à tout moment (voir section Droits RGPD).
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="heading-3">9️⃣ Sécurité</h2>
            <p className="body-text text-charbon-text">
              Nous mettons en œuvre des mesures raisonnables pour protéger vos données :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>chiffrement</li>
              <li>contrôle d'accès</li>
              <li>sécurisation des communications</li>
            </ul>
            <p className="body-text text-charbon-text mt-4">
              Cependant, aucun système n'étant parfait, nous ne pouvons garantir une sécurité absolue.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="heading-3">🔟 Cookies et traceurs</h2>
            <p className="body-text text-charbon-text">
              La Plateforme peut utiliser :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>cookies techniques nécessaires au fonctionnement</li>
              <li>cookies de sécurité (authentification)</li>
            </ul>
            <p className="body-text text-charbon-text mt-4">
              Si des cookies analytiques ou marketing sont ajoutés ultérieurement, un bandeau de consentement sera affiché conformément à la loi.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣1️⃣ Vos droits (RGPD)</h2>
            <p className="body-text text-charbon-text">
              Vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>droit d'accès</li>
              <li>droit de rectification</li>
              <li>droit à l'effacement</li>
              <li>droit à la limitation du traitement</li>
              <li>droit d'opposition</li>
              <li>droit à la portabilité</li>
            </ul>
            <p className="body-text text-charbon-text mt-4">
              Pour exercer vos droits, contactez-nous à :
            </p>
            <p className="body-text text-charbon-text">
              📧 <a href="mailto:info@newinc.be" className="text-primary hover:text-primary-dark underline">info@newinc.be</a>
            </p>
            <p className="body-text text-charbon-text">
              Une preuve d'identité peut être demandée si nécessaire.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣2️⃣ Litiges et autorité de contrôle</h2>
            <p className="body-text text-charbon-text">
              En cas de désaccord, vous pouvez :
            </p>
            <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
              <li>d'abord nous contacter</li>
              <li>ensuite, si nécessaire, introduire une plainte auprès de l'Autorité de Protection des Données (Belgique).</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣3️⃣ Modifications de la présente politique</h2>
            <p className="body-text text-charbon-text">
              Cette politique peut évoluer.
            </p>
            <p className="body-text text-charbon-text">
              Les utilisateurs seront informés en cas de modifications importantes.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Section 14 */}
          <section className="space-y-3">
            <h2 className="heading-3">1️⃣4️⃣ Contact</h2>
            <p className="body-text text-charbon-text">
              Pour toute question relative à cette politique :
            </p>
            <p className="body-text text-charbon-text">
              📧 <a href="mailto:info@newinc.be" className="text-primary hover:text-primary-dark underline">info@newinc.be</a>
            </p>
          </section>
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

