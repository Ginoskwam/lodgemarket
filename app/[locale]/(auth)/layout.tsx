/**
 * Auth plan produit : pages centrées (login, register, onboarding…).
 * Les implémentations actuelles restent sous /auth/* ; les chemins courts redirigent.
 */
export default function AuthPlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-estate-surface px-4 py-12 font-estate">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
