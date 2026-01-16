import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { StaffForm } from '../staff-form'

async function getInstitutions() {
  const supabase = await createClient()
  const { data } = await supabase.from('institutions').select('*').order('name')
  return data || []
}

export default async function NewStaffPage() {
  const institutions = await getInstitutions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Funcionário</h1>
        <p className="text-muted-foreground">
          Cadastre um novo funcionário no sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dados do Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StaffForm institutions={institutions} />
        </CardContent>
      </Card>
    </div>
  )
}
