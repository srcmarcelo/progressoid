import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { VisitorActions } from './visitor-actions'

async function getVisitors() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('full_name')

  if (error) throw error
  return data
}

export default async function VisitorsPage() {
  const visitors = await getVisitors()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visitantes</h1>
          <p className="text-muted-foreground">
            Gerencie os visitantes cadastrados no sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/visitantes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Visitante
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Lista de Visitantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum visitante cadastrado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece cadastrando o primeiro visitante.
              </p>
              <Button asChild className="mt-4">
                <Link href="/visitantes/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Visitante
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">
                      {visitor.full_name}
                    </TableCell>
                    <TableCell>{visitor.document_id}</TableCell>
                    <TableCell>
                      {visitor.created_at
                        ? new Date(visitor.created_at).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <VisitorActions visitor={visitor} />
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
