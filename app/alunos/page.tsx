import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { StudentActions } from './student-actions'

async function getStudents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select('*, institutions(name)')
    .order('full_name')

  if (error) throw error
  return data
}

export default async function StudentsPage() {
  const students = await getStudents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos cadastrados no sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/alunos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Lista de Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum aluno cadastrado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece cadastrando o primeiro aluno.
              </p>
              <Button asChild className="mt-4">
                <Link href="/alunos/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Aluno
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.full_name}
                    </TableCell>
                    <TableCell>{student.student_id_card || '-'}</TableCell>
                    <TableCell>{student.document_id || '-'}</TableCell>
                    <TableCell>
                      {student.institutions?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.active ? 'success' : 'secondary'}>
                        {student.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StudentActions student={student} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
