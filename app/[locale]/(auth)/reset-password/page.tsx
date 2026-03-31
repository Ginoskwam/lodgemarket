import { redirect } from 'next/navigation'

export default async function ResetPasswordAliasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`/${locale}/auth/reset-password`)
}
