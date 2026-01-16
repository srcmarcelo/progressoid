import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { StudentForm } from '../../student-form'
import { notFound } from 'next/navigation'

interface EditStudentPageProps {
  params: Promise<{ id: string }>
}

async function getStudent(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
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

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params
  const [student, institutions] = await Promise.all([
    getStudent(id),
    getInstitutions(),
  ])

  if (!student) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Aluno</h1>
        <p className="text-muted-foreground">Atualize os dados do aluno</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Dados do Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm student={student} institutions={institutions} />
        </CardContent>
      </Card>
    </div>
  )
}
