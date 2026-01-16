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
import { Plus, IdCard } from 'lucide-react'
import Link from 'next/link'
import { BADGE_STATUS_LABELS } from '@/types'
import { VisitorBadgeActions } from './visitor-badge-actions'

async function getVisitorBadges() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitor_badges')
    .select('*')
    .order('badge_number')

  if (error) throw error
  return data
}

export default async function VisitorBadgesPage() {
  const badges = await getVisitorBadges()

  const getBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'in_use':
        return 'warning'
      case 'lost':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crachás de Visitantes</h1>
          <p className="text-muted-foreground">
            Gerencie os crachás disponíveis para visitantes
          </p>
        </div>
        <Button asChild>
          <Link href="/crachas-visitantes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Crachá
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            Lista de Crachás
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IdCard className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum crachá cadastrado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece cadastrando o primeiro crachá de visitante.
              </p>
              <Button asChild className="mt-4">
                <Link href="/crachas-visitantes/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Crachá
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número do Crachá</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badges.map((badge) => (
                  <TableRow key={badge.id}>
                    <TableCell className="font-medium">
                      {badge.badge_number}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(badge.status)}>
                        {badge.status ? BADGE_STATUS_LABELS[badge.status] : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {badge.updated_at
                        ? new Date(badge.updated_at).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <VisitorBadgeActions badge={badge} />
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
