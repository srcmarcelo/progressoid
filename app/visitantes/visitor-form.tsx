'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSupabase } from '@/hooks/use-supabase'
import type { Visitor } from '@/types'

interface VisitorFormProps {
  visitor?: Visitor
}

export function VisitorForm({ visitor }: VisitorFormProps) {
  const router = useRouter()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    full_name: visitor?.full_name || '',
    document_id: visitor?.document_id || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (visitor) {
        const { error } = await supabase
          .from('visitors')
          .update(formData)
          .eq('id', visitor.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('visitors').insert(formData)

        if (error) throw error
      }

      router.push('/visitantes')
      router.refresh()
    } catch (error) {
      console.error('Error saving visitor:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="Ex: Carlos Oliveira"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document_id">Documento (CPF/RG) *</Label>
          <Input
            id="document_id"
            value={formData.document_id}
            onChange={(e) =>
              setFormData({ ...formData, document_id: e.target.value })
            }
            placeholder="Ex: 123.456.789-00"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Salvando...'
            : visitor
            ? 'Atualizar Visitante'
            : 'Cadastrar Visitante'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/visitantes')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
