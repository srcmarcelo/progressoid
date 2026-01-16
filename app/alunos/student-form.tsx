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
import type { Student, Institution } from '@/types'

interface StudentFormProps {
  student?: Student
  institutions: Institution[]
}

export function StudentForm({ student, institutions }: StudentFormProps) {
  const router = useRouter()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    full_name: student?.full_name || '',
    document_id: student?.document_id || '',
    student_id_card: student?.student_id_card || '',
    institution_id: student?.institution_id || '',
    active: student?.active ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataToSave = {
        ...formData,
        institution_id: formData.institution_id || null,
      }

      if (student) {
        const { error } = await supabase
          .from('students')
          .update(dataToSave)
          .eq('id', student.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('students').insert(dataToSave)

        if (error) throw error
      }

      router.push('/alunos')
      router.refresh()
    } catch (error) {
      console.error('Error saving student:', error)
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
            placeholder="Ex: João da Silva"
            required
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
          <Label htmlFor="student_id_card">Matrícula</Label>
          <Input
            id="student_id_card"
            value={formData.student_id_card}
            onChange={(e) =>
              setFormData({ ...formData, student_id_card: e.target.value })
            }
            placeholder="Ex: 2024001"
          />
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
            : student
            ? 'Atualizar Aluno'
            : 'Cadastrar Aluno'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/alunos')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
