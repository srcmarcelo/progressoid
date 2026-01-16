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
import type { Staff, Institution, StaffRole } from '@/types'
import { STAFF_ROLE_LABELS } from '@/types'
import { Constants } from '@/lib/supabase/database.types'

interface StaffFormProps {
  staff?: Staff
  institutions: Institution[]
}

export function StaffForm({ staff, institutions }: StaffFormProps) {
  const router = useRouter()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    full_name: staff?.full_name || '',
    email: staff?.email || '',
    document_id: staff?.document_id || '',
    role: staff?.role || ('' as StaffRole),
    institution_id: staff?.institution_id || '',
    active: staff?.active ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataToSave = {
        ...formData,
        institution_id: formData.institution_id || null,
      }

      if (staff) {
        const { error } = await supabase
          .from('staff')
          .update(dataToSave)
          .eq('id', staff.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('staff').insert(dataToSave)

        if (error) throw error
      }

      router.push('/funcionarios')
      router.refresh()
    } catch (error) {
      console.error('Error saving staff:', error)
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
            placeholder="Ex: Maria da Silva"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Ex: maria@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document_id">Documento (CPF/RG)</Label>
          <Input
            id="document_id"
            value={formData.document_id}
            onChange={(e) =>
              setFormData({ ...formData, document_id: e.target.value })
            }
            placeholder="Ex: 123.456.789-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Cargo *</Label>
          <Select
            value={formData.role}
            onValueChange={(value: StaffRole) =>
              setFormData({ ...formData, role: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              {Constants.public.Enums.staff_role.map((role) => (
                <SelectItem key={role} value={role}>
                  {STAFF_ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution_id">Instituição</Label>
          <Select
            value={formData.institution_id}
            onValueChange={(value: string) =>
              setFormData({ ...formData, institution_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a instituição" />
            </SelectTrigger>
            <SelectContent>
              {institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.id}>
                  {institution.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="active">Status</Label>
          <Select
            value={formData.active ? 'true' : 'false'}
            onValueChange={(value: string) =>
              setFormData({ ...formData, active: value === 'true' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Salvando...'
            : staff
            ? 'Atualizar Funcionário'
            : 'Cadastrar Funcionário'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/funcionarios')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
