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
import { Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { STAFF_ROLE_LABELS } from '@/types'
import { StaffActions } from './staff-actions'

async function getStaff() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*, institutions(name)')
    .order('full_name')

  if (error) throw error
  return data
}

export default async function StaffPage() {
  const staff = await getStaff()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários cadastrados no sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/funcionarios/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Funcionários
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum funcionário cadastrado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece cadastrando o primeiro funcionário.
              </p>
              <Button asChild className="mt-4">
                <Link href="/funcionarios/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Funcionário
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.full_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {STAFF_ROLE_LABELS[member.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.email || '-'}</TableCell>
                    <TableCell>
                      {member.institutions?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.active ? 'success' : 'secondary'}>
                        {member.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StaffActions staff={member} />
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
