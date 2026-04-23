import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: photos, error } = await supabase
      .from('wedding_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar fotos:', error)
      return NextResponse.json({ error: 'Erro ao buscar fotos' }, { status: 500 })
    }

    return NextResponse.json({ photos: photos || [] })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Falha ao buscar fotos' }, { status: 500 })
  }
}
