import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ClipboardList, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MOVEMENT_TYPE_LABELS } from '@/types'

async function getAccessLogs() {
  const supabase = await createClient()

  const { data: accessLogs, error: accessError } = await supabase
    .from('access_logs')
    .select('*, students(full_name), staff(full_name)')
    .order('timestamp', { ascending: false })
    .limit(100)

  const { data: visits, error: visitsError } = await supabase
    .from('visits')
    .select('*, visitors(full_name), visitor_badges(badge_number)')
    .order('timestamp', { ascending: false })
    .limit(100)

  if (accessError) throw accessError
  if (visitsError) throw visitsError

  // Combine and sort all logs
  const allLogs = [
    ...(accessLogs || []).map((log) => ({
      id: log.id,
      timestamp: log.timestamp,
      direction: log.direction,
      personName: log.students?.full_name || log.staff?.full_name || 'Desconhecido',
      personType: log.students ? 'Aluno' : 'Funcionário',
      isVisitor: false as const,
      badgeNumber: undefined as string | undefined,
      reason: undefined as string | undefined,
    })),
    ...(visits || []).map((visit) => ({
      id: visit.id,
      timestamp: visit.timestamp,
      direction: visit.direction,
      personName: visit.visitors?.full_name || 'Visitante',
      personType: 'Visitante',
      badgeNumber: visit.visitor_badges?.badge_number,
      reason: visit.reason,
      isVisitor: true as const,
    })),
  ].sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return dateB - dateA
  })

  return allLogs.slice(0, 100)
}

export default async function RegistrosPage() {
  const logs = await getAccessLogs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registros de Acesso</h1>
        <p className="text-muted-foreground">
          Histórico de entradas e saídas do prédio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Últimos 100 Registros
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum registro encontrado
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Os registros de acesso aparecerão aqui.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Direção</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {log.timestamp
                        ? format(
                            new Date(log.timestamp),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={log.direction === 'entry' ? 'success' : 'destructive'}
                        className="gap-1"
                      >
                        {log.direction === 'entry' ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {MOVEMENT_TYPE_LABELS[log.direction]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.personName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.personType}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.isVisitor && log.badgeNumber && (
                        <span>Crachá: {log.badgeNumber}</span>
                      )}
                      {log.isVisitor && log.reason && (
                        <span className="ml-2">Motivo: {log.reason}</span>
                      )}
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
