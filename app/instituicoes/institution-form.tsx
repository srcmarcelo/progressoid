'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSupabase } from '@/hooks/use-supabase'
import type { Institution, InstitutionType } from '@/types'
import { INSTITUTION_TYPE_LABELS } from '@/types'
import { Constants } from '@/lib/supabase/database.types'

interface InstitutionFormProps {
  institution?: Institution
}

export function InstitutionForm({ institution }: InstitutionFormProps) {
  const router = useRouter()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: institution?.name || '',
    type: institution?.type || ('' as InstitutionType),
    primary_color: institution?.primary_color || '#3b82f6',
    secondary_color: institution?.secondary_color || '#1e40af',
    logo_url: institution?.logo_url || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (institution) {
        const { error } = await supabase
          .from('institutions')
          .update(formData)
          .eq('id', institution.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('institutions').insert(formData)

        if (error) throw error
      }

      router.push('/instituicoes')
      router.refresh()
    } catch (error) {
      console.error('Error saving institution:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Instituição *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Colégio São Paulo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: InstitutionType) =>
              setFormData({ ...formData, type: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {Constants.public.Enums.institution_type.map((type) => (
                <SelectItem key={type} value={type}>
                  {INSTITUTION_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary_color">Cor Principal</Label>
          <div className="flex gap-2">
            <Input
              id="primary_color"
              type="color"
              value={formData.primary_color}
              onChange={(e) =>
                setFormData({ ...formData, primary_color: e.target.value })
              }
              className="h-9 w-16 p-1"
            />
            <Input
              value={formData.primary_color}
              onChange={(e) =>
                setFormData({ ...formData, primary_color: e.target.value })
              }
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary_color">Cor Secundária</Label>
          <div className="flex gap-2">
            <Input
              id="secondary_color"
              type="color"
              value={formData.secondary_color}
              onChange={(e) =>
                setFormData({ ...formData, secondary_color: e.target.value })
              }
              className="h-9 w-16 p-1"
            />
            <Input
              value={formData.secondary_color}
              onChange={(e) =>
                setFormData({ ...formData, secondary_color: e.target.value })
              }
              placeholder="#1e40af"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo_url">URL do Logo</Label>
          <Input
            id="logo_url"
            type="url"
            value={formData.logo_url}
            onChange={(e) =>
              setFormData({ ...formData, logo_url: e.target.value })
            }
            placeholder="https://exemplo.com/logo.png"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Salvando...'
            : institution
            ? 'Atualizar Instituição'
            : 'Cadastrar Instituição'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/instituicoes')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
