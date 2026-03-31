export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-estate-surface px-4 py-16 font-estate text-estate-on-surface">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  )
}
