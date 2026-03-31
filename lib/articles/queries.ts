import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export type ArticleSummary = {
  id: string
  slug: string
  title: string
  content: string
  created_at: string
}

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, content, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPublishedArticles', error.message)
    return []
  }
  return (data ?? []) as ArticleSummary[]
}

export async function getPublishedArticleBySlug(
  slug: string
): Promise<ArticleSummary | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, content, created_at')
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('getPublishedArticleBySlug', error.message)
    return null
  }
  return data as ArticleSummary | null
}
