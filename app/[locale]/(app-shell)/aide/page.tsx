import Link from 'next/link'

/**
 * Page d'aide et FAQ
 * Design propre et professionnel, typographie lisible
 */
export default function AidePage() {
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
          <h1 className="heading-1 mb-4">Aide & FAQ</h1>
          <p className="body-text text-charbon-secondary">
            Trouvez les réponses aux questions les plus fréquentes sur Lodgemarket
          </p>
        </div>

        {/* Contenu scrollable */}
        <div className="card p-8 md:p-12 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Question 1 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Comment créer une annonce ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Créer une annonce sur Lodgemarket est simple et rapide :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-charbon-text ml-4">
                <li>Connectez-vous à votre compte (ou créez-en un si vous n'en avez pas encore)</li>
                <li>Cliquez sur "Publier une annonce" dans le menu ou sur la page d'accueil</li>
                <li>Remplissez le formulaire avec les informations de votre matériel :
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Titre de l'annonce (clair et descriptif)</li>
                    <li>Catégorie (Bricolage & Outils, Jardinage & Extérieur, Événementiel & Fêtes, Audio & Musique, Sport & Loisirs, Transport & Mobilité, Multimédia & Électronique, Maison & Décoration, Cuisine & Électroménager, Autre)</li>
                    <li>Ville où se trouve le matériel</li>
                    <li>Prix par jour de location</li>
                    <li>Caution indicative (optionnelle)</li>
                    <li>Description détaillée du matériel</li>
                    <li>Règles spécifiques (optionnelles)</li>
                    <li>Photos (1 à 5 photos recommandées)</li>
                  </ul>
                </li>
                <li>Vérifiez vos informations et publiez votre annonce</li>
              </ol>
              <p className="body-text text-charbon-text">
                Votre annonce sera visible par tous les utilisateurs de la plateforme. Vous pourrez la modifier ou la supprimer à tout moment depuis la page "Mes annonces".
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question 2 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Comment contacter quelqu'un ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Pour contacter le propriétaire d'une annonce :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-charbon-text ml-4">
                <li>Consultez la page de détail de l'annonce qui vous intéresse</li>
                <li>Cliquez sur le bouton "Contacter le propriétaire"</li>
                <li>Une conversation s'ouvre automatiquement dans votre messagerie</li>
                <li>Échangez avec le propriétaire pour organiser la location</li>
              </ol>
              <p className="body-text text-charbon-text">
                <strong>Important :</strong> Vous devez être connecté pour contacter un propriétaire. La messagerie est privée et sécurisée. Vous recevrez une notification par email lorsqu'un nouveau message vous est envoyé.
              </p>
              <p className="body-text text-charbon-text">
                Vous pouvez accéder à toutes vos conversations depuis le menu "Messages" dans l'en-tête du site.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question 3 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Est-ce que le paiement se fait sur la plateforme ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                <strong className="text-brique">NON</strong>, Lodgemarket ne gère aucun paiement.
              </p>
              <p className="body-text text-charbon-text">
                Tous les paiements, remises de matériel et arrangements se font <strong>directement entre particuliers</strong>, hors de la plateforme.
              </p>
              <p className="body-text text-charbon-text">
                Lodgemarket est uniquement un outil de mise en relation. Nous ne sommes pas :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>Un intermédiaire de paiement</li>
                <li>Un garant des transactions</li>
                <li>Une assurance</li>
                <li>Un gestionnaire de litiges</li>
              </ul>
              <p className="body-text text-charbon-text">
                Les utilisateurs sont responsables de leurs propres transactions. Nous recommandons :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>Une remise en main propre du matériel</li>
                <li>La vérification de l'identité de votre interlocuteur</li>
                <li>Un accord clair sur les conditions (prix, durée, caution) avant la location</li>
                <li>Si nécessaire, la rédaction d'un document écrit entre vous</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question 4 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Qui est responsable ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                <strong>Les utilisateurs sont responsables entre eux</strong> de tous les aspects de leurs transactions.
              </p>
              <p className="body-text text-charbon-text">
                Lodgemarket n'intervient à aucun moment dans :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>Les accords entre utilisateurs</li>
                <li>Les paiements</li>
                <li>La remise et le retour du matériel</li>
                <li>La vérification de l'état du matériel</li>
                <li>La résolution de litiges</li>
              </ul>
              <p className="body-text text-charbon-text">
                Chaque utilisateur est responsable de :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>La véracité des informations publiées dans ses annonces</li>
                <li>L'état et la disponibilité du matériel proposé</li>
                <li>Le respect des accords conclus avec d'autres utilisateurs</li>
                <li>La sécurité et l'utilisation appropriée du matériel emprunté</li>
              </ul>
              <p className="body-text text-charbon-text">
                En cas de problème, les utilisateurs doivent se mettre d'accord entre eux. Lodgemarket ne peut être tenu responsable des litiges entre utilisateurs.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question 5 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Est-ce sécurisé ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Lodgemarket met en place plusieurs mesures pour assurer la sécurité de la plateforme :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li><strong>Authentification sécurisée :</strong> Vos mots de passe sont chiffrés et jamais visibles par notre équipe</li>
                <li><strong>Messagerie privée :</strong> Les conversations sont privées entre utilisateurs</li>
                <li><strong>Protection des données :</strong> Nous respectons le RGPD et ne vendons pas vos données</li>
                <li><strong>Modération :</strong> Nous surveillons la plateforme pour prévenir les abus</li>
              </ul>
              <p className="body-text text-charbon-text">
                <strong>Cependant,</strong> la sécurité dépend aussi de votre vigilance :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>Ne partagez jamais vos identifiants de connexion</li>
                <li>Vérifiez l'identité de votre interlocuteur avant toute transaction</li>
                <li>Méfiez-vous des offres trop belles pour être vraies</li>
                <li>Préférez les remises en main propre</li>
                <li>Ne communiquez pas vos coordonnées bancaires via la messagerie</li>
              </ul>
              <p className="body-text text-charbon-text">
                Pour plus d'informations sur la protection de vos données, consultez notre <Link href="/privacy" className="text-primary hover:text-primary-dark underline">Politique de Confidentialité</Link>.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question 6 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Que faire en cas de problème ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                En cas de problème avec une transaction ou un autre utilisateur :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-charbon-text ml-4">
                <li><strong>Essayez d'abord de résoudre le problème directement</strong> avec l'autre utilisateur via la messagerie</li>
                <li><strong>Si le problème persiste :</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Vérifiez que vous avez bien respecté les accords conclus</li>
                    <li>Conservez les échanges de messages comme preuve</li>
                    <li>Si nécessaire, rédigez un document récapitulatif de la situation</li>
                  </ul>
                </li>
                <li><strong>Signalez un comportement abusif :</strong> Si vous constatez un comportement suspect, frauduleux ou contraire aux règles d'utilisation, contactez-nous à <a href="mailto:info@newinc.be" className="text-primary hover:text-primary-dark underline">info@newinc.be</a></li>
                <li><strong>En cas de litige grave :</strong> Si la situation ne peut être résolue à l'amiable, vous pouvez faire appel aux autorités compétentes ou à un médiateur</li>
              </ol>
              <div className="bg-creme-50 border border-creme-200 rounded-xl p-4 mt-4">
                <p className="body-text text-charbon-text">
                  <strong>Important :</strong> Lodgemarket ne peut pas intervenir dans les litiges entre utilisateurs. Nous pouvons uniquement suspendre ou supprimer des comptes en cas de non-respect des règles d'utilisation.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question supplémentaire 1 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Comment modifier ou supprimer mon annonce ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Pour gérer vos annonces :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-charbon-text ml-4">
                <li>Connectez-vous à votre compte</li>
                <li>Accédez à la page "Mes annonces" depuis le menu</li>
                <li>Vous verrez toutes vos annonces publiées</li>
                <li>Cliquez sur "Modifier" pour mettre à jour une annonce</li>
                <li>Cliquez sur l'icône de suppression (🗑️) pour supprimer définitivement une annonce</li>
              </ol>
              <p className="body-text text-charbon-text">
                <strong>Note :</strong> La suppression d'une annonce est définitive. Assurez-vous qu'il n'y a pas de location en cours avant de supprimer.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question supplémentaire 2 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Puis-je voir qui a consulté mon annonce ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Oui ! Chaque annonce affiche le nombre de vues qu'elle a reçues. Ce compteur est visible sur :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>La page de détail de votre annonce</li>
                <li>La page "Mes annonces" dans la liste de vos annonces</li>
              </ul>
              <p className="body-text text-charbon-text">
                <strong>Note :</strong> Vos propres consultations de votre annonce ne sont pas comptabilisées dans le nombre de vues.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question supplémentaire 3 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Comment fonctionne la messagerie ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                La messagerie Lodgemarket permet d'échanger de manière privée avec d'autres utilisateurs :
              </p>
              <ul className="list-disc list-inside space-y-1 text-charbon-text ml-4">
                <li>Une conversation se crée automatiquement lorsque vous contactez le propriétaire d'une annonce</li>
                <li>Chaque conversation est liée à une annonce spécifique</li>
                <li>Vous recevez une notification par email lorsqu'un nouveau message vous est envoyé</li>
                <li>Un indicateur visuel vous signale les messages non lus</li>
                <li>Vous pouvez voir toutes vos conversations depuis le menu "Messages"</li>
              </ul>
              <p className="body-text text-charbon-text">
                <strong>Rappel :</strong> Respectez les règles de bonne conduite dans vos échanges. Le spam, le harcèlement ou les messages insultants peuvent entraîner la suspension de votre compte.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Question supplémentaire 4 */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Puis-je modifier mon profil ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Oui, vous pouvez modifier votre profil à tout moment :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-charbon-text ml-4">
                <li>Connectez-vous à votre compte</li>
                <li>Cliquez sur votre pseudo dans le menu en haut à droite</li>
                <li>Accédez à "Modifier mon profil"</li>
                <li>Mettez à jour vos informations (pseudo, ville, adresse, passions, photo de profil)</li>
                <li>Sauvegardez vos modifications</li>
              </ol>
              <p className="body-text text-charbon-text">
                <strong>Note :</strong> Votre email et votre mot de passe sont gérés séparément via les paramètres de votre compte.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="heading-3 text-primary">Besoin d'aide supplémentaire ?</h2>
            <div className="space-y-3">
              <p className="body-text text-charbon-text">
                Si vous ne trouvez pas la réponse à votre question dans cette FAQ, n'hésitez pas à nous contacter :
              </p>
              <p className="body-text text-charbon-text">
                📧 <a href="mailto:info@newinc.be" className="text-primary hover:text-primary-dark underline">info@newinc.be</a>
              </p>
              <p className="body-text text-charbon-text">
                Nous nous efforçons de répondre à toutes les demandes dans les meilleurs délais.
              </p>
            </div>
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

