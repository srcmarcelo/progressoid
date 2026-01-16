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
import { Plus, Building2 } from 'lucide-react'
import Link from 'next/link'
import { INSTITUTION_TYPE_LABELS } from '@/types'
import { InstitutionActions } from './institution-actions'

async function getInstitutions() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export default async function InstitutionsPage() {
  const institutions = await getInstitutions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Instituições</h1>
          <p className="text-muted-foreground">
            Gerencie as instituições cadastradas no sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/instituicoes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Instituição
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Lista de Instituições
          </CardTitle>
        </CardHeader>
        <CardContent>
          {institutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhuma instituição cadastrada
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece cadastrando a primeira instituição.
              </p>
              <Button asChild className="mt-4">
                <Link href="/instituicoes/nova">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Instituição
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cor Principal</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutions.map((institution) => (
                  <TableRow key={institution.id}>
                    <TableCell className="font-medium">
                      {institution.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {INSTITUTION_TYPE_LABELS[institution.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {institution.primary_color ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: institution.primary_color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {institution.primary_color}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {institution.created_at
                        ? new Date(institution.created_at).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <InstitutionActions institution={institution} />
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
