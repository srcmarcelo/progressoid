import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { StudentForm } from '../student-form'

async function getInstitutions() {
  const supabase = await createClient()
  const { data } = await supabase.from('institutions').select('*').order('name')
  return data || []
}

export default async function NewStudentPage() {
  const institutions = await getInstitutions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Aluno</h1>
        <p className="text-muted-foreground">
          Cadastre um novo aluno no sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Dados do Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm institutions={institutions} />
        </CardContent>
      </Card>
    </div>
  )
}
