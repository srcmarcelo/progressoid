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
import type { VisitorBadge, BadgeStatus } from '@/types'
import { BADGE_STATUS_LABELS } from '@/types'
import { Constants } from '@/lib/supabase/database.types'

interface VisitorBadgeFormProps {
  badge?: VisitorBadge
}

export function VisitorBadgeForm({ badge }: VisitorBadgeFormProps) {
  const router = useRouter()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    badge_number: badge?.badge_number || '',
    status: badge?.status || ('available' as BadgeStatus),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (badge) {
        const { error } = await supabase
          .from('visitor_badges')
          .update(formData)
          .eq('id', badge.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('visitor_badges').insert(formData)

        if (error) throw error
      }

      router.push('/crachas-visitantes')
      router.refresh()
    } catch (error) {
      console.error('Error saving badge:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="badge_number">Número do Crachá *</Label>
          <Input
            id="badge_number"
            value={formData.badge_number}
            onChange={(e) =>
              setFormData({ ...formData, badge_number: e.target.value })
            }
            placeholder="Ex: V001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: BadgeStatus) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Constants.public.Enums.badge_status.map((status) => (
                <SelectItem key={status} value={status}>
                  {BADGE_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Salvando...'
            : badge
            ? 'Atualizar Crachá'
            : 'Cadastrar Crachá'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/crachas-visitantes')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
