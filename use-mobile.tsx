import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const senderName = formData.get('senderName') as string

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    if (!senderName) {
      return NextResponse.json({ error: 'Nome do remetente é obrigatório' }, { status: 400 })
    }

    // Upload para Vercel Blob (público para exibir na galeria)
    const blob = await put(`wedding-photos/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Salvar referência no Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('wedding_photos')
      .insert({
        sender_name: senderName,
        blob_url: blob.url,
        blob_pathname: blob.pathname,
        filename: file.name,
      })

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError)
      return NextResponse.json({ error: 'Erro ao salvar foto' }, { status: 500 })
    }

    return NextResponse.json({ 
      url: blob.url,
      pathname: blob.pathname 
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
  }
}
