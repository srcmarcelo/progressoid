import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { StaffForm } from '../../staff-form'
import { notFound } from 'next/navigation'

interface EditStaffPageProps {
  params: Promise<{ id: string }>
}

async function getStaff(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

async function getInstitutions() {
  const supabase = await createClient()
  const { data } = await supabase.from('institutions').select('*').order('name')
  return data || []
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params
  const [staff, institutions] = await Promise.all([
    getStaff(id),
    getInstitutions(),
  ])

  if (!staff) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Funcionário</h1>
        <p className="text-muted-foreground">Atualize os dados do funcionário</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dados do Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StaffForm staff={staff} institutions={institutions} />
        </CardContent>
      </Card>
    </div>
  )
}
